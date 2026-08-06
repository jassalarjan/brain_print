# Phi-2 Integration Guide

## Overview
The Personal Context Engine now uses **Microsoft's Phi-2**, a compact 2.7B parameter language model, via Hugging Face's Inference API for intelligent, context-aware responses.

## Features
- ✅ Real AI-generated responses (not hardcoded)
- ✅ Context-aware using user's memories
- ✅ Emotion-sensitive replies (adapts to sentiment)
- ✅ Automatic fallback to rule-based responses if API unavailable
- ✅ Free tier available on Hugging Face

## Setup Instructions

### 1. Get Your Hugging Face API Key
1. Go to [Hugging Face](https://huggingface.co/join)
2. Create a free account (if you don't have one)
3. Navigate to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
4. Click **"New token"**
5. Give it a name (e.g., "context-engine")
6. Select **"Read"** permission
7. Click **"Generate"**
8. Copy the token (starts with `hf_...`)

### 2. Configure Environment Variable
1. Copy `.env.example` to `.env`:
   ```bash
   cd server
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```env
   HUGGINGFACE_API_KEY=hf_your_actual_token_here
   ```

### 3. Restart the Server
```bash
npm run dev
```

You should see in the console:
```
✅ Phi-2 service initialized with Hugging Face API
```

## How It Works

### Request Flow
```
User Message
    ↓
Sentiment Analysis (local)
    ↓
Trigger Matching (finds relevant memories)
    ↓
Phi-2 Generation (with context)
    ↓
Response to User
```

### Prompt Structure
```
System: You are a supportive AI assistant. The user is feeling down.

Relevant memories:
- "Dad always said: 'This too shall pass'"
- "Remember that time you overcame anxiety"

User: I'm feeling really depressed today
Assistant: [Phi-2 generates response here]
```

### Example Responses

**Without Phi-2** (fallback):
```
User: I'm feeling really depressed
Bot: I sense you're going through a tough time. Here's something that might help:
     [Shows pre-stored memories]
```

**With Phi-2**:
```
User: I'm feeling really depressed
Bot: I can see you're going through a difficult moment. Your dad's wisdom comes to mind - 
     "This too shall pass." Just like when you overcame anxiety before, you have the 
     strength within you. Would you like to talk about what's troubling you? 💙
```

## Configuration Options

### Model Parameters (in `phi2.service.ts`)
```typescript
{
  max_new_tokens: 200,     // Maximum response length
  temperature: 0.7,        // Creativity (0.0-1.0)
  top_p: 0.9,             // Nucleus sampling
  repetition_penalty: 1.2  // Avoid repetition
}
```

### Customization
You can modify the prompt template in `buildPrompt()` method:
```typescript
// server/src/services/phi2.service.ts
private buildPrompt(userMessage: string, context: any): string {
  // Add your custom system instructions here
}
```

## Pricing & Limits

### Hugging Face Inference API
- **Free Tier**: ~1,000 requests/month
- **Rate Limit**: ~30 requests/minute
- **Paid Plans**: $9/month for 10,000 requests

[View Pricing](https://huggingface.co/pricing)

## Alternative: Self-Hosted Phi-2

If you want to run Phi-2 locally (no API needed):

### Option 1: Hugging Face Transformers (Python)
```python
pip install transformers torch
```

### Option 2: Ollama (Easiest)
```bash
# Install Ollama
curl https://ollama.ai/install.sh | sh

# Run Phi-2
ollama run phi

# Update service to use local endpoint
```

### Option 3: llama.cpp
```bash
# Compile llama.cpp
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp && make

# Download Phi-2 GGUF model
# Run inference server
./server -m phi-2.gguf --port 8080
```

Then update `phi2.service.ts` to point to `http://localhost:8080`.

## Fine-Tuning Phi-2 (Advanced)

### 1. Prepare Training Data
Create a JSONL file with user conversations:
```json
{"prompt": "I'm feeling sad", "completion": "I hear you. Remember: 'Every storm runs out of rain.'"}
{"prompt": "I need motivation", "completion": "You've got this! Think about all you've overcome."}
```

### 2. Fine-Tune on Hugging Face
```python
from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer

model = AutoModelForCausalLM.from_pretrained("microsoft/phi-2")
tokenizer = AutoTokenizer.from_pretrained("microsoft/phi-2")

# Add your training code here
# Upload to Hugging Face Hub
```

### 3. Update Service
```typescript
// Change model name in phi2.service.ts
private model: string = 'your-username/phi-2-finetuned';
```

## Troubleshooting

### API Key Not Working
```
Error: Invalid authentication token
```
**Solution**: Regenerate token with "Read" permission

### Rate Limit Exceeded
```
Error: Rate limit exceeded
```
**Solution**: Wait 1 minute or upgrade to paid plan

### Model Loading Timeout
```
Error: Model loading timeout
```
**Solution**: Try again (model is loading for first time)

### Fallback Responses Only
Check server logs:
```
⚠️  HUGGINGFACE_API_KEY not found. Using fallback responses.
```
**Solution**: Add API key to `.env`

## Monitoring

### Check Phi-2 Status
```typescript
// In your code
const isAvailable = phi2Service.isAvailable();
console.log('Phi-2 Available:', isAvailable);
```

### View API Usage
1. Go to [Hugging Face Dashboard](https://huggingface.co/settings/tokens)
2. Click on your token
3. View usage statistics

## Performance

### Response Times
- **With API**: 2-5 seconds (depends on HF infrastructure)
- **Fallback**: < 100ms (instant)

### Quality Comparison
| Metric | Phi-2 | Fallback |
|--------|-------|----------|
| Personalization | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Context Understanding | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Natural Language | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Response Speed | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Consistency | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## Future Enhancements
- [ ] Add response caching
- [ ] Implement conversation history context
- [ ] Support multiple LLM providers (OpenAI, Anthropic)
- [ ] Add response quality scoring
- [ ] Implement A/B testing between models
- [ ] Fine-tune on user's personal data (with permission)

## Resources
- [Phi-2 Model Card](https://huggingface.co/microsoft/phi-2)
- [Hugging Face Inference API Docs](https://huggingface.co/docs/api-inference/index)
- [Fine-tuning Guide](https://huggingface.co/docs/transformers/training)

---

**Note**: The system gracefully falls back to rule-based responses if Phi-2 is unavailable, ensuring 100% uptime.
