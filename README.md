# 🏠 Back-end PensionChile

Backend de la aplicación PensionChile desarrollado con NestJS, PostgreSQL y Docker. Sistema de gestión de alojamientos para estudiantes universitarios y propietarios.

## 🛠️ Stack Tecnológico

- **Framework:** NestJS (Node.js + TypeScript)
- **Base de Datos:** PostgreSQL 17
- **ORM:** Prisma
- **Autenticación:** JWT + Passport
- **Contenedores:** Docker & Docker Compose
- **Validación:** class-validator
- **Hashing:** bcrypt

---

## 📋 Prerequisitos

Antes de empezar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)
- Editor de código (VS Code recomendado)

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/sxbast1anCZ/Back-end-PensionChile.git
cd Back-end-PensionChile
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:
```env
# PostgreSQL database connection for Docker container
DATABASE_URL="postgresql://root:root@localhost:5433/pensionchile_db?schema=public"

# JWT Configuration
JWT_SECRET="tu-clave-jwt-super-secreta-aqui"
JWT_EXPIRES_IN="24h"
```

> **⚠️ Importante:** Genera tu propia clave JWT con:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 4. Levantar la base de datos con Docker
```bash
# Levantar PostgreSQL en Docker
docker-compose up -d

# Verificar que esté funcionando
docker-compose ps
```

### 5. Configurar la base de datos
```bash
# Generar el cliente de Prisma
npx prisma generate

# Sincronizar el esquema con la base de datos
npx prisma db push

# Poblar la base de datos con datos iniciales
npx prisma db seed
```

### 6. Iniciar la aplicación
```bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

---

## 🗄️ Base de Datos

### Esquema de Usuarios
- **usuarios** - Tabla principal con datos comunes
- **tipos_usuario** - Catálogo: Universitario, Propietario, Administrador
- **estados_usuario** - Catálogo: Activo, Inactivo, Suspendido, Pendiente
- **universitarios** - Datos específicos de estudiantes
- **propietarios** - Datos específicos de propietarios

### Visualizar datos
```bash
# Abrir Prisma Studio (interfaz web)
npx prisma studio
```

---

## 🔐 API Endpoints

### Autenticación
- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Inicio de sesión
- `GET /auth/profile` - Perfil del usuario (requiere JWT)
- `POST /auth/verify` - Verificar token JWT

### Catálogos
- `GET /auth/tipos-usuario` - Obtener tipos de usuario
- `GET /auth/estados-usuario` - Obtener estados de usuario

### Ejemplo de registro:
```json
POST /auth/register
{
  "rut": "12345678-9",
  "nombreUsuario": "Juan",
  "primerApellido": "Pérez",
  "telefono": "987654321",
  "correoElectronico": "juan@ejemplo.com",
  "contrasena": "MiPassword123!",
  "tipoUsuario": 1
}
```

---

## 🐳 Docker

### Comandos útiles
```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs

# Parar servicios
docker-compose down

# Reconstruir contenedores
docker-compose up --build

# Acceder a PostgreSQL
docker exec -it postgres-pensionchile psql -U root -d pensionchile_db
```

---

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura de tests
npm run test:cov
```

---

## 📁 Estructura del Proyecto

```
src/
├── auth/                 # Módulo de autenticación
│   ├── dto/             # Data Transfer Objects
│   ├── guards/          # Guards de autenticación
│   ├── strategies/      # Estrategias de Passport
│   └── decorators/      # Decoradores personalizados
├── prisma/              # Servicio de Prisma
└── main.ts              # Punto de entrada

prisma/
├── schema.prisma        # Esquema de base de datos
└── seed.ts             # Datos iniciales
```

---

## 🚀 Deployment

### Variables de entorno para producción:
- `DATABASE_URL` - URL de conexión a PostgreSQL
- `JWT_SECRET` - Clave secreta para JWT (512 bits mínimo)
- `JWT_EXPIRES_IN` - Tiempo de expiración de tokens
- `PORT` - Puerto del servidor (por defecto 3000)

---

## 🤝 Colaboración

### Flujo de trabajo:
1. Crear rama desde `develop`
2. Hacer commits descriptivos
3. Crear Pull Request a `develop`
4. Code review y merge

### Ramas importantes:
- `main` - Código en producción
- `develop` - Desarrollo activo
- `feature/*` - Nuevas funcionalidades

---

## 📚 Recursos Útiles

- [Documentación NestJS](https://docs.nestjs.com/)
- [Documentación Prisma](https://www.prisma.io/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)

---

## 👥 Equipo

- **Sebastian** - Desarrollador Backend
- **[Nombre del compañero]** - Desarrollador Frontend

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
