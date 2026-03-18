# Lumen Hermandades - Frontend (rápido)

Este README es la versión corta para arrancar sin líos.

## Stack

- Angular
- Bootstrap
- Angular Material

## Comandos

Desde la carpeta `lumen-frontend`:

```bash
npm install
npm start
```

Frontend en:

- `http://localhost:4200`

## Dónde mirar el código

- `src/app/core/models` → interfaces
- `src/app/core/services` → llamadas HTTP
- `src/app/features` → pantallas
- `src/environments` → `apiUrl` por entorno

## Nota de equipo

Si algo no carga, revisad primero:

1. Que backend esté levantado en `8080`.
2. Que `apiUrl` en `environment.ts` apunte bien.
3. Que la base de datos local esté operativa.
