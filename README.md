# Mente Programador

Aplicación interactiva **¿Tienes mente de programador?** para registrar participantes, completar el test de afinidad, resolver el reto lógico y obtener un perfil y puntaje personalizados.

Actualmente incluye el flujo individual completo, el ranking general y un dashboard en vivo para la pantalla pública de la feria.

## Requisitos

- Docker Desktop con Docker Compose, o bien:
  - Node.js 20 o superior
  - Java 21
  - Maven 3.9 o superior
  - PostgreSQL 16

## Inicio rápido con Docker

```bash
cp .env.example .env
docker compose up --build -d
docker compose ps
```

Servicios disponibles:

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:8080>
- Health del backend: <http://localhost:8080/api/health>

## API disponible

### Crear participante

```http
POST /api/participants
Content-Type: application/json

{
  "alias": "ByteMaster"
}
```

El alias es obligatorio y debe tener entre 2 y 30 caracteres.

### Registrar respuesta del test

```http
POST /api/participants/{participantId}/answers
Content-Type: application/json

{
  "questionNumber": 1,
  "selectedOption": "C"
}
```

Cada opción suma tres puntos al perfil asociado. Solo se admite una respuesta por pregunta y participante.

### Guardar resultado del reto

```http
POST /api/participants/{participantId}/challenge
Content-Type: application/json

{
  "success": true,
  "attempts": 1,
  "elapsedMilliseconds": 12340
}
```

La velocidad aporta hasta 200 puntos y disminuye un punto cada 200 milisegundos (cinco puntos por segundo). Los intentos aportan 100 puntos en el primero y pierden 25 puntos por intento adicional.

### Calcular resultado final

```http
POST /api/participants/{participantId}/finish
```

Combina las cinco respuestas con el éxito, tiempo e intentos del reto. Devuelve el perfil tecnológico, el desglose del puntaje (0 a 1000) y la posición actual, y persiste el resultado.

### Consultar ranking

```http
GET /api/ranking?limit=10
```

Devuelve los resultados ordenados por puntaje total descendente. El límite predeterminado es 10 y admite hasta 100 participantes.

### Consultar estadísticas

```http
GET /api/stats
```

Devuelve el total de participantes, el puntaje promedio y el perfil más frecuente. El dashboard para TV está disponible en `/dashboard` y actualiza estadísticas y Top 10 cada cinco segundos.

Para detener el entorno:

```bash
docker compose down
```

Para borrar también los datos locales de PostgreSQL:

```bash
docker compose down -v
```

## Ejecución local

### Base de datos

Crea una base PostgreSQL y define estas variables antes de iniciar el backend:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/mente_programador
export SPRING_DATASOURCE_USERNAME=mente_programador
export SPRING_DATASOURCE_PASSWORD=mente_programador
```

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

En otra terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Verificaciones

```bash
curl http://localhost:8080/api/health
curl http://localhost:5173/health
```

La primera respuesta debe indicar `status: UP`; la segunda debe responder `healthy` cuando se usa Docker.

Pruebas y compilaciones locales:

```bash
cd backend && mvn test
cd frontend && npm install && npm run build
```

## Estructura

```text
mente-programador/
├── backend/             Spring Boot 3 + Java 21 + Maven
├── frontend/            React + Vite + TypeScript + Tailwind CSS
├── docker-compose.yml   Frontend, backend y PostgreSQL
└── README.md
```

## Configuración

El backend usa `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` y `SPRING_DATASOURCE_PASSWORD`. El frontend usa `VITE_API_URL` y por defecto apunta a `http://localhost:8080/api`.
