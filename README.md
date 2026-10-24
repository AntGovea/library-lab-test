# BookSpace

## Requisitos

- Node.js y npm
- Docker y Docker Compose

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd BookSpace
```

### 2. Configurar variables de entorno

Configura los archivos `.env` necesarios para el backend y la base de datos, de acuerdo con la configuración del proyecto.

### 3. Iniciar la base de datos

Desde la raíz del proyecto, ejecuta:

```bash
docker compose up -d
```

### 4. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 5. Iniciar el backend

```bash
npm run dev
```

### 6. Instalar dependencias del frontend

Abre otra terminal desde la raíz del proyecto:

```bash
cd frontend
npm install
```

### 7. Iniciar el frontend

```bash
npm run dev
```

Abre en el navegador la URL local que muestre Vite.

## Detener el proyecto

Para detener el frontend y el backend, presiona `Ctrl + C` en sus respectivas terminales.

Para detener los contenedores:

```bash
docker compose down
```
