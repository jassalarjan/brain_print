# Phi-2 Local Setup Guide

## Quick Start (Windows)

### Automated Setup
Run the setup script:
```powershell
.\setup-phi2.ps1
```

This will:
1. Check if Ollama is installed
2. Download Phi-2 model (~1.7GB)
3. Test the installation
4. Configure your environment

### Manual Setup

#### 1. Install Ollama
Download from: https://ollama.com/download/windows

Or use winget:
```powershell
winget install Ollama.Ollama
```

#### 2. Download Phi-2
```powershell
ollama pull phi
```

#### 3. Configure Environment
Add to `server/.env`:
```env
PHI2_LOCAL_ENDPOINT=http://localhost:11434
```

#### 4. Restart Server
```bash
cd server
npm run dev
```

## How It Works

### Architecture
```
User Message
    ↓
Server (Node.js)
    ↓
Phi-2 Service
    ↓
Ollama API (localhost:11434)
    ↓
Phi-2 Model (local)
    ↓
AI Response
```

### Benefits of Local Phi-2
- ✅ **100% Free** - No API costs
- ✅ **Privacy** - All data stays on your machine
- ✅ **Fast** - No network latency
- ✅ **Offline** - Works without internet
- ✅ **Unlimited** - No rate limits

### System Requirements
- **RAM**: 4GB minimum (8GB recommended)
- **Disk**: 2GB for Phi-2 model
- **CPU**: Any modern processor (GPU not required)

## Testing Phi-2

### Test from Command Line
```powershell
ollama run phi "Hello, how are you?"
```

### Test from API
```powershell
curl http://localhost:11434/api/generate -d '{
  "model": "phi",
  "prompt": "Hello world",
  "stream": false
}'
```

### Test in Application
1. Go to http://localhost:5174/chat
2. Send a message
3. Check server logs for: `🤖 Phi-2 Service initialized with local endpoint`

## Ollama Commands

### List Models
```powershell
ollama list
```

### Remove Model
```powershell
ollama rm phi
```

### Update Model
```powershell
ollama pull phi
```

### Check Service Status
```powershell
Get-Process -Name "ollama"
```

## Troubleshooting

### Ollama Not Starting
```
Error: connection refused at localhost:11434
```

**Solution**: Restart Ollama
```powershell
# Stop Ollama
Stop-Process -Name "ollama"

# Start Ollama (it will auto-start when you use it)
ollama serve
```

### Model Not Found
```
Error: model 'phi' not found
```

**Solution**: Re-download model
```powershell
ollama pull phi
```

### Port Already in Use
```
Error: bind: address already in use
```

**Solution**: Change port in `.env`
```env
PHI2_LOCAL_ENDPOINT=http://localhost:11435
```

Then run Ollama on custom port:
```powershell
$env:OLLAMA_HOST="0.0.0.0:11435"
ollama serve
```

### Server Can't Connect to Ollama
Check if Ollama is running:
```powershell
curl http://localhost:11434/api/version
```

Should return:
```json
{"version":"0.1.x"}
```

## Performance Tuning

### Adjust Response Speed
In `phi2.service.ts`, modify:
```typescript
options: {
  temperature: 0.7,     // Lower = faster, more deterministic
  num_predict: 150,     // Lower = faster, shorter responses
}
```

### Enable GPU (if available)
Ollama automatically uses GPU if available. Check with:
```powershell
ollama run phi "test" --verbose
```

Look for: `using gpu: true`

## Alternative Models

### Try Other Models
```powershell
# Smaller, faster
ollama pull tinyllama

# Larger, smarter
ollama pull llama2
ollama pull mistral
```

Update service:
```typescript
// In phi2.service.ts
body: JSON.stringify({
  model: 'tinyllama',  // Change model name
  ...
})
```

## Advanced Configuration

### Custom System Prompt
Edit `buildPrompt()` in `phi2.service.ts`:
```typescript
const systemPrompt = `You are a personal AI assistant...`;
const prompt = `${systemPrompt}\n\nUser: ${userMessage}\nAssistant:`;
```

### Memory Context Window
Increase context from user's memories:
```typescript
// In ai-context.service.ts
const memories = triggeredResponses
  .flatMap(tr => tr.memories)
  .slice(0, 10);  // Increase from 5 to 10
```

### Response Length
```typescript
options: {
  num_predict: 300,  // Longer responses
}
```

## Monitoring

### View Ollama Logs
```powershell
# Check running models
ollama list

# View active requests
ollama ps
```

### Server Logs
Look for:
```
🤖 Phi-2 Service initialized with local endpoint: http://localhost:11434
```

If you see fallback warnings, Phi-2 isn't connecting properly.

## Uninstalling

### Remove Phi-2 Model
```powershell
ollama rm phi
```

### Uninstall Ollama
```powershell
winget uninstall Ollama.Ollama
```

Or use Windows Settings > Apps > Ollama

## Resources

- [Ollama Documentation](https://github.com/ollama/ollama)
- [Phi-2 Model Card](https://huggingface.co/microsoft/phi-2)
- [Ollama API Reference](https://github.com/ollama/ollama/blob/main/docs/api.md)

---

**Note**: The system automatically falls back to rule-based responses if Phi-2/Ollama is unavailable, ensuring the chat always works.
