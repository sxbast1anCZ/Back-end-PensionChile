import { Decimal } from '@prisma/client/runtime/library';

export class PublicacionEntity {
  id: number;
  propietarioId: number;
  titulo: string;
  descripcion?: string;
  precioMensual: Decimal;

  // Servicios incluidos
  tieneBanoPropio?: boolean;
  tieneCocinaPropia?: boolean;
  tieneLavanderia?: boolean;
  tieneAccesibilidad?: boolean;
  tieneInternet?: boolean;
  incluyeAlmuerzo?: boolean;

  // Referencias a catálogos
  tipoViviendaId: number;
  sexoPermitidoId?: number;
  ubicacionId: number;

  // Premium y estados
  esPremium: boolean;
  estadoPublicacion: number; // 1: Activo, 2: Inactivo

  // Fechas
  fechaCreacion: Date;
  fechaActualizacion: Date;
  fechaExpiracion?: Date;

  // Relaciones opcionales (solo cuando se soliciten específicamente)
  propietario?: {
    id: number;
    nombreUsuario: string;
    primerApellido: string;
    segundoApellido?: string;
    correoElectronico: string;
    telefono: string;
  };

  tipoVivienda?: {
    id: number;
    nombre: string;
    descripcion?: string;
  };

  sexoPermitido?: {
    id: number;
    nombre: string;
    descripcion?: string;
  };

  ubicacion?: {
    id: number;
    calle: string;
    numero?: string;
    referencias?: string;
    comuna?: {
      id: number;
      nombre: string;
      provincia?: {
        id: number;
        nombre: string;
        region?: {
          id: number;
          nombre: string;
        };
      };
    };
  };

  fotos?: {
    id: number;
    urlSupabase: string;
    nombreArchivo: string;
    esPortada: boolean;
    orden: number;
  }[];

  resenas?: {
    id: number;
    usuarioId: number;
    textoResena: string;
    calificacion: number;
    fechaCreacion: Date;
    usuario?: {
      id: number;
      nombreUsuario: string;
      primerApellido: string;
    };
  }[];

  // Campos calculados
  cantidadResenas?: number;
  promedioCalificacion?: number;
  esFavorito?: boolean; // Para cuando un usuario específico la consulta
}