# Biblioteca — Roadmap del proyecto

## Objetivo

Construir una aplicación de biblioteca con frontend y backend separados, API REST, PostgreSQL, pruebas automatizadas y funcionales, documentación, Docker y un pipeline de integración continua con Jenkins.

**Reglas de trabajo**
- [ ] Completar las fases progresivamente.
- [ ] Crear commits pequeños y descriptivos.
- [ ] No marcar pruebas como aprobadas sin ejecutarlas.
- [ ] Priorizar código legible, seguro, modular y fácil de mantener.
- [ ] Evitar complejidad innecesaria para el alcance del reto.

---

## Fase 1. Git y estructura del repositorio

- [ ] Crear la estructura raíz del proyecto.
  - [ ] `backend/`
  - [ ] `frontend/`
  - [ ] `database/`
  - [ ] `docs/`
- [ ] Inicializar Git en la raíz.
- [ ] Crear `.gitignore`.
  - [ ] Ignorar `node_modules/`.
  - [ ] Ignorar archivos `.env` y secretos.
  - [ ] Ignorar archivos generados de cobertura y compilación.
- [ ] Crear `.env.example` sin credenciales reales.
- [ ] Mantener `package-lock.json` versionado.
- [ ] Registrar la versión de Node en `backend/.nvmrc`.
- [ ] Crear `README.md` inicial.
- [ ] Crear el primer commit.

### Convención de commits

Formato: `tipo(alcance): descripción breve`

- `feat`: nueva funcionalidad.
  - Ejemplo: `feat(books): add book creation`
- `fix`: corrección de errores.
  - Ejemplo: `fix(books): handle duplicate IDs`
- `test`: pruebas automatizadas.
  - Ejemplo: `test(books): cover ID generation`
- `refactor`: mejorar estructura sin cambiar comportamiento.
- `docs`: documentación.
- `chore`: mantenimiento y configuración.
- `build`: dependencias y construcción.
- `ci`: integración continua.

Buenas prácticas:
- [ ] Describir un cambio lógico por commit.
- [ ] Usar el imperativo en inglés para mantener consistencia.
- [ ] Evitar mensajes como `cambios`, `avance` o `final`.
- [ ] Revisar `git status` antes de cada commit.
- [ ] No incluir secretos ni archivos innecesarios.

---

## Fase 2. Requisitos y arquitectura

- [ ] Definir los campos del libro.
  - [ ] Título.
  - [ ] Autor.
  - [ ] Género.
  - [ ] Año de publicación.
- [ ] Definir las operaciones CRUD.
  - [ ] Crear libro.
  - [ ] Listar libros.
  - [ ] Consultar libro por ID.
  - [ ] Actualizar libro.
  - [ ] Eliminar libro.
- [ ] Definir el formato del ID: una letra mayúscula y dos dígitos, por ejemplo `A12`.
- [ ] Definir qué sucede si se genera un ID duplicado.
- [ ] Definir validaciones y códigos HTTP esperados.
- [ ] Documentar la arquitectura en `docs/arquitectura.md`.
- [ ] Establecer las responsabilidades:
  - [ ] Frontend: interfaz de usuario.
  - [ ] Backend: API y lógica de negocio.
  - [ ] PostgreSQL: persistencia de datos.
- [ ] Confirmar que el frontend se comunica con el backend por HTTP/JSON.
- [ ] Confirmar que solo el backend accede directamente a PostgreSQL.

---

## Fase 3. Backend — Node.js y Express

- [ ] Preparar el proyecto.
  - [ ] Confirmar versiones de Node y npm.
  - [ ] Configurar ES Modules.
  - [ ] Instalar y configurar Express.
  - [ ] Separar la configuración de `app` del arranque del servidor.
  - [ ] Configurar middleware JSON.
  - [ ] Configurar variables de entorno.
  - [ ] Añadir manejo centralizado de errores.
- [ ] Organizar los módulos según su responsabilidad.
  - [ ] Rutas.
  - [ ] Controladores.
  - [ ] Servicios o lógica de negocio.
  - [ ] Validaciones.
  - [ ] Acceso a datos cuando corresponda.
- [ ] Implementar el CRUD.
  - [ ] Crear libros.
  - [ ] Listar libros.
  - [ ] Consultar por ID.
  - [ ] Actualizar libros.
  - [ ] Eliminar libros.
