# Lumen Hermandades - Backend

## Qué necesitas para arrancar

Backend con Spring Boot + MySQL.

- Puerto de la API: `8080`
- Perfil activo por defecto: `local`
- Archivo clave de entorno: `src/main/resources/application-local.properties`

## Configuración local (la importante)

En local estamos usando:

- Host DB: `localhost`
- Puerto DB: `3306`
- Base de datos: `lumen_db`
- Usuario: `root`
- Password: `root`

Y en Spring:

```properties
server.port=8080
spring.profiles.active=local

spring.datasource.url=jdbc:mysql://localhost:3306/lumen_db?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
```

## Cómo crear/conectar la DB en DBeaver (paso a paso)

1. Abre DBeaver.
2. Click en **New Database Connection**.
3. Elige **MySQL**.
4. Rellena estos campos:
	- **Connection name**: `Lumen Local`
	- **Host**: `localhost`
	- **Port**: `3306`
	- **Database**: `lumen_db`
	- **Username**: `root`
	- **Password**: `root`
5. Pulsa **Test Connection**.
6. Si falta el driver, acepta descargarlo.
7. Pulsa **Finish**.

Si `lumen_db` no existe todavía, créala desde DBeaver con:

```sql
CREATE DATABASE lumen_db;
```

## Endpoints actuales de Hermanos

- `GET /api/hermanos/buscar`
- `POST /api/hermanos/guardar`
- `DELETE /api/hermanos/{id}`

## Arranque rápido backend

Desde `lumen-backend`:

```bash
./mvnw clean install
./mvnw spring-boot:run
```

Si todo va bien, API en:

- `http://localhost:8080`

## Organización del código (versión corta)

- `controllers`: recibe peticiones HTTP
- `services`: lógica de negocio
- `repositories`: acceso a DB
- `dto`: objetos de entrada/salida

La idea es mantenerlo simple y ordenado para que cualquiera del equipo pueda entrar y seguir.

## Cómo trabajamos en Backend (muy simple)

Cuando hay una tarea nueva seguimos siempre este orden:

1. Crear/ajustar `dto` (qué entra y sale por API).
2. Añadir endpoint en `controller`.
3. Meter la lógica en `service`.
4. Guardar/leer en `repository`.
5. Probar endpoint con Postman o desde el frontend.

## Dónde está cada cosa (módulo Hermanos)

- Controller: `lumen-backend/src/main/java/es/lumen/lumen_backend/hermano_modulo/controllers`
- Service: `lumen-backend/src/main/java/es/lumen/lumen_backend/hermano_modulo/services`
- Impl: `lumen-backend/src/main/java/es/lumen/lumen_backend/hermano_modulo/services/impl`
- Repository: `lumen-backend/src/main/java/es/lumen/lumen_backend/hermano_modulo/repositories`
- Modelo/Entidad: `lumen-backend/src/main/java/es/lumen/lumen_backend/hermano_modulo/models`
- Config local: `lumen-backend/src/main/resources/application-local.properties`

## Cómo trabajamos con Git (equipo)

Regla principal: **no se sube código directamente a `main`**.

- `main`: rama estable de entrega.
- `develop`: rama donde integramos el trabajo del equipo.
- `feature/nombre-tarea`: rama para cada tarea individual.

Flujo diario:

1. Partir siempre desde `develop` actualizado.
2. Crear una rama `feature/...` para tu tarea.
3. Hacer commits pequeños y claros.
4. Subir rama y abrir PR hacia `develop`.
5. Revisar y mergear a `develop`.
6. `main` solo se toca para versiones cerradas.

Comandos base:

```bash
git checkout develop
git pull
git checkout -b feature/nombre-tarea

# trabajar, commit...
git push -u origin feature/nombre-tarea
```
