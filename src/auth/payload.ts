export class PayloadEntity {
    sub: number; // ID del usuario (subject)
    correoElectronico: string; // Email del usuario
    tipoUsuarioId: number; // Tipo de usuario (universitario/propietario)
    estadoUsuarioId: number; // Estado del usuario
    iat?: number; // Issued at (timestamp de creación del token)
    exp?: number; // Expiration time (timestamp de expiración)
}