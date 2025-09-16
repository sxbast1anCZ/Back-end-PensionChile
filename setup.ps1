# 🚀 Setup script para Back-end PensionChile (Windows)
# Este script automatiza la configuración inicial del proyecto

Write-Host "🏠 Configurando Back-end PensionChile..." -ForegroundColor Green
Write-Host ""

# Verificar que Node.js esté instalado
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verificar que Docker esté instalado
Write-Host "🔍 Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker encontrado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está instalado. Por favor instálalo desde https://docker.com/" -ForegroundColor Red
    exit 1
}

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

# Verificar si existe .env
if (-not (Test-Path .env)) {
    Write-Host "📝 Copiando archivo de variables de entorno..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "⚠️  IMPORTANTE: Edita el archivo .env y genera tu propia clave JWT" -ForegroundColor Magenta
    Write-Host "   Ejecuta: node -e `"console.log(require('crypto').randomBytes(64).toString('hex'))`"" -ForegroundColor Cyan
    Write-Host ""
}

# Levantar Docker
Write-Host "🐳 Levantando base de datos con Docker..." -ForegroundColor Yellow
docker-compose up -d

# Esperar a que PostgreSQL esté listo
Write-Host "⏳ Esperando que PostgreSQL esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Configurar Prisma
Write-Host "🗄️ Configurando base de datos..." -ForegroundColor Yellow
npx prisma generate
npx prisma db push
npx prisma db seed

Write-Host ""
Write-Host "✅ ¡Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Para iniciar el servidor ejecuta:" -ForegroundColor Cyan
Write-Host "   npm run start:dev" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Para ver la base de datos ejecuta:" -ForegroundColor Cyan
Write-Host "   npx prisma studio" -ForegroundColor White
Write-Host ""
Write-Host "📖 Lee el README.md para más información" -ForegroundColor Cyan