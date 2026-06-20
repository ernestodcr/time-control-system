from fastapi import APIRouter, HTTPException
from schemas.auth import LoginRequest
import sqlite3

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

@router.post("/login")
def login(data: LoginRequest):
    connection = sqlite3.connect("empresa.db")
    cursor = connection.cursor()

    cursor.execute("""
       SELECT id, usuario, correo, nombre_completo, rol
       FROM empleados
       WHERE correo = ? AND clave = ?            
    """, (data.email, data.password))

    user = cursor.fetchone()
    connection.close()

    if not user:
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

    return {
       "id": user[0],
       "username": user[1],
       "email": user[2],
       "full_name": user[3],
       "role": user[4] 
    }
