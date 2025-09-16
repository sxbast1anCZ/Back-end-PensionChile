import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding...');

  // Seeder para tipos de usuario
  console.log('📝 Creando tipos de usuario...');
  await prisma.tipoUsuario.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nombre: 'Universitario',
      descripcion: 'Estudiante universitario buscando arriendo',
      activo: true,
    },
  });

  await prisma.tipoUsuario.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      nombre: 'Propietario',
      descripcion: 'Propietario de inmuebles para arriendo',
      activo: true,
    },
  });

  await prisma.tipoUsuario.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      nombre: 'Administrador',
      descripcion: 'Usuario con control total del sistema. Gestiona usuarios, publicaciones de alojamientos y configuraciones avanzadas. Puede aprobar, modificar o eliminar contenidos para asegurar el correcto funcionamiento de la plataforma',
      activo: true,
    },
  });

  // Seeder para estados de usuario
  console.log('📝 Creando estados de usuario...');
  await prisma.estadoUsuario.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nombre: 'Activo',
      descripcion: 'Usuario activo en el sistema',
      activo: true,
    },
  });

  await prisma.estadoUsuario.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      nombre: 'Inactivo',
      descripcion: 'Usuario temporalmente inactivo',
      activo: true,
    },
  });

  await prisma.estadoUsuario.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      nombre: 'Suspendido',
      descripcion: 'Usuario suspendido por incumplimiento',
      activo: true,
    },
  });

  await prisma.estadoUsuario.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      nombre: 'Pendiente',
      descripcion: 'Usuario pendiente de verificación',
      activo: true,
    },
  });

  // Seeder para tipos de vivienda
  console.log('🏠 Creando tipos de vivienda...');
  await prisma.tipoVivienda.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nombre: 'Habitación',
      descripcion: 'Habitación individual en casa compartida',
      activo: true,
    },
  });

  await prisma.tipoVivienda.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      nombre: 'Departamento monoambiente',
      descripcion: 'Departamento de un solo ambiente',
      activo: true,
    },
  });

  await prisma.tipoVivienda.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      nombre: 'Departamento',
      descripcion: 'Departamento completo con múltiples habitaciones',
      activo: true,
    },
  });

  // Seeder para sexos permitidos
  console.log('👥 Creando opciones de sexos permitidos...');
  await prisma.sexosPermitidos.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nombre: 'Masculino',
      descripcion: 'Solo hombres',
      activo: true,
    },
  });

  await prisma.sexosPermitidos.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      nombre: 'Femenino',
      descripcion: 'Solo mujeres',
      activo: true,
    },
  });

  await prisma.sexosPermitidos.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      nombre: 'Mixto',
      descripcion: 'Hombres y mujeres',
      activo: true,
    },
  });

  await prisma.sexosPermitidos.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      nombre: 'Sin preferencia',
      descripcion: 'No hay restricción por género',
      activo: true,
    },
  });

  console.log('✅ Seeding completado exitosamente!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error durante el seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
