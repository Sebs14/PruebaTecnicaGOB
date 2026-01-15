# 🎓 Sistema de Gestión de Estudiantes

Sistema completo (Frontend + Backend) para la gestión masiva de estudiantes mediante carga de archivos CSV/XLSX con validación, dashboard con estadísticas y autenticación con cookies httpOnly.

---

## 📁 Estructura del Proyecto

```
entrevista/
├── prueba-tecnica-gob/          # Frontend (Next.js 16 + TypeScript)
│   └── Feature-Based Architecture
│
├── prueba-tecnica-gob-backend/  # Backend (NestJS + TypeScript)
│   └── Clean Architecture
│
└── PreguntasEntrevista.md       # Respuestas técnicas de la entrevista
```

---

## 🛠️ Requisitos Previos

### 1. Node.js (versión >= 20.9.0)

```bash
# Verificar versión actual
node -v

# Si necesitas actualizar (usando nvm):
nvm install 20
nvm use 20

# O usando Homebrew:
brew install node@20
```

### 2. PostgreSQL

```bash
# Instalar con Homebrew
brew install postgresql@16

# Agregar al PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Iniciar servicio
brew services start postgresql@16

# Verificar que está corriendo
brew services list | grep postgresql
```

### 3. Yarn (gestor de paquetes)

```bash
npm install -g yarn
```

---

## 🗄️ Configuración de Base de Datos

```bash
# Crear la base de datos
createdb students_db

# Verificar que se creó
psql -l | grep students_db

# (Opcional) Conectarse a la base de datos
psql students_db
```

---

## 🚀 Instalación y Ejecución

### Backend (Puerto 3001)

```bash
# 1. Ir al directorio del backend
cd prueba-tecnica-gob-backend

# 2. Instalar dependencias
yarn install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. (Opcional) Editar .env si es necesario
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=tu_usuario   # Por defecto es tu nombre de usuario de macOS
# DB_PASSWORD=             # Por defecto vacío en macOS
# DB_DATABASE=students_db

# 5. Crear usuario administrador
yarn seed

# 6. Iniciar servidor en modo desarrollo
yarn start:dev
```

**El backend estará disponible en:** `http://localhost:3001/api`

### Frontend (Puerto 3000)

```bash
# 1. Ir al directorio del frontend
cd prueba-tecnica-gob

# 2. Instalar dependencias
yarn install

# 3. Configurar variables de entorno
cp .env.example .env.local

# 4. Iniciar servidor de desarrollo
yarn dev
```

**El frontend estará disponible en:** `http://localhost:3000`

---

## 🔑 Credenciales por Defecto

Después de ejecutar `yarn seed` en el backend:

| Campo | Valor |
|-------|-------|
| **Email** | `admin@sistema.gob` |
| **Password** | `admin123` |

---

## 📌 Endpoints de la API

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/api/auth/login` | Iniciar sesión | ❌ |
| `POST` | `/api/auth/logout` | Cerrar sesión | ✅ |
| `GET` | `/api/auth/me` | Obtener usuario actual | ✅ |
| `GET` | `/api/students` | Listar estudiantes (paginado) | ✅ |
| `GET` | `/api/students/stats` | Estadísticas para dashboard | ✅ |
| `POST` | `/api/students/bulk` | Carga masiva CSV/XLSX | ✅ |

---

## 📊 Formato de Archivo CSV/XLSX

El archivo debe tener las siguientes columnas:

| Columna | Tipo | Requerido | Validaciones |
|---------|------|-----------|--------------|
| `nombre_estudiante` | string | ✅ | Único |
| `anio_inicio` | number | ✅ | <= año actual |
| `nue` | string | ✅ | Único, solo números positivos |
| `genero` | string | ✅ | `masculino`, `femenino`, `otro` |
| `promedio_actual` | number | ✅ | 0 - 10 |
| `graduado` | boolean | ✅ | `true`, `false`, `si`, `no` |
| `promedio_graduacion` | number | ⚠️ | Si graduado=true, debe ser igual a promedio_actual |

### Ejemplo:

```csv
nombre_estudiante,anio_inicio,nue,genero,promedio_actual,graduado,promedio_graduacion
Juan Pérez,2020,12345,masculino,8.5,false,
María García,2019,12346,femenino,9.2,true,9.2
```

---

## 🏗️ Arquitecturas Utilizadas

### Frontend: Feature-Based Architecture

```
src/
├── app/           # Rutas (App Router)
├── features/      # Funcionalidades (auth, students, dashboard)
├── components/    # Componentes compartidos
├── lib/           # Utilidades
└── types/         # Tipos TypeScript
```

### Backend: Clean Architecture

```
src/
├── domain/        # Entidades y contratos (Núcleo)
├── application/   # Casos de uso (Lógica de negocio)
├── infrastructure/# Implementaciones (DB, HTTP, etc.)
└── modules/       # Módulos NestJS
```

---

## 🔧 Scripts Disponibles

### Backend

```bash
yarn start:dev    # Desarrollo con hot-reload
yarn start:prod   # Producción
yarn build        # Compilar
yarn seed         # Crear usuario admin
yarn test         # Ejecutar tests
yarn lint         # Linter
```

### Frontend

```bash
yarn dev          # Desarrollo
yarn build        # Compilar para producción
yarn start        # Iniciar en producción
yarn lint         # Linter
```

---

## 🐛 Solución de Problemas

### Error: "Node.js version mismatch"

```bash
# Actualizar Node.js
nvm install 20 && nvm use 20
```

### Error: "could not connect to server"

```bash
# Verificar que PostgreSQL está corriendo
brew services list | grep postgresql

# Si está detenido, iniciarlo
brew services start postgresql@16
```

### Error: "database 'students_db' does not exist"

```bash
createdb students_db
```

### Error: "role 'postgres' does not exist"

En macOS, PostgreSQL usa tu nombre de usuario por defecto. Edita el `.env`:

```bash
# Obtener tu nombre de usuario
whoami

# Editar .env del backend
DB_USERNAME=tu_nombre_de_usuario
DB_PASSWORD=
```

---

## 📝 Notas Adicionales

- El frontend usa **cookies httpOnly** para autenticación segura
- CORS está configurado para permitir comunicación entre puertos 3000 y 3001
- TypeORM sincroniza automáticamente las tablas en modo desarrollo
- El seed crea un usuario administrador por defecto

---

## 👨‍💻 Desarrollado por

**Sebastian Flores** - Prueba Técnica Fullstack Developer