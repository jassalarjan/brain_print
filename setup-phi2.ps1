# Phi-2 Setup Script for Windows
# This script will install Ollama and download Phi-2 model

Write-Host "🚀 Setting up Phi-2 with Ollama..." -ForegroundColor Cyan
Write-Host ""

# Check if Ollama is installed
$ollamaInstalled = Get-Command ollama -ErrorAction SilentlyContinue

if (-not $ollamaInstalled) {
    Write-Host "📦 Ollama not found. Installing..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please download and install Ollama from:" -ForegroundColor Green
    Write-Host "https://ollama.com/download/windows" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "After installation, run this script again." -ForegroundColor Yellow
    
    # Open browser to download page
    Start-Process "https://ollama.com/download/windows"
    
    Read-Host "Press Enter after installing Ollama to continue"
    
    # Re-check
    $ollamaInstalled = Get-Command ollama -ErrorAction SilentlyContinue
    if (-not $ollamaInstalled) {
        Write-Host "❌ Ollama still not found. Please install it and try again." -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Ollama is installed" -ForegroundColor Green
Write-Host ""

# Pull Phi-2 model
Write-Host "📥 Downloading Phi-2 model (this may take a few minutes)..." -ForegroundColor Yellow
Write-Host "Model size: ~1.7GB" -ForegroundColor Gray
Write-Host ""

ollama pull phi

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Phi-2 model downloaded successfully!" -ForegroundColor Green
    Write-Host ""
    
    # Test the model
    Write-Host "🧪 Testing Phi-2..." -ForegroundColor Yellow
    $testResponse = ollama run phi "Say hello in one sentence" --verbose=false
    
    if ($testResponse) {
        Write-Host "✅ Phi-2 is working!" -ForegroundColor Green
        Write-Host "Test response: $testResponse" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "🎉 Setup complete!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Add to your .env file:" -ForegroundColor White
    Write-Host "   PHI2_LOCAL_ENDPOINT=http://localhost:11434" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Restart your server:" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Ollama will run in the background automatically" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host ""
    Write-Host "❌ Failed to download Phi-2 model" -ForegroundColor Red
    Write-Host "Please check your internet connection and try again" -ForegroundColor Yellow
    exit 1
}

# Check if Ollama service is running
Write-Host "🔍 Checking Ollama service..." -ForegroundColor Yellow
$ollamaProcess = Get-Process -Name "ollama" -ErrorAction SilentlyContinue

if ($ollamaProcess) {
    Write-Host "✅ Ollama service is running (PID: $($ollamaProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "⚠️  Ollama service is not running" -ForegroundColor Yellow
    Write-Host "It will start automatically when you use the chat feature" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📖 For more information, see PHI2_SETUP.md" -ForegroundColor Cyan