- [ ] Implementar generación y validación de IDs.
- [ ] Manejar colisiones de IDs.
- [ ] Devolver códigos HTTP y respuestas JSON consistentes.
- [ ] Validar datos de entrada.
- [ ] Evitar consultas SQL construidas concatenando entradas del usuario.
- [ ] Revisar legibilidad, reutilización y separación de responsabilidades.

---

## Fase 4. PostgreSQL y base de datos

- [ ] Diseñar el esquema.
  - [ ] Definir tabla de libros.
  - [ ] Definir clave primaria.
  - [ ] Definir campos obligatorios y restricciones.
  - [ ] Garantizar unicidad del ID.
- [ ] Crear `database/migrations/`.
- [ ] Crear `database/seeds/` si se necesitan datos iniciales.
- [ ] Configurar la conexión desde el backend.
- [ ] Usar variables de entorno para las credenciales.
- [ ] Manejar errores de conexión.
- [ ] Verificar operaciones CRUD contra PostgreSQL.
- [ ] Preparar una estrategia para aislar los datos de pruebas.

---

## Fase 5. Pruebas automatizadas del backend

- [ ] Instalar y configurar Jest.
- [ ] Agregar el comando `test` a `package.json`.
- [ ] Configurar Supertest para probar endpoints HTTP.

### Pruebas unitarias

- [ ] Probar generación de IDs.
- [ ] Probar formato válido e inválido del ID.
- [ ] Probar validaciones de libros.
- [ ] Probar reglas de negocio.
- [ ] Cubrir casos límite y datos inválidos.

### Pruebas de API

- [ ] Crear un libro válido y comprobar la respuesta.
- [ ] Listar libros.
- [ ] Consultar un libro existente.
- [ ] Consultar un ID inexistente.
- [ ] Actualizar un libro.
- [ ] Eliminar un libro.
- [ ] Intentar crear un libro con datos inválidos.
- [ ] Intentar registrar un ID duplicado.
- [ ] Verificar códigos HTTP y estructura JSON.
- [ ] Comprobar que las pruebas no necesiten iniciar manualmente un servidor en un puerto fijo.

### Pruebas de integración

- [ ] Probar operaciones con PostgreSQL.
- [ ] Comprobar persistencia de datos.
- [ ] Comprobar restricciones de la base de datos.
- [ ] Asegurar limpieza o aislamiento de datos entre pruebas.

### Seguridad y errores

- [ ] Verificar consultas parametrizadas para prevenir SQL injection.
- [ ] Probar entradas inesperadas o maliciosas.
- [ ] Comprobar que los errores no expongan credenciales ni detalles internos.

---

## Fase 6. Pruebas funcionales y documentación

- [ ] Crear `docs/test-cases.md`.
- [ ] Crear una matriz de pruebas funcionales en Excel si la reclutadora la solicita.
- [ ] Registrar en cada caso:
  - [ ] Identificador.
  - [ ] Área: BE o FE.
  - [ ] Escenario.
  - [ ] Precondiciones.
  - [ ] Pasos.
  - [ ] Resultado esperado.
  - [ ] Resultado obtenido.
  - [ ] Estado: PASS o FAIL.
  - [ ] Observaciones.

### Casos funcionales de backend (BE)

- [ ] BE-F-001: crear un libro válido.
- [ ] BE-F-002: listar libros.
- [ ] BE-F-003: consultar un libro existente.
- [ ] BE-F-004: consultar un libro inexistente.
- [ ] BE-F-005: actualizar un libro.
- [ ] BE-F-006: eliminar un libro.
- [ ] BE-F-007: enviar campos obligatorios vacíos.
- [ ] BE-F-008: intentar crear un ID duplicado.
- [ ] BE-F-009: enviar datos con formato incorrecto.
- [ ] BE-F-010: verificar códigos HTTP y respuestas JSON.

### Casos funcionales de frontend (FE)

*Completar cuando exista la interfaz.*

- [ ] FE-F-001: visualizar la lista de libros.
- [ ] FE-F-002: crear un libro desde el formulario.
- [ ] FE-F-003: mostrar errores de validación.
- [ ] FE-F-004: editar un libro.
- [ ] FE-F-005: eliminar un libro.
- [ ] FE-F-006: mostrar mensajes de éxito y error.
- [ ] FE-F-007: manejar errores o falta de respuesta de la API.

