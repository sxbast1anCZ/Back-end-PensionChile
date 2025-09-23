import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding completo...');

  // =====================================================
  // MÓDULO DE USUARIOS - Catálogos base
  // =====================================================
  console.log('👥 Creando tipos de usuario...');
  const tipoUniversitario = await prisma.tipoUsuario.upsert({
    where: { nombre: 'Universitario' },
    update: {},
    create: {
      nombre: 'Universitario',
      descripcion: 'Estudiante universitario buscando pensión',
      activo: true,
    },
  });

  const tipoPropietario = await prisma.tipoUsuario.upsert({
    where: { nombre: 'Propietario' },
    update: {},
    create: {
      nombre: 'Propietario',
      descripcion: 'Propietario de pensión ofreciendo alojamiento',
      activo: true,
    },
  });

  const tipoAdministrador = await prisma.tipoUsuario.upsert({
    where: { nombre: 'Administrador' },
    update: {},
    create: {
      nombre: 'Administrador',
      descripcion: 'Administrador del sistema',
      activo: true,
    },
  });

  console.log('📊 Creando estados de usuario...');
  const estadoActivo = await prisma.estadoUsuario.upsert({
    where: { nombre: 'Activo' },
    update: {},
    create: {
      nombre: 'Activo',
      descripcion: 'Usuario activo en el sistema',
      activo: true,
    },
  });

  const estadoInactivo = await prisma.estadoUsuario.upsert({
    where: { nombre: 'Inactivo' },
    update: {},
    create: {
      nombre: 'Inactivo',
      descripcion: 'Usuario temporalmente inactivo',
      activo: true,
    },
  });

  // =====================================================
  // MÓDULO DE UBICACIONES - Sistema geográfico de Chile
  // =====================================================
  console.log('🗺️ Creando regiones de Chile...');
  const regionRM = await prisma.region.upsert({
    where: { codigo: 'RM' },
    update: {},
    create: { codigo: 'RM', nombre: 'Metropolitana de Santiago', activo: true },
  });

  const regionV = await prisma.region.upsert({
    where: { codigo: '05' },
    update: {},
    create: { codigo: '05', nombre: 'Valparaíso', activo: true },
  });

  console.log('🏘️ Creando provincias principales...');
  let provinciaSantiago = await prisma.provincia.findFirst({
    where: {
      regionId: regionRM.id,
      nombre: 'Santiago'
    }
  });
  
  if (!provinciaSantiago) {
    provinciaSantiago = await prisma.provincia.create({
      data: {
        regionId: regionRM.id,
        codigo: 'SANT',
        nombre: 'Santiago',
        activo: true,
      },
    });
  }

  console.log('🏙️ Creando comunas principales...');
  const comunaSantiago = await prisma.comuna.upsert({
    where: { codigo: 'SANT' },
    update: {},
    create: {
      provinciaId: provinciaSantiago.id,
      regionId: regionRM.id,
      codigo: 'SANT',
      nombre: 'Santiago',
      activo: true,
    },
  });

  const comunaProvidencia = await prisma.comuna.upsert({
    where: { codigo: 'PROV' },
    update: {},
    create: {
      provinciaId: provinciaSantiago.id,
      regionId: regionRM.id,
      codigo: 'PROV',
      nombre: 'Providencia',
      activo: true,
    },
  });

  console.log('📍 Creando ubicaciones de ejemplo...');
  const ubicacion1 = await prisma.ubicacion.create({
    data: {
      regionId: regionRM.id,
      provinciaId: provinciaSantiago.id,
      comunaId: comunaSantiago.id,
      calle: 'Alameda Libertador Bernardo O\'Higgins',
      numero: '1058',
      referencias: 'Cerca del Metro Universidad de Chile',
      latitud: -33.4378,
      longitud: -70.6504,
    },
  });

  const ubicacion2 = await prisma.ubicacion.create({
    data: {
      regionId: regionRM.id,
      provinciaId: provinciaSantiago.id,
      comunaId: comunaProvidencia.id,
      calle: 'Avenida Providencia',
      numero: '2653',
      referencias: 'Cerca del Metro Los Leones',
      latitud: -33.4263,
      longitud: -70.6109,
    },
  });

  console.log('🎓 Creando universidades principales...');
  const universidad1 = await prisma.listadoUniversidades.create({
    data: {
      nombreUniversidad: 'Universidad de Chile',
      ubicacionId: ubicacion1.id,
      activo: true,
    },
  });

  const universidad2 = await prisma.listadoUniversidades.create({
    data: {
      nombreUniversidad: 'Pontificia Universidad Católica de Chile',
      ubicacionId: ubicacion2.id,
      activo: true,
    },
  });

  // =====================================================
  // CATÁLOGOS DE PUBLICACIONES
  // =====================================================
  console.log('🏠 Creando tipos de vivienda...');
  const tipoHabitacion = await prisma.tipoVivienda.upsert({
    where: { nombre: 'Habitación' },
    update: {},
    create: {
      nombre: 'Habitación',
      descripcion: 'Habitación individual en casa o departamento',
      activo: true,
    },
  });

  const tipoPension = await prisma.tipoVivienda.upsert({
    where: { nombre: 'Pensión' },
    update: {},
    create: {
      nombre: 'Pensión',
      descripcion: 'Pensión tradicional para estudiantes',
      activo: true,
    },
  });

  console.log('👥 Creando sexos permitidos...');
  const sexoMixto = await prisma.sexosPermitidos.upsert({
    where: { nombre: 'Mixto' },
    update: {},
    create: {
      nombre: 'Mixto',
      descripcion: 'Hombres y mujeres',
      activo: true,
    },
  });

  const sinPreferencia = await prisma.sexosPermitidos.upsert({
    where: { nombre: 'Sin preferencia' },
    update: {},
    create: {
      nombre: 'Sin preferencia',
      descripcion: 'No hay restricciones de género',
      activo: true,
    },
  });

  // =====================================================
  // SISTEMA DE PAGOS - Planes Premium
  // =====================================================
  console.log('💳 Creando planes premium...');
  const planPremium7 = await prisma.planPremium.create({
    data: {
      nombre: 'Premium 7 días',
      descripcion: 'Destacar tu publicación por 7 días',
      precio: 2990,
      duracionDias: 7,
      activo: true,
      destacarPublicacion: true,
      aparecerPrimero: true,
      insigniaEspecial: false,
      multiplicadorVisitas: 2,
    },
  });

  const planPremium30 = await prisma.planPremium.create({
    data: {
      nombre: 'Premium 30 días',
      descripcion: 'Destacar tu publicación por 30 días',
      precio: 7990,
      duracionDias: 30,
      activo: true,
      destacarPublicacion: true,
      aparecerPrimero: true,
      insigniaEspecial: true,
      multiplicadorVisitas: 5,
    },
  });

  // =====================================================
  // USUARIOS DE EJEMPLO PARA DESARROLLO
  // =====================================================
  console.log('👤 Creando usuarios de ejemplo...');

  // Usuario Universitario de ejemplo
  const usuarioUniversitario = await prisma.usuario.create({
    data: {
      rut: '12.345.678-9',
      nombreUsuario: 'Carlos',
      primerApellido: 'González',
      segundoApellido: 'Pérez',
      telefono: '987654321',
      correoElectronico: 'carlos.gonzalez@estudiante.uchile.cl',
      contrasena: '$2b$10$placeholder', // En producción usar bcrypt real
      tipoUsuario: tipoUniversitario.id,
      estadoUsuario: estadoActivo.id,
    },
  });

  // Crear perfil de universitario
  await prisma.universitario.create({
    data: {
      idUsuario: usuarioUniversitario.idUsuario,
      ciudad: 'Santiago',
      region: 'Metropolitana',
      universidadEstudio: 'Universidad de Chile',
      universidadId: universidad1.id,
    },
  });

  // Usuario Propietario de ejemplo
  const usuarioPropietario = await prisma.usuario.create({
    data: {
      rut: '11.222.333-4',
      nombreUsuario: 'María',
      primerApellido: 'Silva',
      segundoApellido: 'Rodríguez',
      telefono: '912345678',
      correoElectronico: 'maria.silva@pensionchile.cl',
      contrasena: '$2b$10$placeholder', // En producción usar bcrypt real
      tipoUsuario: tipoPropietario.id,
      estadoUsuario: estadoActivo.id,
    },
  });

  // Crear perfil de propietario
  await prisma.propietario.create({
    data: {
      idUsuario: usuarioPropietario.idUsuario,
      biografiaUsuario: 'Propietaria con más de 10 años de experiencia ofreciendo alojamiento a estudiantes universitarios. Ambiente familiar y acogedor.',
      cantidadPublicaciones: 2,
    },
  });

  // =====================================================
  // PUBLICACIONES DE EJEMPLO
  // =====================================================
  console.log('🏡 Creando publicaciones de ejemplo...');

  const publicacion1 = await prisma.publicacion.create({
    data: {
      propietarioId: usuarioPropietario.idUsuario,
      titulo: 'Habitación cómoda cerca de la Universidad de Chile',
      descripcion: 'Habitación individual con escritorio, cama de 1.5 plazas, closet y muy buena iluminación natural. Casa ubicada a solo 5 minutos caminando del metro Universidad de Chile.',
      precioMensual: 180000,
      tieneBañoPropio: false,
      tieneCocinaPropia: false,
      tieneLavanderia: true,
      tieneAccesibilidad: false,
      tieneInternet: true,
      incluyeAlmuerzo: true,
      tipoVivienda: tipoHabitacion.id,
      sexosPermitidos: sexoMixto.id,
      ubicacionId: ubicacion1.id,
      esPremium: false,
      estadoPublicacion: 1,
    },
  });

  const publicacion2 = await prisma.publicacion.create({
    data: {
      propietarioId: usuarioPropietario.idUsuario,
      titulo: 'Pensión Premium en Providencia - Ambiente estudiantil',
      descripcion: 'Excelente pensión para estudiantes en el corazón de Providencia. Habitaciones amplias, internet de alta velocidad, cocina equipada y ambiente muy tranquilo para estudiar.',
      precioMensual: 250000,
      tieneBañoPropio: true,
      tieneCocinaPropia: true,
      tieneLavanderia: true,
      tieneAccesibilidad: true,
      tieneInternet: true,
      incluyeAlmuerzo: false,
      tipoVivienda: tipoPension.id,
      sexosPermitidos: sinPreferencia.id,
      ubicacionId: ubicacion2.id,
      esPremium: true,
      estadoPublicacion: 1,
      fechaExpiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días desde ahora
    },
  });

  // =====================================================
  // DATOS DE PRUEBA PARA FUNCIONALIDADES
  // =====================================================
  console.log('⭐ Creando datos de prueba...');
  
  // Favorito de ejemplo
  await prisma.favorito.create({
    data: {
      usuarioId: usuarioUniversitario.idUsuario,
      publicacionId: publicacion2.id,
    },
  });

  // Reseña de ejemplo
  await prisma.resena.create({
    data: {
      publicacionId: publicacion1.id,
      usuarioId: usuarioUniversitario.idUsuario,
      textoResena: 'Excelente lugar, muy cómodo y la propietaria es muy amable. La ubicación es perfecta para ir a la universidad caminando.',
      calificacion: 9,
    },
  });

  // Contacto de ejemplo
  await prisma.contacto.create({
    data: {
      publicacionId: publicacion1.id,
      universitarioId: usuarioUniversitario.idUsuario,
      propietarioId: usuarioPropietario.idUsuario,
      nombreCompleto: 'Carlos González Pérez',
      telefono: '987654321',
      correo: 'carlos.gonzalez@estudiante.uchile.cl',
      mensaje: 'Hola, me interesa mucho la habitación. ¿Podríamos coordinar una visita para este fin de semana? Soy estudiante de Ingeniería en la Universidad de Chile.',
      leido: true,
      respondido: false,
      fechaLectura: new Date(),
    },
  });

  console.log('✅ Seeding completado exitosamente!');
  console.log(`
📊 Resumen de datos creados:
- ✅ 3 tipos de usuario
- ✅ 2 estados de usuario  
- ✅ 2 regiones principales
- ✅ 1 provincia
- ✅ 2 comunas
- ✅ 2 ubicaciones
- ✅ 2 universidades
- ✅ 2 tipos de vivienda
- ✅ 2 opciones de sexos permitidos
- ✅ 2 planes premium
- ✅ 2 usuarios de ejemplo (universitario y propietario)
- ✅ 2 publicaciones de ejemplo
- ✅ 1 favorito, 1 reseña, 1 contacto de ejemplo

🚀 Base de datos lista para desarrollo y testing!
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
