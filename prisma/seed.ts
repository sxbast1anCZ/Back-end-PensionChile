import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seeding...');

  // Seeder para tipos de usuario
  console.log('Creando tipos de usuario...');
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
  console.log('Creando estados de usuario...');
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
  console.log('Creando tipos de vivienda...');
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
  console.log('Creando opciones de sexos permitidos...');
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
  console.log('Creando regiones de Chile...');
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
  console.log('Creando provincias principales...');
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
  console.log('Creando comunas principales...');
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

  // Crear ubicaciones específicas para universidades principales
  console.log('Creando ubicaciones para universidades...');
  const ubicacionesUniversidades = [
    // Santiago Centro - Para universidades principales
    { id: 100, regionId: 15, provinciaId: 1, comunaId: 1, calle: 'Centro de Santiago', numero: 'S/N' },
    // Las Condes - Para universidades del sector oriente
    { id: 101, regionId: 15, provinciaId: 1, comunaId: 14, calle: 'Las Condes', numero: 'S/N' },
    // Providencia - Para universidades del sector
    { id: 102, regionId: 15, provinciaId: 1, comunaId: 23, calle: 'Providencia', numero: 'S/N' },
    // Maipú
    { id: 103, regionId: 15, provinciaId: 1, comunaId: 19, calle: 'Maipú', numero: 'S/N' },
    // Ñuñoa
    { id: 104, regionId: 15, provinciaId: 1, comunaId: 20, calle: 'Ñuñoa', numero: 'S/N' },
    // Valparaíso
    { id: 105, regionId: 5, provinciaId: 7, comunaId: 40, calle: 'Centro de Valparaíso', numero: 'S/N' },
    // Viña del Mar
    { id: 106, regionId: 5, provinciaId: 7, comunaId: 46, calle: 'Centro de Viña del Mar', numero: 'S/N' },
    // Concepción
    { id: 107, regionId: 9, provinciaId: 15, comunaId: 47, calle: 'Centro de Concepción', numero: 'S/N' },
  ];

  for (const ubicacion of ubicacionesUniversidades) {
    await prisma.ubicacion.upsert({
      where: { id: ubicacion.id },
      update: {},
      create: ubicacion,
    });
  }

  // Seeder para universidades de Chile
  console.log('Creando listado de universidades de Chile...');
  const universidadesData = [
    // Región Metropolitana - Santiago Centro (ID 100)
    { id: 1, nombreUniversidad: 'Universidad de Chile', ubicacionId: 100 },
    { id: 2, nombreUniversidad: 'Pontificia Universidad Católica de Chile', ubicacionId: 100 },
    { id: 3, nombreUniversidad: 'Universidad de Santiago de Chile (USACH)', ubicacionId: 100 },
    { id: 4, nombreUniversidad: 'Universidad Tecnológica Metropolitana (UTEM)', ubicacionId: 100 },
    { id: 5, nombreUniversidad: 'Universidad Mayor', ubicacionId: 100 },
    { id: 6, nombreUniversidad: 'Universidad Central de Chile', ubicacionId: 100 },
    { id: 7, nombreUniversidad: 'Universidad Diego Portales (UDP)', ubicacionId: 100 },
    { id: 8, nombreUniversidad: 'Universidad Alberto Hurtado', ubicacionId: 100 },
    { id: 9, nombreUniversidad: 'Universidad Academia de Humanismo Cristiano', ubicacionId: 100 },
    { id: 10, nombreUniversidad: 'Universidad Andrés Bello (UNAB)', ubicacionId: 100 },
    { id: 11, nombreUniversidad: 'Instituto Nacional de Capacitación (INACAP)', ubicacionId: 100 },
    { id: 12, nombreUniversidad: 'DUOC UC', ubicacionId: 100 },
    
    // Las Condes (ID 101)
    { id: 13, nombreUniversidad: 'Universidad del Desarrollo (UDD)', ubicacionId: 101 },
    { id: 14, nombreUniversidad: 'Universidad SEK', ubicacionId: 101 },
    
    // Providencia (ID 102)
    { id: 15, nombreUniversidad: 'Universidad Adolfo Ibáñez', ubicacionId: 102 },
    { id: 16, nombreUniversidad: 'Universidad Finis Terrae', ubicacionId: 102 },
    { id: 17, nombreUniversidad: 'Universidad de Las Américas (UDLA)', ubicacionId: 102 },
    { id: 18, nombreUniversidad: 'Universidad San Sebastián', ubicacionId: 102 },
    
    // Maipú (ID 103)
    { id: 19, nombreUniversidad: 'Universidad Católica Silva Henríquez', ubicacionId: 103 },
    
    // Ñuñoa (ID 104)
    { id: 20, nombreUniversidad: 'Universidad Metropolitana de Ciencias de la Educación (UMCE)', ubicacionId: 104 },
    
    // Sede Santiago de universidades regionales
    { id: 21, nombreUniversidad: 'Universidad Arturo Prat (sede Santiago)', ubicacionId: 100 },
    
    // Valparaíso (ID 105)
    { id: 22, nombreUniversidad: 'Pontificia Universidad Católica de Valparaíso (PUCV)', ubicacionId: 105 },
    { id: 23, nombreUniversidad: 'Universidad de Valparaíso', ubicacionId: 105 },
    { id: 24, nombreUniversidad: 'Universidad de Playa Ancha', ubicacionId: 105 },
    { id: 25, nombreUniversidad: 'Universidad Técnica Federico Santa María', ubicacionId: 105 },
    
    // Viña del Mar (ID 106)
    { id: 26, nombreUniversidad: 'Universidad Viña del Mar', ubicacionId: 106 },
    { id: 27, nombreUniversidad: 'Universidad Adolfo Ibáñez (Viña del Mar)', ubicacionId: 106 },
    
    // Concepción (ID 107)
    { id: 28, nombreUniversidad: 'Universidad de Concepción', ubicacionId: 107 },
    { id: 29, nombreUniversidad: 'Universidad del Bío-Bío', ubicacionId: 107 },
    { id: 30, nombreUniversidad: 'Universidad Católica de la Santísima Concepción', ubicacionId: 107 },
    { id: 31, nombreUniversidad: 'Universidad San Sebastián (Concepción)', ubicacionId: 107 },
    { id: 32, nombreUniversidad: 'Universidad Andrés Bello (Concepción)', ubicacionId: 107 },
    { id: 33, nombreUniversidad: 'INACAP Concepción', ubicacionId: 107 },
    
    // Universidades regionales principales (usando Santiago como ubicación temporal)
    { id: 34, nombreUniversidad: 'Universidad de La Serena', ubicacionId: 100 },
    { id: 35, nombreUniversidad: 'Universidad Católica del Norte', ubicacionId: 100 },
    { id: 36, nombreUniversidad: 'Universidad de Antofagasta', ubicacionId: 100 },
    { id: 37, nombreUniversidad: 'Universidad de Atacama', ubicacionId: 100 },
    { id: 38, nombreUniversidad: 'Universidad de Talca', ubicacionId: 100 },
    { id: 39, nombreUniversidad: 'Universidad Católica del Maule', ubicacionId: 100 },
    { id: 40, nombreUniversidad: 'Universidad de La Frontera', ubicacionId: 100 },
    { id: 41, nombreUniversidad: 'Universidad Católica de Temuco', ubicacionId: 100 },
    { id: 42, nombreUniversidad: 'Universidad Austral de Chile', ubicacionId: 100 },
    { id: 43, nombreUniversidad: 'Universidad de Los Lagos', ubicacionId: 100 },
    { id: 44, nombreUniversidad: 'Universidad de Magallanes', ubicacionId: 100 },
    
    // Opción para universidades no listadas
    { id: 45, nombreUniversidad: 'Otra Universidad (No listada)', ubicacionId: 100 },
  ];

  for (const universidad of universidadesData) {
    await prisma.listadoUniversidades.upsert({
      where: { id: universidad.id },
      update: {},
      create: universidad,
    });
  }

  // Seeder para planes premium
  console.log('Creando planes premium...');
  const planesPremiumData = [
    {
      id: 1,
      nombre: 'Premium 7 días',
      descripcion: 'Tu publicación destacada por 1 semana. Ideal para probar los beneficios premium.',
      precio: 5000, // $5.000 CLP
      duracionDias: 7,
      destacarPublicacion: true,
      aparecerPrimero: true,
      insigniaEspecial: false,
      multiplicadorVisitas: 2,
    },
    {
      id: 2,
      nombre: 'Premium 30 días',
      descripcion: 'Destaca tu propiedad por un mes completo. La opción más popular para maximizar visibilidad.',
      precio: 15000, // $15.000 CLP
      duracionDias: 30,
      destacarPublicacion: true,
      aparecerPrimero: true,
      insigniaEspecial: true,
      multiplicadorVisitas: 3,
    },
    {
      id: 3,
      nombre: 'Premium 90 días',
      descripcion: 'Máxima exposición por 3 meses. Perfecto para propiedades de larga duración.',
      precio: 35000, // $35.000 CLP (descuento por volumen)
      duracionDias: 90,
      destacarPublicacion: true,
      aparecerPrimero: true,
      insigniaEspecial: true,
      multiplicadorVisitas: 4,
    },
  ];

  for (const plan of planesPremiumData) {
    await prisma.planPremium.upsert({
      where: { id: plan.id },
      update: {},
      create: plan,
    });
  }

  console.log('Seeding completado exitosamente!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error durante el seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
