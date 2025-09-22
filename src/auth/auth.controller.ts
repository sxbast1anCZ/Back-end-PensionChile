import { 
  Controller, 
  Post, 
  UseGuards, 
  Request, 
  Body, 
  Get,
  UnauthorizedException 
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
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve un token JWT'
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
        tipoUsuario: 'Universitario'
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

  @Post('register')
  @ApiOperation({ 
    summary: 'Registrar nuevo usuario',
    description: 'Crea una cuenta nueva para universitario o propietario'
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
        message: 'Usuario creado exitosamente',
        user,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
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