### Herramientas de pruebas

- [ ] Jest para pruebas unitarias.
- [ ] Supertest para pruebas HTTP del backend.
- [ ] Postman para colecciones de solicitudes y comprobaciones de API.
- [ ] Playwright para pruebas de navegador y flujos E2E si el alcance lo justifica.

---

## Fase 7. Documentación de la API

- [ ] Crear `docs/api.md`.
- [ ] Documentar cada endpoint.
- [ ] Documentar métodos HTTP y parámetros.
- [ ] Incluir ejemplos de peticiones y respuestas JSON.
- [ ] Documentar códigos HTTP y errores.
- [ ] Añadir Swagger/OpenAPI si resulta conveniente.
- [ ] Documentar cómo ejecutar las pruebas.

---

## Fase 8. Frontend

- [ ] Elegir y configurar la tecnología.
- [ ] Crear la vista de libros.
- [ ] Crear formulario de alta y edición.
- [ ] Implementar eliminación con confirmación si corresponde.
- [ ] Conectar el frontend a la API.
- [ ] Gestionar estados de carga.
- [ ] Mostrar errores y mensajes de éxito.
- [ ] Validar formularios.
- [ ] Crear pruebas de componentes o funciones.
- [ ] Añadir pruebas E2E con Playwright si procede.
- [ ] Documentar cómo ejecutar el frontend.

---

## Fase 9. Docker y Docker Compose

- [ ] Crear `backend/Dockerfile`.
- [ ] Crear `frontend/Dockerfile` cuando esté implementado.
- [ ] Crear `compose.yaml` en la raíz.
- [ ] Definir servicios de frontend, backend y PostgreSQL.
- [ ] Configurar comunicación interna entre servicios.
- [ ] Crear un volumen persistente para PostgreSQL.
- [ ] Configurar variables de entorno sin subir secretos.
- [ ] Gestionar correctamente el orden de arranque y la disponibilidad de PostgreSQL.
- [ ] Ejecutar `docker compose up --build`.
- [ ] Verificar que la API y el frontend respondan.
- [ ] Verificar persistencia de datos al recrear contenedores.
- [ ] Documentar cómo detener servicios y consultar logs.
- [ ] Probar el proyecto desde un clon limpio del repositorio.

---

## Fase 10. Jenkins e integración continua

*Iniciar esta fase cuando las pruebas locales funcionen correctamente.*

- [ ] Preparar Jenkins.
- [ ] Crear `Jenkinsfile`.
- [ ] Configurar acceso al repositorio.
- [ ] Instalar dependencias de forma reproducible.
- [ ] Ejecutar pruebas automatizadas.
- [ ] Publicar resultados de pruebas.
- [ ] Publicar cobertura si está configurada.
- [ ] Construir imágenes Docker si corresponde.
- [ ] Gestionar credenciales mediante Jenkins, nunca dentro del repositorio.
- [ ] Documentar cómo funciona el pipeline.

---

## Fase 11. Revisión final y entrega

- [ ] Confirmar que funciona todo el CRUD.
- [ ] Ejecutar las pruebas automatizadas y registrar resultados reales.
- [ ] Revisar las pruebas funcionales BE y FE.
- [ ] Revisar seguridad y validaciones.
- [ ] Revisar documentación de API y arquitectura.
- [ ] Confirmar que Docker Compose levanta el proyecto desde cero.
- [ ] Revisar que no haya secretos versionados.
- [ ] Completar el `README.md` con:
  - [ ] Descripción del proyecto.
  - [ ] Arquitectura.
  - [ ] Requisitos previos.
  - [ ] Configuración de entorno.
  - [ ] Comandos para ejecutar y detener.
  - [ ] Comandos para correr pruebas.
  - [ ] Endpoints principales.
  - [ ] Decisiones técnicas y limitaciones conocidas.
- [ ] Revisar el historial de commits.
- [ ] Preparar una explicación de arquitectura, seguridad, pruebas y decisiones para la entrevista.

---

## Criterio de finalización

El proyecto estará listo cuando otra persona pueda clonar el repositorio, configurar las variables necesarias, levantar el entorno siguiendo la documentación, utilizar el CRUD, ejecutar las pruebas y comprender las decisiones principales sin depender de explicaciones verbales del autor.
