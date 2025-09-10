-- CreateTable
CREATE TABLE "public"."usuarios" (
    "idUsuario" SERIAL NOT NULL,
    "nombreUsuario" VARCHAR(100) NOT NULL,
    "primerApellido" VARCHAR(100) NOT NULL,
    "segundoApellido" VARCHAR(100),
    "telefono" VARCHAR(9) NOT NULL,
    "correoElectronico" VARCHAR(255) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "tipoUsuario" INTEGER NOT NULL,
    "estadoUsuario" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "public"."tipos_usuario" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tipos_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."estados_usuario" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "estados_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."universitarios" (
    "id" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,
    "region" VARCHAR(100) NOT NULL,
    "universidadEstudio" VARCHAR(255) NOT NULL,

    CONSTRAINT "universitarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."propietarios" (
    "id" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "biografiaUsuario" TEXT,
    "cantidadPublicaciones" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "propietarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correoElectronico_key" ON "public"."usuarios"("correoElectronico");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_usuario_nombre_key" ON "public"."tipos_usuario"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "estados_usuario_nombre_key" ON "public"."estados_usuario"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "universitarios_idUsuario_key" ON "public"."universitarios"("idUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "propietarios_idUsuario_key" ON "public"."propietarios"("idUsuario");

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_tipoUsuario_fkey" FOREIGN KEY ("tipoUsuario") REFERENCES "public"."tipos_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_estadoUsuario_fkey" FOREIGN KEY ("estadoUsuario") REFERENCES "public"."estados_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."universitarios" ADD CONSTRAINT "universitarios_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "public"."usuarios"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."propietarios" ADD CONSTRAINT "propietarios_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "public"."usuarios"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;
