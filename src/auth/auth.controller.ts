import { Body, Controller, Post, Request, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateUniversitarioDto } from 'src/user/dto/create-universitario.dto';
import { CreatePropietarioDto } from 'src/user/dto/create-propietario.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService) {}

    @Post('/register')
    async register(@Body() body: CreateUserDto){
      return this.userService.createUser(body)
    }

    @Post('/register/universitario')
    async registerUniversitario(@Body() body: CreateUniversitarioDto){
      return this.userService.createUniversitario(body)
    }

    @Post('/register/propietario')
    async registerPropietario(@Body() body: CreatePropietarioDto){
      return this.userService.createPropietario(body)
    }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
     login(@Request() req) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return await this.userService.getUserById(req.user.userId)
  }
}
