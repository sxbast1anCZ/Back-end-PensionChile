import { 
  Controller, 
  Post, 
  UseGuards, 
  Request, 
  Body, 
  Get,
  UnauthorizedException 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Post('register')
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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      message: 'Inicio de sesión exitoso',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  verifyToken(@Request() req) {
    return {
      valid: true,
      user: req.user,
    };
  }

  // Endpoints para catálogos
  @Get('tipos-usuario')
  async getTiposUsuario() {
    return this.authService.getTiposUsuario();
  }

  @Get('estados-usuario')
  async getEstadosUsuario() {
    return this.authService.getEstadosUsuario();
  }
}