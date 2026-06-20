from fastapi import APIRouter, HTTPException
from schemas.fichajes import FichajeRequest
from datetime import datetime
import sqlite3

# Enrutador modular para el control horario
router = APIRouter(
    prefix="/api/fichajes",
    tags=["Fichajes"]
)

@router.post("/registrar")
def registrar_fichaje(data: FichajeRequest):
    connection = sqlite3.connect("empresa.db")
    cursor = connection.cursor()
    
    cursor.execute("SELECT id FROM empleados WHERE id = ?", (data.empleado_id,))
    if not cursor.fetchone():
        connection.close()
        raise HTTPException(status_code=404, detail="El empleado especificado no existe")
        
    fecha_hora_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    cursor.execute("""
        INSERT INTO fichajes (empleado_id, tipo, fecha_hora)
        VALUES (?, ?, ?)
    """, (data.empleado_id, data.tipo, fecha_hora_actual))
    
    connection.commit()
    connection.close()
    
    return {
        "status": "success",
        "message": f"Fichaje de {data.tipo} registrado correctamente",
        "timestamp": fecha_hora_actual
    }

@router.get("/empleado/{empleado_id}")
def obtener_fichajes(empleado_id: int):
    connection = sqlite3.connect("empresa.db")
    cursor = connection.cursor()
    
    # Buscamos todos los registros de la tabla ordenados del más reciente al más antiguo
    cursor.execute("""
        SELECT id, tipo, fecha_hora 
        FROM fichajes 
        WHERE empleado_id = ?
        ORDER BY id DESC
    """, (empleado_id,))
    
    rows = cursor.fetchall()
    connection.close()
    
    # Formateamos los datos en una lista de diccionarios limpia para Angular
    historial = []
    for r in rows:
        historial.append({
            "id": r[0],
            "tipo": r[1],
            "fecha_hora": r[2]
        })
        
    return historial
