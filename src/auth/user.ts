export class UserEntity {
    id: number;
    rut: string;
    nombreUsuario: string;
    primerApellido: string;
    segundoApellido?: string;
    telefono: string;
    correoElectronico: string;
    contrasena: string;
    tipoUsuarioId: number;
    estadoUsuarioId: number;
    fechaCreacion: Date;
    fechaActualizacion: Date;

    // Relaciones principales (opcionales para cuando se incluyan)
    tipoUsuario?: {
        id: number;
        nombre: string;
        descripcion?: string;
        activo: boolean;
        fechaCreacion: Date;
    };

    estadoUsuario?: {
        id: number;
        nombre: string;
        descripcion?: string;
        activo: boolean;
        fechaCreacion: Date;
    };

    universitario?: {
        id: number;
        usuarioId: number;
        ciudad: string;
        region: string;
        universidadEstudio: string;
        universidadId?: number;
        fechaCreacion: Date;
    };

    propietario?: {
        id: number;
        usuarioId: number;
        biografia?: string;
        cantidadPublicaciones: number;
        fechaCreacion: Date;
    };
}