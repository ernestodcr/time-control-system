import sqlite3
import os

def create_BD():
    connection = sqlite3.connect("empresa.db")
    cursor = connection.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS empleados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT UNIQUE NOT NULL,
        correo TEXT UNIQUE NOT NULL,
        clave TEXT NOT NULL,
        nombre_completo TEXT NOT NULL,
        rol TEXT NOT NULL
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS fichajes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        empleado_id INTEGER NOT NULL,
        tipo TEXT NOT NULL,
        fecha_hora TEXT NOT NULL,
        FOREIGN KEY (empleado_id) REFERENCES empleados (id)
    )
    """)

    # Datos iniciales para entorno desarrollo y pruebas de login
    cursor.execute("SELECT COUNT(*) FROM empleados")
    if cursor.fetchone()[0] == 0:
        test_users = [
            ("juanperez", "juan.perez@empresa.com", "1234", "Juan Pérez Gómez", "empleado"),
            ("mariagomez", "maria.gomez@empresa.com", "abcd", "María Gómez Ruiz", "empleado"),
            ("carlosmartin", "carlos.martin@empresa.com", "5678", "Carlos Martín Sánz", "empleado"),
            ("analopez", "ana.lopez@empresa.com", "9012", "Ana López Garrido", "admin"),
            ("davidruiz", "david.ruiz@empresa.com", "qwer", "David Ruiz Peña", "empleado")
        ]
        cursor.executemany("""
        INSERT INTO empleados (usuario, correo, clave, nombre_completo, rol)
        VALUES (?,?,?,?,?)
        """, test_users)

        print("Base de datos creada y 5 usuarios de prueba insertados con éxito")
    else:
        print("La base de datos ya existe con sus usuarios")
    
    connection.commit()
    connection.close()

if __name__ == "__main__":
    create_BD()