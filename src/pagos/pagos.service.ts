import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrdenPagoDto } from './dto/create-orden-pago.dto';
import { EstadoPago } from '@prisma/client';

@Injectable()
export class PagosService {
  private readonly logger = new Logger(PagosService.name);

  constructor(private prisma: PrismaService) {}

  async crearOrdenPago(createOrdenPagoDto: CreateOrdenPagoDto, idUsuario: number) {
    const { idPublicacion, idPlanPremium, metodoPago, datosFacturacion } = createOrdenPagoDto;

    // Validar que la publicación existe y pertenece al usuario
    const publicacion = await this.prisma.publicacion.findFirst({
      where: {
        id: idPublicacion,
        propietarioId: idUsuario
      }
    });

    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada o no tienes permisos para promocionarla');
    }

    // Validar que el plan premium existe y está activo
    const planPremium = await this.prisma.planPremium.findFirst({
      where: {
        id: idPlanPremium,
        activo: true
      }
    });

    if (!planPremium) {
      throw new NotFoundException('Plan premium no encontrado o no está disponible');
    }

    // Verificar si ya existe una orden activa para esta publicación
    const ordenExistente = await this.prisma.ordenPago.findFirst({
      where: {
        publicacionId: idPublicacion,
        estadoPago: {
          in: [EstadoPago.PENDIENTE]
        }
      }
    });

    if (ordenExistente) {
      throw new BadRequestException('Ya existe una orden de pago pendiente para esta publicación');
    }

    // Generar código único de orden
    const buyOrder = this.generarBuyOrder();

    // Crear la orden de pago
    const ordenPago = await this.prisma.ordenPago.create({
      data: {
        buyOrder,
        usuarioId: idUsuario,
        publicacionId: idPublicacion,
        planPremiumId: idPlanPremium,
        monto: planPremium.precio,
        concepto: `Premium ${planPremium.duracionDias} días - ${publicacion.titulo}`,
        estadoPago: EstadoPago.PENDIENTE,
        metodoPago,
        fechaVencimientoOrden: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
        // En un entorno real, aquí se generaría el token de Transbank
        transactionId: this.generarTokenSimulado(),
        sessionId: this.generarSessionId()
      },
      include: {
        planPremium: true,
        publicacion: {
          select: {
            id: true,
            titulo: true
          }
        }
      }
    });

    this.logger.log(`Orden de pago creada: ${buyOrder} por usuario ${idUsuario}`);

    return {
      idOrdenPago: ordenPago.id,
      buyOrder: ordenPago.buyOrder,
      monto: ordenPago.monto,
      estado: ordenPago.estadoPago,
      metodoPago: ordenPago.metodoPago,
      fechaCreacion: ordenPago.fechaCreacion,
      fechaVencimiento: ordenPago.fechaVencimientoOrden,
      urlPago: `https://webpay.transbank.cl/webpayserver/initTransaction?token=${ordenPago.transactionId}`,
      token: ordenPago.transactionId,
      planPremium: ordenPago.planPremium,
      publicacion: ordenPago.publicacion
    };
  }

  async obtenerOrdenesPorUsuario(idUsuario: number) {
    const ordenes = await this.prisma.ordenPago.findMany({
      where: {
        usuarioId: idUsuario
      },
      include: {
        planPremium: true,
        publicacion: {
          select: {
            id: true,
            titulo: true
          }
        }
      },
      orderBy: {
        fechaCreacion: 'desc'
      }
    });

    return ordenes.map(orden => ({
      idOrdenPago: orden.id,
      buyOrder: orden.buyOrder,
      monto: orden.monto,
      estado: orden.estadoPago,
      metodoPago: orden.metodoPago,
      fechaCreacion: orden.fechaCreacion,
      fechaCompletado: orden.fechaPago,
      planPremium: {
        nombrePlan: orden.planPremium.nombre,
        duracionDias: orden.planPremium.duracionDias,
        precio: orden.planPremium.precio
      },
      publicacion: orden.publicacion
    }));
  }

  async obtenerPlanesPremium() {
    const planes = await this.prisma.planPremium.findMany({
      where: {
        activo: true
      },
      orderBy: {
        precio: 'asc'
      }
    });

    return planes.map(plan => ({
      idPlanPremium: plan.id,
      nombrePlan: plan.nombre,
      descripcion: plan.descripcion,
      precio: plan.precio,
      duracionDias: plan.duracionDias,
      beneficios: [
        'Publicación destacada',
        'Aparece en los primeros resultados',
        'Badge de premium',
        'Estadísticas avanzadas',
        plan.duracionDias >= 30 ? 'Soporte prioritario' : null
      ].filter(Boolean),
      activo: plan.activo
    }));
  }

  async procesarWebhookTransbank(webhookData: any) {
    // En un entorno real, aquí se procesarían las notificaciones de Transbank
    // Por ahora, simulamos el procesamiento
    this.logger.log(`Webhook de Transbank recibido: ${JSON.stringify(webhookData)}`);
    
    // Aquí se actualizaría el estado de la orden según la respuesta de Transbank
    // y se activaría el plan premium en la publicación correspondiente
    
    return { status: 'success', message: 'Webhook procesado correctamente' };
  }

  private generarBuyOrder(): string {
    const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const timestamp = Date.now().toString().slice(-6);
    return `ORD-${fecha}-${timestamp}`;
  }

  private generarTokenSimulado(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private generarSessionId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // Método para actualizar el estado de una orden (usado internamente)
  async actualizarEstadoOrden(idOrdenPago: number, nuevoEstado: EstadoPago, datosTransbank?: any) {
    const orden = await this.prisma.ordenPago.update({
      where: { id: idOrdenPago },
      data: {
        estadoPago: nuevoEstado,
        fechaPago: nuevoEstado === EstadoPago.PAGADO ? new Date() : null,
        codigoAutorizacion: datosTransbank?.authorizationCode || null,
        tipoTarjeta: datosTransbank?.cardType || null,
        ultimos4Digitos: datosTransbank?.last4Digits || null
      }
    });

    // Si el pago se completó, activar el plan premium en la publicación
    if (nuevoEstado === EstadoPago.PAGADO) {
      await this.activarPlanPremium(orden.publicacionId!, orden.planPremiumId);
    }

    return orden;
  }

  private async activarPlanPremium(publicacionId: number, planPremiumId: number) {
    const planPremium = await this.prisma.planPremium.findUnique({
      where: { id: planPremiumId }
    });

    if (planPremium) {
      const fechaInicio = new Date();
      const fechaFin = new Date(fechaInicio.getTime() + planPremium.duracionDias * 24 * 60 * 60 * 1000);

      await this.prisma.publicacion.update({
        where: { id: publicacionId },
        data: {
          esPremium: true,
          fechaExpiracion: fechaFin
        }
      });

      this.logger.log(`Plan premium activado para publicación ${publicacionId} hasta ${fechaFin}`);
    }
  }
}