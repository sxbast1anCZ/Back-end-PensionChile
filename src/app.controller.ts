import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('general')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Verificar estado del servidor',
    description: 'Endpoint de salud para verificar que el servidor está funcionando correctamente'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Servidor funcionando correctamente',
    example: 'Hello World!'
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
