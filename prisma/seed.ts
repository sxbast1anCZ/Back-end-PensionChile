import { PrismaClient } from '../generated/prisma';

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
