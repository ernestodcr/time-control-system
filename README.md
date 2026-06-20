# ⏱️ Sistema de Control Horario y Portal del Empleado (Full-Stack)

Este proyecto es una aplicación web **Full-Stack comercial** para la gestión de jornadas laborales y control horario de trabajadores. Diseñado con una arquitectura modular y elástica, el sistema permite a los empleados iniciar sesión de forma segura, visualizar su jornada en un reloj en tiempo real y registrar sus marcas de entrada y salida, actualizando el historial al instante sin recargar la página.

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue una estructura de **Monorrepo** empresarial dividida en dos grandes capas desacopladas que se comunican de forma asíncrona mediante el protocolo HTTP:

1. **Frontend (Cliente):** Desarrollado con **Angular 21**, implementando una arquitectura SPA (Single Page Application) fluida, responsiva y adaptada a cualquier dispositivo móvil, tablet o PC.
2. **Backend (Servidor y Persistencia):** Desarrollado con **FastAPI (Python)** para la construcción de una API REST ágil, y **SQLite** como motor de base de datos relacional persistente.

---

## 🛠️ Tecnologías y Características Técnicas

### 💻 Frontend (Angular 21)
* **Arquitectura por Dominios:** Organización de pantallas y componentes dentro del directorio `features/` (`login`, `dashboard`) para asegurar la escalabilidad del código.
* **Navegación SPA:** Uso del enrutador nativo de Angular (`app.routes.ts`) y la directiva `<router-outlet>` para evitar recargas completas del navegador.
* **Desconexión Asíncrona (Zoneless):** Optimización del rendimiento de renderizado mediante la inyección del detector de cambios explícito `ChangeDetectorRef` en flujos basados en temporizadores de fondo (`setInterval`).
* **Comunicación Cliente-Servidor:** Desacoplamiento de la red mediante servicios inyectables globales (`AuthService`) que consumen la API a través de **Observables (`rxjs`)** y `HttpClient`.
* **Almacenamiento de Sesión:** Persistencia local del estado del operario mediante `localStorage` con serialización JSON.

### 🐍 Backend (FastAPI & Python)
* **Enrutamiento Modular:** División de controladores mediante `APIRouter` para aislar el contexto de autenticación (`auth.py`) del contexto de control horario (`fichajes.py`).
* **Validación de Datos (Pydantic):** Capa de control de calidad que audita las peticiones entrantes mediante tipado estricto y el uso de constructores nativos de Python (`typing.Literal`).
* **Seguridad CORS:** Middleware configurado de forma restrictiva para autorizar peticiones exclusivas procedentes del puerto del cliente web (`http://localhost:4200`).
* **Persistencia Relacional:** Base de datos SQLite integrada con integridad referencial a través de claves foráneas (`FOREIGN KEY`) y consultas optimizadas mediante uniones de tablas (`JOIN`).

---

## 📦 Estructura del Repositorio

```text
time-control-system/
├── backend/                  # Servidor y API en Python
│   ├── database.py           # Script de inicialización de tablas SQLite
│   ├── main.py               # Punto de entrada central de FastAPI y CORS
│   ├── routers/              # Enrutadores modulares de la API
│   │   ├── auth.py           # Lógica de Login y autenticación
│   │   └── fichajes.py       # Lógica de registro e historial GET/POST
│   └── schemas/              # Modelos de validación Pydantic
│       ├── auth.py
│       └── fichajes.py
└── frontend/                 # Aplicación Cliente Web
    └── src/
        └── app/
            ├── app.config.ts # Configuración global de proveedores (HttpClient)
            ├── app.routes.ts # Mapa de navegación de la SPA
            ├── app.html      # Contenedor raíz de navegación
            ├── core/         # Servicios de infraestructura de red
            │   └── services/
            │       └── auth.ts
            └── features/     # Módulos y funcionalidades de negocio
                ├── login/    # Vista y lógica de inicio de sesión
                └── dashboard/# Panel principal, reloj dinámico e historial
```

---

## 🚀 Instrucciones de Arranque en Desarrollo

### 1. Servidor Backend
Navega a la carpeta de backend, activa tu entorno virtual de Python e inicia el servidor de desarrollo:
```bash
cd backend
python -m venv venv
# Activar entorno (Windows: .\venv\Scripts\activate)
pip install fastapi uvicorn pydantic
python database.py
uvicorn main:app --reload
```
*El servidor estará disponible en:* `http://localhost:8000`

### 2. Cliente Frontend
Navega a la carpeta de frontend, instala las dependencias de Node.js e inicia el compilador en vivo de Angular:
```bash
cd frontend
npm install
ng serve
```
*La aplicación estará disponible en:* `http://localhost:4200`

---

## 👥 Usuarios de Prueba Registrados en el Sistema
Para evaluar el inicio de sesión y el dinamismo del panel, el script de la base de datos inyecta automáticamente los siguientes perfiles de desarrollo:
* **Juan Pérez (Empleado):** `juan.perez@empresa.com` | Clave: `1234`
* **Ana López (Administradora):** `ana.lopez@empresa.com` | Clave: `9012`
