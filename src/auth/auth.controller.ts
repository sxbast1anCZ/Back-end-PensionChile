import { Body, Controller, Post, Request, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateUniversitarioDto } from 'src/user/dto/create-universitario.dto';
import { CreatePropietarioDto } from 'src/user/dto/create-propietario.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService) {}

    @Post('/register')
    @ApiOperation({ 
      summary: 'Registro de usuario general',
      description: 'Registra un nuevo usuario en el sistema'
    })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ 
      status: 201, 
      description: 'Usuario registrado exitosamente' 
    })
    async register(@Body() body: CreateUserDto){
      return this.userService.createUser(body)
    }

    @Post('/register/universitario')
    @ApiOperation({ 
      summary: 'Registro de estudiante universitario',
      description: 'Registra un nuevo estudiante universitario en el sistema'
    })
    @ApiBody({ type: CreateUniversitarioDto })
    @ApiResponse({ 
      status: 201, 
      description: 'Estudiante universitario registrado exitosamente' 
    })
    async registerUniversitario(@Body() body: CreateUniversitarioDto){
      return this.userService.createUniversitario(body)
    }

    @Post('/register/propietario')
    @ApiOperation({ 
      summary: 'Registro de propietario',
      description: 'Registra un nuevo propietario de pensiones en el sistema'
    })
    @ApiBody({ type: CreatePropietarioDto })
    @ApiResponse({ 
      status: 201, 
      description: 'Propietario registrado exitosamente' 
    })
    async registerPropietario(@Body() body: CreatePropietarioDto){
      return this.userService.createPropietario(body)
    }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    @ApiOperation({ 
      summary: 'Iniciar sesión',
      description: 'Autentica un usuario y devuelve un token JWT'
    })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ 
      status: 200, 
      description: 'Login exitoso, devuelve token JWT',
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          userId: 1,
          username: 'usuario@example.com'
        }
      }
    })
    @ApiResponse({ 
      status: 401, 
      description: 'Credenciales inválidas' 
    })
     login(@Request() req) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener perfil de usuario',
    description: 'Obtiene la información del perfil del usuario autenticado'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil de usuario obtenido exitosamente' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token JWT inválido o expirado' 
  })
  async getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return await this.userService.getUserById(req.user.userId)
  }
}
