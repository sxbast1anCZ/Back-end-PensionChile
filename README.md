<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

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

## � Documentación de API

### Swagger UI
La documentación interactiva de la API está disponible en:
```
http://localhost:3000/api-docs
```

**Características:**
- 📖 Documentación automática de todos los endpoints
- 🧪 Testing integrado - prueba endpoints directamente
- 🔐 Soporte para autenticación JWT
- 📋 Esquemas de datos y ejemplos
- 🏷️ Endpoints organizados por categorías

### Cómo usar Swagger:
1. Inicia el servidor: `npm run start:dev`
2. Ve a `http://localhost:3000/api-docs`
3. Explora los endpoints disponibles
4. Para endpoints protegidos:
   - Haz login en `/auth/login`
   - Copia el `access_token`
   - Haz clic en "Authorize" y pega el token
   - Ahora puedes probar endpoints protegidos

---

## �🔐 API Endpoints

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
