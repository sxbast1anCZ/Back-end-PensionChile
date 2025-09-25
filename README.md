# 🏠 Pension Chile - Backend API

Sistema de gestión de pensiones para universitarios en Chile. API REST desarrollada con NestJS, PostgreSQL y Prisma.

## 📋 Requisitos Previos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** y **Docker Compose**
- **Git**

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/pension-back.git
cd pension-back
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# Crear archivo .env en la raíz del proyecto
touch .env
```

Contenido del archivo `.env`:
```env
# Base de datos
DATABASE_URL="postgresql://root:root@localhost:5432/pension_db?schema=public"

# JWT
JWT_SECRET="your_jwt_secret_key"

# Puerto del servidor
PORT=4000
```

### 4. Iniciar la base de datos con Docker
```bash
docker-compose up -d
```

### 5. Configurar Prisma
```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# Poblar datos iniciales (tipos y estados de usuario)
npm run db:seed
```

### 6. Iniciar el servidor
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## 🗄️ Base de Datos

### Estructura Principal
- **usuarios** - Información principal de usuarios
- **tipos_usuario** - Tipos: Universitario, Propietario, Administrador
- **estados_usuario** - Estados: Activo, Inactivo, Bloqueado, Eliminado
- **universitarios** - Perfil específico para estudiantes
- **propietarios** - Perfil específico para propietarios

### Comandos Útiles de Prisma
```bash
# Ver la base de datos en el navegador
npx prisma studio

# Resetear la base de datos
npx prisma migrate reset

# Aplicar cambios del schema
npx prisma db push
```

## 🔐 API Endpoints

### Autenticación

#### POST `/auth/register`
Registrar nuevo usuario
```json
{
  "rut": "12345678K",
  "nombreUsuario": "Juan Carlos",
  "primerApellido": "González",
  "segundoApellido": "Pérez",
  "telefono": "+56987654321",
  "correoElectronico": "juan.gonzalez@gmail.com",
  "contrasena": "MiPassword123!",
  "tipoUsuarioId": 1,
  "estadoUsuarioId": 1
}
```

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "rut": "12345678K",
  "nombreUsuario": "Juan Carlos",
  "primerApellido": "González",
  "segundoApellido": "Pérez",
  "telefono": "+56987654321",
  "correoElectronico": "juan.gonzalez@gmail.com",
  "tipoUsuarioId": 1,
  "estadoUsuarioId": 1,
  "fechaCreacion": "2024-09-24T12:30:00.000Z",
  "fechaActualizacion": "2024-09-24T12:30:00.000Z"
}
```

#### POST `/auth/login`
Iniciar sesión
```json
{
  "correoElectronico": "juan.gonzalez@gmail.com",
  "contrasena": "MiPassword123!"
}
```

**Respuesta exitosa (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET `/auth/profile`
Obtener perfil del usuario autenticado

**Headers requeridos:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "rut": "12345678K",
  "nombreUsuario": "Juan Carlos",
  "primerApellido": "González",
  "segundoApellido": "Pérez",
  "telefono": "+56987654321",
  "correoElectronico": "juan.gonzalez@gmail.com",
  "tipoUsuarioId": 1,
  "estadoUsuarioId": 1,
  "fechaCreacion": "2024-09-24T12:30:00.000Z",
  "fechaActualizacion": "2024-09-24T12:30:00.000Z",
  "tipoUsuario": {
    "id": 1,
    "nombre": "Universitario",
    "descripcion": "Usuario estudiante universitario",
    "activo": true
  },
  "estadoUsuario": {
    "id": 1,
    "nombre": "Activo",
    "descripcion": "Usuario activo en el sistema",
    "activo": true
  }
}
```

## 🧪 Testing con Postman

### URL Base
```
http://localhost:4000
```

### Flujo de pruebas
1. **POST /auth/register** - Crear usuario nuevo
2. **POST /auth/login** - Obtener token JWT
3. **GET /auth/profile** - Usar token para obtener información del usuario

### Datos de prueba
```json
{
  "rut": "12345678K",
  "nombreUsuario": "Usuario Prueba",
  "primerApellido": "Apellido",
  "segundoApellido": "Segundo",
  "telefono": "+56987654321",
  "correoElectronico": "prueba@test.com",
  "contrasena": "TestPassword123!",
  "tipoUsuarioId": 1,
  "estadoUsuarioId": 1
}
```

## ⚙️ Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Servidor en modo desarrollo
npm run start:debug        # Servidor con debug

# Construcción
npm run build              # Compilar aplicación
npm run start:prod         # Ejecutar en producción

# Base de datos
npm run db:seed            # Poblar datos iniciales

# Calidad de código
npm run lint               # Ejecutar ESLint
npm run format             # Formatear con Prettier

# Testing
npm run test               # Tests unitarios
npm run test:e2e           # Tests end-to-end
npm run test:cov           # Coverage de tests
```

