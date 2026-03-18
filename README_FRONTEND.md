# Lumen Hermandades - Frontend

## Qué estamos usando

Frontend hecho con:

- Angular 17 (guía de trabajo del equipo)
- Bootstrap (maquetación rápida)
- Angular Material (paginator, iconos, etc.)

Con esto tenemos una base simple para que todos trabajemos igual.

## Estructura rápida (la importante)

```text
src/app/
  core/
    models/
    services/
  features/
    inicio/
    hermanos/
    calendario/
  layout/
    sidebar/
```

- `core/models`: interfaces de datos (ej: `Hermano`)
- `core/services`: peticiones HTTP al backend
- `features`: pantallas por funcionalidad

## Entornos y apiUrl

Aquí está la URL base del backend:

- `src/environments/environment.ts` → local (`http://localhost:8080/api`)
- `src/environments/environment.prod.ts` → producción

El `HermanoService` construye endpoints desde `environment.apiUrl`, así evitamos URLs hardcodeadas por todo el proyecto.

## Paginación y roles (modo fácil)

### Paginación local

En Hermanos usamos `MatPaginator` + `slice` en la tabla:

- Cambiamos `pageIndex` y `pageSize` al paginar
- La tabla muestra solo el tramo actual

Es una solución simple y clara para empezar.

### Mock de roles

En el sidebar hay una variable `esAdmin`:

- `true` → se ve botón de Hermanos
- `false` → no se ve

Esto es didáctico (visual), no seguridad real.

## Cómo arrancar el frontend

Desde `lumen-frontend`:

```bash
npm install
npm start
```

Después abrir:

- `http://localhost:4200`

## Mini reglas de equipo

1. Servicios HTTP siempre en `core/services`.
2. Modelos siempre en `core/models`.
3. Nada de URLs hardcodeadas fuera de `environments`.
4. Componentes nuevos dentro de su `feature`.
5. Si algo es mock, lo dejamos escrito en pantalla/README para no confundir.

## Cómo trabajamos en Frontend (muy simple)

Para cualquier pantalla nueva:

1. Crear componente en `features`.
2. Si necesita API, usar o crear servicio en `core/services`.
3. Si hay estructura de datos, crear interfaz en `core/models`.
4. Añadir ruta en `app-routing` (lazy loading cuando toque).
5. Probar en navegador y revisar consola.

## Dónde mirar primero si algo falla

- Si no carga datos: revisar `HermanoService` y `apiUrl` en `environments`.
- Si falla una ruta: revisar `app-routing.module.ts`.
- Si falla el menú/roles mock: revisar `layout/sidebar/sidebar.component.ts` (`esAdmin`).
- Si falla la tabla de hermanos: revisar `features/hermanos`.

## Cómo trabajamos con Git (equipo)

Regla principal: **no se sube código directamente a `main`**.

- `main`: solo versiones estables.
- `develop`: rama de integración del equipo.
- `feature/nombre(ruben)/nombre-tarea`: rama personal para cada tarea.

Flujo que seguimos siempre:

1. Actualizar `develop` local.
2. Crear rama de tarea desde `develop`.
3. Hacer cambios y commits en esa rama.
4. Subir rama y abrir PR hacia `develop`.
5. Tras revisión, merge a `develop`.
6. `main` se actualiza solo cuando decidamos cerrar una versión.

Comandos base:

```bash
git checkout develop
git pull
git checkout -b feature/nombre-tarea

# trabajar, commit...
git push -u origin feature/nombre-tarea
```
