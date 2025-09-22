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

  // ===== SEEDER PARA UBICACIONES DE CHILE =====
  
  // Seeder para regiones
  console.log('🗺️ Creando regiones de Chile...');
  const regionesData = [
    { id: 1, codigo: '01', nombre: 'Región de Tarapacá' },
    { id: 2, codigo: '02', nombre: 'Región de Antofagasta' },
    { id: 3, codigo: '03', nombre: 'Región de Atacama' },
    { id: 4, codigo: '04', nombre: 'Región de Coquimbo' },
    { id: 5, codigo: '05', nombre: 'Región de Valparaíso' },
    { id: 6, codigo: '06', nombre: 'Región del Libertador General Bernardo O\'Higgins' },
    { id: 7, codigo: '07', nombre: 'Región del Maule' },
    { id: 8, codigo: '16', nombre: 'Región de Ñuble' },
    { id: 9, codigo: '08', nombre: 'Región del Biobío' },
    { id: 10, codigo: '09', nombre: 'Región de La Araucanía' },
    { id: 11, codigo: '14', nombre: 'Región de Los Ríos' },
    { id: 12, codigo: '10', nombre: 'Región de Los Lagos' },
    { id: 13, codigo: '11', nombre: 'Región Aysén del General Carlos Ibáñez del Campo' },
    { id: 14, codigo: '12', nombre: 'Región de Magallanes y de la Antártica Chilena' },
    { id: 15, codigo: 'RM', nombre: 'Región Metropolitana de Santiago' },
  ];

  for (const region of regionesData) {
    await prisma.region.upsert({
      where: { id: region.id },
      update: {},
      create: region,
    });
  }

  // Seeder para provincias principales (simplificado)
  console.log('🏛️ Creando provincias principales...');
  const provinciasData = [
    // Región Metropolitana (las más importantes)
    { id: 1, regionId: 15, codigo: '131', nombre: 'Santiago' },
    { id: 2, regionId: 15, codigo: '132', nombre: 'Cordillera' },
    { id: 3, regionId: 15, codigo: '133', nombre: 'Chacabuco' },
    { id: 4, regionId: 15, codigo: '134', nombre: 'Maipo' },
    { id: 5, regionId: 15, codigo: '135', nombre: 'Melipilla' },
    { id: 6, regionId: 15, codigo: '136', nombre: 'Talagante' },
    
    // Valparaíso
    { id: 7, regionId: 5, codigo: '051', nombre: 'Valparaíso' },
    { id: 8, regionId: 5, codigo: '052', nombre: 'Isla de Pascua' },
    { id: 9, regionId: 5, codigo: '053', nombre: 'Los Andes' },
    { id: 10, regionId: 5, codigo: '054', nombre: 'Petorca' },
    { id: 11, regionId: 5, codigo: '055', nombre: 'Quillota' },
    { id: 12, regionId: 5, codigo: '056', nombre: 'San Antonio' },
    { id: 13, regionId: 5, codigo: '057', nombre: 'San Felipe de Aconcagua' },
    { id: 14, regionId: 5, codigo: '058', nombre: 'Marga Marga' },
    
    // Biobío
    { id: 15, regionId: 9, codigo: '081', nombre: 'Concepción' },
    { id: 16, regionId: 9, codigo: '082', nombre: 'Arauco' },
    { id: 17, regionId: 9, codigo: '083', nombre: 'Biobío' },
  ];

  for (const provincia of provinciasData) {
    await prisma.provincia.upsert({
      where: { id: provincia.id },
      update: {},
      create: provincia,
    });
  }

  // Seeder para comunas principales
  console.log('🏘️ Creando comunas principales...');
  const comunasData = [
    // Santiago (las más importantes para universitarios)
    { id: 1, provinciaId: 1, regionId: 15, codigo: '13101', nombre: 'Santiago' },
    { id: 2, provinciaId: 1, regionId: 15, codigo: '13102', nombre: 'Cerrillos' },
    { id: 3, provinciaId: 1, regionId: 15, codigo: '13103', nombre: 'Cerro Navia' },
    { id: 4, provinciaId: 1, regionId: 15, codigo: '13104', nombre: 'Conchalí' },
    { id: 5, provinciaId: 1, regionId: 15, codigo: '13105', nombre: 'El Bosque' },
    { id: 6, provinciaId: 1, regionId: 15, codigo: '13106', nombre: 'Estación Central' },
    { id: 7, provinciaId: 1, regionId: 15, codigo: '13107', nombre: 'Huechuraba' },
    { id: 8, provinciaId: 1, regionId: 15, codigo: '13108', nombre: 'Independencia' },
    { id: 9, provinciaId: 1, regionId: 15, codigo: '13109', nombre: 'La Cisterna' },
    { id: 10, provinciaId: 1, regionId: 15, codigo: '13110', nombre: 'La Florida' },
    { id: 11, provinciaId: 1, regionId: 15, codigo: '13111', nombre: 'La Granja' },
    { id: 12, provinciaId: 1, regionId: 15, codigo: '13112', nombre: 'La Pintana' },
    { id: 13, provinciaId: 1, regionId: 15, codigo: '13113', nombre: 'La Reina' },
    { id: 14, provinciaId: 1, regionId: 15, codigo: '13114', nombre: 'Las Condes' },
    { id: 15, provinciaId: 1, regionId: 15, codigo: '13115', nombre: 'Lo Barnechea' },
    { id: 16, provinciaId: 1, regionId: 15, codigo: '13116', nombre: 'Lo Espejo' },
    { id: 17, provinciaId: 1, regionId: 15, codigo: '13117', nombre: 'Lo Prado' },
    { id: 18, provinciaId: 1, regionId: 15, codigo: '13118', nombre: 'Macul' },
    { id: 19, provinciaId: 1, regionId: 15, codigo: '13119', nombre: 'Maipú' },
    { id: 20, provinciaId: 1, regionId: 15, codigo: '13120', nombre: 'Ñuñoa' },
    { id: 21, provinciaId: 1, regionId: 15, codigo: '13121', nombre: 'Pedro Aguirre Cerda' },
    { id: 22, provinciaId: 1, regionId: 15, codigo: '13122', nombre: 'Peñalolén' },
    { id: 23, provinciaId: 1, regionId: 15, codigo: '13123', nombre: 'Providencia' },
    { id: 24, provinciaId: 1, regionId: 15, codigo: '13124', nombre: 'Pudahuel' },
    { id: 25, provinciaId: 1, regionId: 15, codigo: '13125', nombre: 'Quilicura' },
    { id: 26, provinciaId: 1, regionId: 15, codigo: '13126', nombre: 'Quinta Normal' },
    { id: 27, provinciaId: 1, regionId: 15, codigo: '13127', nombre: 'Recoleta' },
    { id: 28, provinciaId: 1, regionId: 15, codigo: '13128', nombre: 'Renca' },
    { id: 29, provinciaId: 1, regionId: 15, codigo: '13129', nombre: 'San Joaquín' },
    { id: 30, provinciaId: 1, regionId: 15, codigo: '13130', nombre: 'San Miguel' },
    { id: 31, provinciaId: 1, regionId: 15, codigo: '13131', nombre: 'San Ramón' },
    { id: 32, provinciaId: 1, regionId: 15, codigo: '13132', nombre: 'Vitacura' },

    // Otras comunas importantes
    { id: 33, provinciaId: 2, regionId: 15, codigo: '13201', nombre: 'Puente Alto' },
    { id: 34, provinciaId: 2, regionId: 15, codigo: '13202', nombre: 'Pirque' },
    { id: 35, provinciaId: 2, regionId: 15, codigo: '13203', nombre: 'San José de Maipo' },
    
    { id: 36, provinciaId: 4, regionId: 15, codigo: '13401', nombre: 'San Bernardo' },
    { id: 37, provinciaId: 4, regionId: 15, codigo: '13402', nombre: 'Buin' },
    { id: 38, provinciaId: 4, regionId: 15, codigo: '13403', nombre: 'Calera de Tango' },
    { id: 39, provinciaId: 4, regionId: 15, codigo: '13404', nombre: 'Paine' },

    // Valparaíso
    { id: 40, provinciaId: 7, regionId: 5, codigo: '05101', nombre: 'Valparaíso' },
    { id: 41, provinciaId: 7, regionId: 5, codigo: '05102', nombre: 'Casablanca' },
    { id: 42, provinciaId: 7, regionId: 5, codigo: '05103', nombre: 'Concón' },
    { id: 43, provinciaId: 7, regionId: 5, codigo: '05104', nombre: 'Juan Fernández' },
    { id: 44, provinciaId: 7, regionId: 5, codigo: '05105', nombre: 'Puchuncaví' },
    { id: 45, provinciaId: 7, regionId: 5, codigo: '05106', nombre: 'Quintero' },
    { id: 46, provinciaId: 7, regionId: 5, codigo: '05107', nombre: 'Viña del Mar' },

    // Concepción
    { id: 47, provinciaId: 15, regionId: 9, codigo: '08101', nombre: 'Concepción' },
    { id: 48, provinciaId: 15, regionId: 9, codigo: '08102', nombre: 'Coronel' },
    { id: 49, provinciaId: 15, regionId: 9, codigo: '08103', nombre: 'Chiguayante' },
    { id: 50, provinciaId: 15, regionId: 9, codigo: '08104', nombre: 'Florida' },
    { id: 51, provinciaId: 15, regionId: 9, codigo: '08105', nombre: 'Hualqui' },
    { id: 52, provinciaId: 15, regionId: 9, codigo: '08106', nombre: 'Lota' },
    { id: 53, provinciaId: 15, regionId: 9, codigo: '08107', nombre: 'Penco' },
    { id: 54, provinciaId: 15, regionId: 9, codigo: '08108', nombre: 'San Pedro de la Paz' },
    { id: 55, provinciaId: 15, regionId: 9, codigo: '08109', nombre: 'Santa Juana' },
    { id: 56, provinciaId: 15, regionId: 9, codigo: '08110', nombre: 'Talcahuano' },
    { id: 57, provinciaId: 15, regionId: 9, codigo: '08111', nombre: 'Tomé' },
    { id: 58, provinciaId: 15, regionId: 9, codigo: '08112', nombre: 'Hualpén' },
  ];

  for (const comuna of comunasData) {
    await prisma.comuna.upsert({
      where: { id: comuna.id },
      update: {},
      create: comuna,
    });
  }

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
