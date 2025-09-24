import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse 
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PagosService } from './pagos.service';
import { CreateOrdenPagoDto } from './dto/create-orden-pago.dto';

@ApiTags('Payments')
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Get('planes-premium')
  @ApiOperation({ 
    summary: 'Obtener planes premium disponibles',
    description: 'Retorna todos los planes premium disponibles con sus precios y características. Este endpoint es público.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de planes premium',
    example: [
      {
        idPlanPremium: 1,
        nombrePlan: 'Premium 7 días',
        descripcion: 'Plan premium para destacar tu publicación por 7 días',
        precio: 5000,
        duracionDias: 7,
        beneficios: [
          'Publicación destacada',
          'Aparece en los primeros resultados',
          'Badge de premium',
          'Estadísticas avanzadas'
        ],
        activo: true
      },
      {
        idPlanPremium: 2,
        nombrePlan: 'Premium 30 días',
        descripcion: 'Plan premium para destacar tu publicación por 30 días',
        precio: 15000,
        duracionDias: 30,
        beneficios: [
          'Publicación destacada',
          'Aparece en los primeros resultados',
          'Badge de premium',
          'Estadísticas avanzadas',
          'Soporte prioritario'
        ],
        activo: true
      }
    ]
  })
  async obtenerPlanesPremium() {
    return this.pagosService.obtenerPlanesPremium();
  }

  @Post('crear-orden')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Throttle({ payments: { ttl: 3600000, limit: 10 } }) // 10 órdenes por hora
  @ApiOperation({ 
    summary: 'Crear orden de pago',
    description: 'Crea una nueva orden de pago para una publicación premium. Requiere autenticación JWT.'
  })
  @ApiBody({ 
    type: CreateOrdenPagoDto,
    description: 'Datos de la orden de pago',
    examples: {
      ejemplo1: {
        summary: 'Orden para plan premium 30 días',
        value: {
          idPublicacion: 1,
          idPlanPremium: 2,
          metodoPago: 'TARJETA_CREDITO',
          datosFacturacion: {
            rut: '12345678-9',
            razonSocial: 'Juan Pérez',
            direccion: 'Las Condes 123',
            ciudad: 'Santiago',
            telefono: '+56912345678'
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Orden de pago creada exitosamente',
    example: {
      idOrdenPago: 1,
      buyOrder: 'ORD-20241201-001',
      monto: 15000,
      estado: 'PENDIENTE',
      metodoPago: 'TARJETA_CREDITO',
      fechaCreacion: '2024-12-01T10:00:00Z',
      fechaVencimiento: '2024-12-01T10:15:00Z',
      urlPago: 'https://webpay.transbank.cl/webpayserver/initTransaction',
      token: 'e9d555262db0f989e49d724b4db0bd9149b03ffe...'
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de pago inválidos',
    example: { 
      message: ['El plan premium seleccionado no existe'], 
      error: 'Bad Request', 
      statusCode: 400 
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT inválido o expirado',
    example: { message: 'Unauthorized', statusCode: 401 }
  })
  async crearOrdenPago(@Body() createOrdenPagoDto: CreateOrdenPagoDto, @Request() req) {
    return this.pagosService.crearOrdenPago(createOrdenPagoDto, req.user.idUsuario);
  }

  @Get('mis-ordenes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ 
    summary: 'Obtener órdenes de pago del usuario',
    description: 'Retorna todas las órdenes de pago realizadas por el usuario autenticado.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de órdenes de pago',
    example: [
      {
        idOrdenPago: 1,
        buyOrder: 'ORD-20241201-001',
        monto: 15000,
        estado: 'PAGADO',
        metodoPago: 'TARJETA_CREDITO',
        fechaCreacion: '2024-12-01T10:00:00Z',
        fechaCompletado: '2024-12-01T10:05:00Z',
        planPremium: {
          nombrePlan: 'Premium 30 días',
          duracionDias: 30,
          precio: 15000
        },
        publicacion: {
          id: 1,
          titulo: 'Pensión cerca de Universidad de Chile'
        }
      }
    ]
  })
  async obtenerMisOrdenes(@Request() req) {
    return this.pagosService.obtenerOrdenesPorUsuario(req.user.idUsuario);
  }

  @Post('webhook/transbank')
  @Throttle({ payments: { ttl: 60000, limit: 100 } }) // 100 webhooks por minuto
  @ApiOperation({ 
    summary: 'Webhook de Transbank',
    description: 'Endpoint para recibir notificaciones de Transbank sobre el estado de los pagos. Solo para uso interno de Transbank.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Webhook procesado correctamente'
  })
  async webhookTransbank(@Body() webhookData: any) {
    return this.pagosService.procesarWebhookTransbank(webhookData);
  }
}