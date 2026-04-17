# setup-cloudflare-account-id.ps1
Write-Host "🔧 Configurando CLOUDFLARE_ACCOUNT_ID en GitHub..." -ForegroundColor Cyan

# Verificar gh
if (!(Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI (gh) no está instalado. Instálalo desde https://cli.github.com/" -ForegroundColor Red
    exit 1
}

# Verificar autenticación
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ No autenticado en GitHub CLI. Ejecuta: gh auth login" -ForegroundColor Red
    exit 1
}

# Obtener token de Cloudflare
$cfToken = gh secret list --json name,value | ConvertFrom-Json | Where-Object { $_.name -eq "CLOUDFLARE_API_TOKEN" } | Select-Object -ExpandProperty value

if (-not $cfToken) {
    Write-Host "⚠️ No se encontró CLOUDFLARE_API_TOKEN en secrets." -ForegroundColor Yellow
    $cfToken = Read-Host -Prompt "Introduce tu CLOUDFLARE_API_TOKEN" -AsSecureString
    $cfToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($cfToken))
}

if (-not $cfToken) {
    Write-Host "❌ No se proporcionó token. Abortando." -ForegroundColor Red
    exit 1
}

# Obtener Account ID
Write-Host "📡 Obteniendo Account ID desde Cloudflare..."
$headers = @{ Authorization = "Bearer $cfToken" }
$response = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts" -Headers $headers
$accountId = $response.result[0].id

if (-not $accountId) {
    Write-Host "❌ No se pudo obtener el Account ID." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Account ID obtenido: $accountId" -ForegroundColor Green

# Configurar secret
$accountId | gh secret set CLOUDFLARE_ACCOUNT_ID
Write-Host "✅ Secret CLOUDFLARE_ACCOUNT_ID configurado." -ForegroundColor Green
