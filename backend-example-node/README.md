# Backend Example (Node.js + Express + MongoDB)

## Endpoints

- GET `/api/hermanos?page=1&pageSize=10&search=juan&estado=ACTIVO&sortBy=primer_apellido&sortDirection=asc`
- GET `/api/hermanos/:id`
- POST `/api/hermanos`
- PUT `/api/hermanos/:id`
- DELETE `/api/hermanos/:id`

## Start

1. `cd backend-example-node`
2. `npm install`
3. `npm start`

Environment variables:

- `MONGO_URI` (optional): MongoDB connection URI
- `PORT` (optional): API port (default: 3000)
