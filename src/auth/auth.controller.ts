import { 
  Controller, 
  Post, 
  UseGuards, 
  Request, 
  Body, 
  Get,
  BadRequestException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse 
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUniversitarioDto } from './dto/register-universitario.dto';
import { RegisterPropietarioDto } from './dto/register-propietario.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Throttle({ auth: { ttl: 900000, limit: 5 } }) // 5 intentos por 15 minutos
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario (universitario o propietario) y devuelve un token JWT'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso',
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        idUsuario: 1,
        nombreUsuario: 'Juan',
        correoElectronico: 'juan@ejemplo.com',
        rut: '12345678-9',
        tipoUsuario: 'Universitario',
        estadoUsuario: 'Activo'
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Credenciales inválidas',
    example: { message: 'Credenciales inválidas', statusCode: 401 }
  })
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Post('register/universitario')
  @Throttle({ auth: { ttl: 900000, limit: 3 } }) // 3 intentos por 15 minutos
  @ApiOperation({ 
    summary: 'Registrar nuevo estudiante universitario',
    description: 'Crea una cuenta nueva para un estudiante universitario. Requiere validación de universidad en el catálogo.'
  })
  @ApiBody({ 
    type: RegisterUniversitarioDto,
    description: 'Datos del estudiante universitario',
    examples: {
      ejemplo1: {
        summary: 'Estudiante de Universidad de Chile',
        value: {
          rut: '12345678-9',
          nombreUsuario: 'Juan Carlos',
          primerApellido: 'Pérez',
          segundoApellido: 'González',
          telefono: '912345678',
          correoElectronico: 'juan.perez@estudiante.uchile.cl',
          contrasena: 'MiPassword123!',
          nombreUniversidadEstudiante: 'Universidad de Chile',
          ciudad: 'Santiago',
          region: 'Región Metropolitana'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Estudiante universitario registrado exitosamente',
    example: {
      message: 'Estudiante universitario registrado exitosamente',
      user: {
        idUsuario: 2,
        rut: '12345678-9',
        nombreUsuario: 'Juan Carlos',
        correoElectronico: 'juan.perez@estudiante.uchile.cl',
        tipoUsuario: 'Universitario',
        estadoUsuario: 'Activo',
        universidad: 'Universidad de Chile'
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos o universidad no encontrada',
    example: { 
      message: ['RUT chileno inválido', 'No se encontró la universidad en nuestro catálogo'], 
      statusCode: 400 
    }
  })
  async registerUniversitario(@Body() registerUniversitarioDto: RegisterUniversitarioDto) {
    try {
      const user = await this.authService.registerUniversitario(registerUniversitarioDto);
      return {
        message: 'Estudiante universitario registrado exitosamente',
        user,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('register/propietario')
  @Throttle({ auth: { ttl: 900000, limit: 3 } }) // 3 intentos por 15 minutos
  @ApiOperation({ 
    summary: 'Registrar nuevo propietario',
    description: 'Crea una cuenta nueva para un propietario de pensiones/habitaciones.'
  })
  @ApiBody({ 
    type: RegisterPropietarioDto,
    description: 'Datos del propietario',
    examples: {
      ejemplo1: {
        summary: 'Propietario con biografía',
        value: {
          rut: '98765432-1',
          nombreUsuario: 'María Elena',
          primerApellido: 'González',
          segundoApellido: 'Martínez',
          telefono: '987654321',
          correoElectronico: 'maria.gonzalez@gmail.com',
          contrasena: 'MiPassword123!',
          biografiaUsuario: 'Busco estudiantes responsables y ordenados. Preferiblemente de carreras de ingeniería. Casa ubicada cerca del metro.'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Propietario registrado exitosamente',
    example: {
      message: 'Propietario registrado exitosamente',
      user: {
        idUsuario: 3,
        rut: '98765432-1',
        nombreUsuario: 'María Elena',
        correoElectronico: 'maria.gonzalez@gmail.com',
        tipoUsuario: 'Propietario',
        estadoUsuario: 'Activo'
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos',
    example: { 
      message: ['RUT chileno inválido', 'Ya existe un usuario con ese email o RUT'], 
      statusCode: 400 
    }
  })
  async registerPropietario(@Body() registerPropietarioDto: RegisterPropietarioDto) {
    try {
      const user = await this.authService.registerPropietario(registerPropietarioDto);
      return {
        message: 'Propietario registrado exitosamente',
        user,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('register')
  @Throttle({ auth: { ttl: 900000, limit: 5 } }) // 5 intentos por 15 minutos
  @ApiOperation({ 
    summary: 'Registrar nuevo usuario (OBSOLETO)',
    description: '⚠️ OBSOLETO: Use /register/universitario o /register/propietario. Este endpoint se mantiene solo para compatibilidad.'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente',
    example: {
      message: 'Usuario creado exitosamente',
      user: {
        idUsuario: 2,
        nombreUsuario: 'María',
        correoElectronico: 'maria@ejemplo.com',
        tipoUsuario: 'Propietario'
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos',
    example: { message: ['El RUT debe tener formato válido'], statusCode: 400 }
  })
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.register(createUserDto);
      return {
        message: 'Usuario creado exitosamente (usar endpoints específicos)',
        user,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener perfil del usuario',
    description: 'Devuelve la información del usuario autenticado'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil obtenido exitosamente',
    example: {
      message: 'Inicio de sesión exitoso',
      user: {
        idUsuario: 1,
        nombreUsuario: 'Juan',
        correoElectronico: 'juan@ejemplo.com',
        tipoUsuario: 'Universitario'
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT inválido o expirado',
    example: { message: 'Unauthorized', statusCode: 401 }
  })
  getProfile(@Request() req) {
    return {
      message: 'Inicio de sesión exitoso',
      user: req.user,
    };
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Verificar token JWT',
    description: 'Valida si el token JWT es válido y no ha expirado'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token válido',
    example: {
      valid: true,
      user: {
        idUsuario: 1,
        nombreUsuario: 'Juan',
        correoElectronico: 'juan@ejemplo.com'
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token inválido',
    example: { message: 'Unauthorized', statusCode: 401 }
  })
  verifyToken(@Request() req) {
    return {
      valid: true,
      user: req.user,
    };
  }

  // Endpoints para catálogos
  @Get('universidades')
  @ApiOperation({ 
    summary: 'Obtener universidades disponibles',
    description: 'Lista todas las universidades chilenas disponibles en el catálogo para registro de estudiantes'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de universidades',
    example: [
      { 
        id: 1, 
        nombreUniversidad: 'Universidad de Chile',
        ubicacion: {
          region: { nombre: 'Región Metropolitana' },
          provincia: { nombre: 'Santiago' },
          comuna: { nombre: 'Santiago' }
        }
      },
      { 
        id: 2, 
        nombreUniversidad: 'Pontificia Universidad Católica de Chile',
        ubicacion: {
          region: { nombre: 'Región Metropolitana' },
          provincia: { nombre: 'Santiago' },
          comuna: { nombre: 'Santiago' }
        }
      }
    ]
  })
  async getUniversidades() {
    return this.authService.getUniversidades();
  }

  @Get('tipos-usuario')
  @ApiOperation({ 
    summary: 'Obtener tipos de usuario',
    description: 'Lista todos los tipos de usuario disponibles (Universitario, Propietario, Administrador)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de tipos de usuario',
    example: [
      { id: 1, nombre: 'Universitario', descripcion: 'Estudiante universitario buscando arriendo' },
      { id: 2, nombre: 'Propietario', descripcion: 'Propietario de inmuebles para arriendo' },
      { id: 3, nombre: 'Administrador', descripcion: 'Usuario con control total del sistema' }
    ]
  })
  async getTiposUsuario() {
    return this.authService.getTiposUsuario();
  }

  @Get('estados-usuario')
  @ApiOperation({ 
    summary: 'Obtener estados de usuario',
    description: 'Lista todos los estados posibles de un usuario (Activo, Inactivo, Suspendido, Pendiente)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de estados de usuario',
    example: [
      { id: 1, nombre: 'Activo', descripcion: 'Usuario activo en el sistema' },
      { id: 2, nombre: 'Inactivo', descripcion: 'Usuario temporalmente inactivo' },
      { id: 3, nombre: 'Suspendido', descripcion: 'Usuario suspendido por incumplimiento' },
      { id: 4, nombre: 'Pendiente', descripción: 'Usuario pendiente de verificación' }
    ]
  })
  async getEstadosUsuario() {
    return this.authService.getEstadosUsuario();
  }
}