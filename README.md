<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# RamonChat Backend

API REST para un sistema de chat con inteligencia artificial utilizando OpenAI GPT-4o.

## Características

- Autenticación JWT
- Gestión de usuarios
- Conversaciones con IA (OpenAI GPT-4o)
- Historial de mensajes persistente
- Títulos de chat generados automáticamente con IA
- Base de datos PostgreSQL
- Documentación automática con Swagger
- Validación de datos con class-validator
- TypeORM para manejo de base de datos

## Tecnologías

- **Framework**: NestJS 11
- **Base de datos**: PostgreSQL
- **ORM**: TypeORM
- **Autenticación**: JWT con Passport
- **IA**: OpenAI API (GPT-4o)
- **Documentación**: Swagger/OpenAPI
- **Validación**: class-validator
- **Lenguaje**: TypeScript

## Instalación

### Requisitos previos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn
- Cuenta de OpenAI con API key

### Pasos de instalación

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd ramonchat-back
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crear un archivo `.env` en la raíz del proyecto:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=ramonchat

# JWT Configuration
JWT_SECRET=tu_secret_key_muy_seguro
JWT_EXPIRES_IN=36000s

# OpenAI Configuration
OPENAI_API_KEY=tu_api_key_de_openai

# Application
PORT=3000
```

4. **Crear la base de datos**

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE ramonchat;

# Salir de psql
\q
```

5. **Iniciar la aplicación**

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

## Documentación API

Una vez iniciada la aplicación, la documentación interactiva de Swagger estará disponible en:

```
http://localhost:3000/api/docs
```

## Endpoints Principales

### Autenticación

| Método | Endpoint         | Descripción                  | Auth |
| ------ | ---------------- | ---------------------------- | ---- |
| POST   | `/auth/register` | Registrar nuevo usuario      | No   |
| POST   | `/auth/login`    | Iniciar sesión (retorna JWT) | No   |

### Usuarios

| Método | Endpoint                 | Descripción            | Auth |
| ------ | ------------------------ | ---------------------- | ---- |
| POST   | `/users`                 | Crear usuario          | No   |
| GET    | `/users`                 | Listar usuarios        | JWT  |
| GET    | `/users/:id`             | Obtener usuario por ID | No   |
| GET    | `/users/email?email=...` | Buscar por email       | No   |
| DELETE | `/users/:id`             | Eliminar usuario       | No   |

### Chats

| Método | Endpoint              | Descripción                    | Auth |
| ------ | --------------------- | ------------------------------ | ---- |
| POST   | `/chats`              | Crear nuevo chat               | No   |
| GET    | `/chats`              | Obtener chats del usuario      | JWT  |
| GET    | `/chats/:id/messages` | Obtener mensajes de un chat    | No   |
| DELETE | `/chats/:id`          | Eliminar chat (y sus mensajes) | No   |

### Mensajes

| Método | Endpoint                | Descripción                          | Auth |
| ------ | ----------------------- | ------------------------------------ | ---- |
| POST   | `/messages/new-message` | Enviar mensaje (recibe respuesta IA) | No   |

## Ejemplos de Uso

### 1. Registrar usuario

```bash
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "username": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

### 2. Iniciar sesión

```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "username": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

### 3. Crear un chat

```bash
POST http://localhost:3000/chats
Content-Type: application/json

{
  "userId": "f1cd4d95-b1a8-49ba-9187-262a9dbee382",
  "message": "¿Cómo puedo aprender TypeScript?",
  "sender": "user"
}
```

**Respuesta:**

```json
{
  "id": "chat-uuid",
  "message": "TypeScript es un superset de JavaScript...",
  "sender": "assistant",
  "created_at": "2025-10-31T15:30:00.000Z"
}
```

### 4. Enviar mensaje a un chat existente

```bash
POST http://localhost:3000/messages/new-message
Content-Type: application/json

{
  "chat_id": "chat-uuid",
  "message": "¿Puedes darme un ejemplo práctico?",
  "sender": "user"
}
```

### 5. Obtener mensajes de un chat

```bash
GET http://localhost:3000/chats/chat-uuid/messages
```

## Estructura de la Base de Datos

### Tabla: users

```sql
id          UUID PRIMARY KEY
username    VARCHAR NOT NULL
email       VARCHAR UNIQUE NOT NULL
password    VARCHAR NOT NULL
```

### Tabla: chats

```sql
id          UUID PRIMARY KEY
title       VARCHAR NOT NULL
userId      UUID FOREIGN KEY -> users(id)
```

### Tabla: messages

```sql
id          UUID PRIMARY KEY
message     TEXT NOT NULL
sender      VARCHAR NOT NULL ('user' | 'assistant')
chatId      UUID FOREIGN KEY -> chats(id) ON DELETE CASCADE
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

## Arquitectura

```
src/
├── auth/              # Módulo de autenticación
├── users/             # Módulo de usuarios
├── chats/             # Módulo de chats
├── messages/          # Módulo de mensajes
├── openai/            # Módulo de integración con OpenAI
├── guards/            # Guards personalizados (JWT)
├── app.module.ts      # Módulo principal
└── main.ts            # Punto de entrada
```

## Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación JWT
- Validación de datos con class-validator
- Variables de entorno para secretos
- CORS configurado

## Scripts Disponibles

```bash
# Desarrollo
npm run start:dev        # Inicia en modo desarrollo con hot-reload

# Producción
npm run build            # Compila el proyecto
npm run start:prod       # Inicia en modo producción

# Testing
npm run test             # Ejecuta tests unitarios
npm run test:e2e         # Ejecuta tests end-to-end
npm run test:cov         # Cobertura de tests

# Linting
npm run lint             # Ejecuta ESLint
npm run format           # Formatea código con Prettier
```

## Características de la IA

- **Modelo**: GPT-4o (más rápido y económico que GPT-4)
- **Memoria**: Mantiene contexto de toda la conversación
- **Títulos**: Genera títulos automáticamente con GPT-4o-mini
- **Optimización**: Consultas paralelas para mejor rendimiento

## Optimizaciones Implementadas

- Queries paralelas con `Promise.all()`
- Select específico de columnas (reduce transferencia de datos)
- Una sola consulta de historial por mensaje
- Mapeo eficiente de mensajes
- Eliminación en cascada de mensajes

## Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

Desarrollado usando NestJS y OpenAI