## 🔧 Configuración de Desarrollo

### Estructura del proyecto
```
src/
├── auth/                  # Módulo de autenticación
│   ├── dto/              # DTOs de autenticación
│   ├── guards/           # Guards JWT y Local
│   ├── strategy/         # Estrategias de Passport
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── payload.ts        # Estructura del JWT payload
│   └── user.ts          # Entidad de usuario
├── user/                  # Módulo de usuarios
│   ├── dto/              # DTOs de usuario
│   ├── user.service.ts
│   └── user.module.ts
├── prisma/               # Servicio de Prisma
│   └── prisma.service.ts
└── constants/            # Constantes globales
    └── jwt-key.ts
```

### Validaciones implementadas
- **RUT chileno** - Formato `/^[0-9]{7,8}[0-9Kk]$/` (sin puntos ni guión)
- **Teléfono** - Formato `/^\+569\d{8}$/` (+569XXXXXXXX)
- **Email** - Formato estándar RFC 5321
- **Contraseña** - Mínimo 8 caracteres
- **Nombres/Apellidos** - Mínimo 3 caracteres

### Tecnologías utilizadas
- **NestJS** - Framework Node.js
- **Prisma** - ORM para base de datos
- **PostgreSQL** - Base de datos relacional
- **Passport JWT** - Autenticación con tokens
- **bcrypt** - Hash de contraseñas
- **class-validator** - Validación de DTOs

## 🐳 Docker

### Servicios incluidos
- **PostgreSQL 13.5** en puerto 5432
- **Volumen persistente** para datos

### Comandos útiles
```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f postgres

# Parar servicios
docker-compose down

# Resetear volúmenes
docker-compose down -v
```

## 📝 Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DATABASE_URL` | URL de conexión PostgreSQL | `postgresql://root:root@localhost:5432/pension_db` |
| `JWT_SECRET` | Clave secreta para JWT | `your_jwt_secret_key` |
| `PORT` | Puerto del servidor | `4000` |

## 🚨 Troubleshooting

### Error: Foreign key constraint violated
**Problema:** No existen datos en tablas `tipos_usuario` o `estados_usuario`

**Solución:** Ejecutar el seeder para poblar datos iniciales
```bash
npm run db:seed
```

### Error: Port 5432 already in use
**Problema:** PostgreSQL ya está corriendo en el sistema

**Solución:** Cambiar puerto en `docker-compose.yml` o detener PostgreSQL local
```bash
# Linux
sudo service postgresql stop

# macOS
brew services stop postgresql

# Windows
net stop postgresql-x64-13
```

### Error: Unauthorized en login
**Problema:** LocalStrategy no reconoce los campos del DTO

**Solución:** Verificar configuración en `local.strategy.ts`:
```typescript
super({
  usernameField: 'correoElectronico',
  passwordField: 'contrasena'
});
```

### Error: Module not found Prisma
**Problema:** Cliente de Prisma no generado

**Solución:** Generar cliente de Prisma
```bash
npx prisma generate
```

## 📊 Datos de Seeding

### Tipos de Usuario
- **ID: 1** - Universitario
- **ID: 2** - Propietario  
- **ID: 3** - Administrador

### Estados de Usuario
- **ID: 1** - Activo
- **ID: 2** - Inactivo
- **ID: 3** - Bloqueado
- **ID: 4** - Eliminado

## 🔐 Seguridad

### Características implementadas
- **Hash de contraseñas** con bcrypt y salt
- **JWT tokens** con expiración de 8 horas
- **Validación de duplicados** para RUT y email
- **Guards** para proteger endpoints
- **Exclusión de contraseñas** en respuestas de API

### Buenas prácticas
- Nunca exponer la clave JWT en el código
- Usar HTTPS en producción
- Implementar rate limiting
- Validar todos los inputs
- Logs de seguridad

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Crear Pull Request

### Estándares de código
- Usar ESLint y Prettier
- Seguir convenciones de NestJS
- Escribir tests para nuevas funcionalidades
- Documentar APIs con ejemplos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## 📞 Soporte

Para soporte técnico:
- Crear un issue en el repositorio
- Revisar la documentación de troubleshooting
- Contactar al equipo de desarrollo

---

**¡Tu API de Pension Chile está lista para usar!** 🚀

## 🎯 Próximas funcionalidades

- [ ] Refresh tokens
- [ ] Roles y permisos avanzados
- [ ] Validación avanzada de RUT chileno
- [ ] Rate limiting
- [ ] Logging y auditoría
- [ ] Tests automatizados
- [ ] Documentación con Swagger
- [ ] Deploy con CI/CD
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
