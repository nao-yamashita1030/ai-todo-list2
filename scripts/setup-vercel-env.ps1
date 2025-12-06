# Vercel環境変数設定スクリプト
# .env.localから環境変数を読み取り、Vercelに設定します

param(
    [string]$Environment = "development"
)

# .env.localファイルのパス
$envLocalPath = ".\.env.local"

if (-not (Test-Path $envLocalPath)) {
    Write-Host "エラー: .env.localファイルが見つかりません。" -ForegroundColor Red
    exit 1
}

# .env.localファイルから環境変数を読み取り
$envContent = Get-Content $envLocalPath

# 環境変数の抽出
$clerkPublishableKey = ($envContent | Select-String -Pattern '^NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=').Line -replace '^NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=', ''
$clerkSecretKey = ($envContent | Select-String -Pattern '^CLERK_SECRET_KEY=').Line -replace '^CLERK_SECRET_KEY=', ''
$databaseUrl = ($envContent | Select-String -Pattern '^DATABASE_URL=').Line -replace '^DATABASE_URL=', '' -replace '"', ''

Write-Host "環境変数の設定を開始します..." -ForegroundColor Green
Write-Host "環境: $Environment" -ForegroundColor Yellow
Write-Host ""

# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEYの設定
if ($clerkPublishableKey) {
    Write-Host "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEYを設定中..." -ForegroundColor Cyan
    Write-Host "値: $clerkPublishableKey" -ForegroundColor Gray
    $clerkPublishableKey | vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY $Environment
    Write-Host ""
}

# CLERK_SECRET_KEYの設定
if ($clerkSecretKey) {
    Write-Host "CLERK_SECRET_KEYを設定中..." -ForegroundColor Cyan
    Write-Host "値: $clerkSecretKey" -ForegroundColor Gray
    $clerkSecretKey | vercel env add CLERK_SECRET_KEY $Environment
    Write-Host ""
}

# DATABASE_URLの設定
if ($databaseUrl -and $databaseUrl -ne "file:./dev.db") {
    Write-Host "DATABASE_URLを設定中..." -ForegroundColor Cyan
    Write-Host "値: $databaseUrl" -ForegroundColor Gray
    $databaseUrl | vercel env add DATABASE_URL $Environment
    Write-Host ""
} elseif ($databaseUrl -eq "file:./dev.db") {
    Write-Host "警告: DATABASE_URLがSQLite用の設定になっています。Supabase用のPostgreSQL接続文字列に変更してください。" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "環境変数の設定が完了しました。" -ForegroundColor Green
Write-Host ""
Write-Host "設定を確認するには、以下のコマンドを実行してください:" -ForegroundColor Cyan
Write-Host "vercel env ls" -ForegroundColor White

