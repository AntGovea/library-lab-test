# 📚 BookSpace — Sistema de gestión de biblioteca

Aplicación web para administrar el catálogo de libros y controlar las existencias de una biblioteca. El proyecto está dividido en frontend y backend, con persistencia de datos en PostgreSQL y una API REST para la comunicación entre ambos.

## 🎯 Objetivo

Desarrollar una aplicación que permita gestionar libros mediante operaciones CRUD (*Create, Read, Update, Delete*), consultar información, validar los datos recibidos y mantener una estructura de código modular, legible y fácil de mantener.

## 🛠️ Tecnologías

### Frontend
- React
- Vite
- Tailwind CSS
- JavaScript
- Lucide React

### Backend
- Node.js
- Express
- PostgreSQL
- API REST
- Middleware para validación y manejo de errores

### Herramientas
- Git y GitHub
- Docker, si está habilitado en la configuración del proyecto

## 📂 Estructura del proyecto

```text
BookSpace/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   ├── errors/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   └── services/
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

## ✨ Funcionalidades

- **Catálogo de libros:** consultar y administrar los registros.
- **Búsqueda:** localizar libros mediante los criterios implementados en la API.
- **Inventario:** consultar y controlar existencias.
- **CRUD de libros:** crear, consultar, actualizar y eliminar registros.
- **Validaciones:** comprobar los datos antes de procesarlos.
- **Manejo de errores:** responder con códigos HTTP y mensajes apropiados.
- **Documentación API:** consultar los endpoints disponibles mediante la interfaz y el endpoint de documentación.
- **Dashboard:** pantalla principal para acceder a los módulos.

> Las funcionalidades deben considerarse disponibles únicamente cuando estén implementadas y verificadas en el entorno de ejecución.

## ⚙️ Requisitos previos

- Node.js y npm.
- PostgreSQL.
- Git.
- Un navegador moderno.
- Docker y Docker Compose, si se utiliza la configuración de contenedores.

## 🚀 Instalación

Clona el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd BookSpace
```

### 1. Configurar el backend

```bash
cd backend
npm install
```

Configura las variables de entorno necesarias para la conexión a PostgreSQL y los demás parámetros de la aplicación. Consulta el archivo de configuración del backend para identificar los nombres exactos requeridos.

### 2. Preparar la base de datos

Crea la base de datos en PostgreSQL y ejecuta el esquema:

```bash
psql -U <USUARIO> -d <BASE_DE_DATOS> -f src/database/schema.sql
```

Si necesitas registros de prueba, revisa `src/database/seed.js` y ejecútalo mediante el comando configurado en el proyecto o el procedimiento definido para ese archivo.

### 3. Iniciar el backend

Desde `backend/`, utiliza el script correspondiente de `package.json`. Por ejemplo, si existe el script `dev`:

```bash
npm run dev
```

### 4. Configurar e iniciar el frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abre en el navegador la dirección local que muestre Vite.

**Nota:** los comandos de inicio dependen de los scripts definidos en cada `package.json`. Verifica sus nombres antes de ejecutar o documentar otros comandos.

## 🔌 API REST

El backend proporciona endpoints para comprobar el estado del servicio y gestionar libros.

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/health` | Comprueba que la API responde. |
| GET | `/ready` | Comprueba la disponibilidad de la base de datos. |
| GET | `/api/books` | Consulta los libros. |
| GET | `/api/books/:id` | Consulta un libro por ID. |
| POST | `/api/books` | Crea un libro. |
| PUT | `/api/books/:id` | Actualiza un libro. |
| DELETE | `/api/books/:id` | Elimina un libro. |
| GET | `/api/docs` | Consulta la documentación de la API. |

Los endpoints relacionados con compras e inventario deben añadirse a esta tabla con sus rutas y métodos exactos una vez verificados en el código.

### Formato de respuesta

Las respuestas se intercambian en formato JSON. Los códigos HTTP indican el resultado de la operación; por ejemplo:

- `200 OK`: solicitud procesada correctamente.
- `201 Created`: recurso creado.
- `400 Bad Request`: solicitud o datos inválidos.
- `404 Not Found`: recurso no encontrado.
- `409 Conflict`: conflicto con el estado actual o con una restricción de datos.
- `500 Internal Server Error`: error inesperado del servidor.
- `503 Service Unavailable`: servicio o dependencia no disponible.

Los códigos concretos dependen de la implementación de cada endpoint.

## 🧱 Arquitectura y organización

El backend separa las responsabilidades para facilitar el mantenimiento:

- **Routes:** definen los endpoints y los métodos HTTP.
- **Services:** coordinan la lógica de negocio.
- **Repositories:** encapsulan las operaciones de acceso a datos.
- **Middlewares:** ejecutan validaciones y tareas comunes durante el procesamiento de las peticiones.
- **Errors:** centralizan el manejo de errores de la aplicación.
- **Database:** contiene el esquema y los recursos relacionados con PostgreSQL.

El frontend separa la interfaz, los servicios de comunicación con la API, las constantes y las utilidades de validación.

Esta organización permite modificar una parte del sistema sin concentrar toda la lógica en un único archivo.

## 🔒 Consideraciones de seguridad

- Validar los datos recibidos desde el cliente.
- Utilizar consultas parametrizadas para reducir el riesgo de inyección SQL.
- Mantener las credenciales fuera del control de versiones.
- No exponer información sensible en los mensajes de error.
- Configurar CORS y las cabeceras de seguridad según el entorno de ejecución.

## 🧪 Pruebas

Antes de considerar terminada una funcionalidad, comprobar:

- Que los endpoints respondan con los códigos HTTP esperados.
- Que las validaciones rechacen datos incorrectos.
- Que las operaciones CRUD persistan los cambios en PostgreSQL.
- Que los errores se gestionen sin detener el servidor.
- Que el frontend refleje correctamente las respuestas de la API.

Si existen pruebas automatizadas configuradas, ejecutar el script correspondiente definido en `package.json`.

## 🌱 Control de versiones

El proyecto utiliza Git para registrar los cambios de manera incremental. Los commits siguen, cuando corresponde, la convención *Conventional Commits*.

Ejemplos:

```text
feat(db): update book schema
feat(back): implement book CRUD endpoints
feat(front): add inventory management module
test: add CRUD validation tests
docs: update project README
```

## 📌 Estado del proyecto

Proyecto en desarrollo. Las funcionalidades, instrucciones de instalación y endpoints descritos deben verificarse contra la versión actual del código antes de utilizar este documento como especificación