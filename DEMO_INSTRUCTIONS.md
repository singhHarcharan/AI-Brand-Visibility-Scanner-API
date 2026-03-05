# 🚀 Interview Demo Instructions

## Quick Start for Demo

### 1. Start Backend Service
```bash
# Terminal 1 - Backend (run from project root)
cd /Users/hustler_harcharan/Documents/Projects/AI-Brand-Visibility-Scanner-API
pkill -f uvicorn
source .venv/bin/activate
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start Frontend Service  
```bash
# Terminal 2 - Frontend
cd /Users/hustler_harcharan/Documents/Projects/AI-Brand-Visibility-Scanner-API/frontend
npm run dev
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🎯 Demo Script

### Introduction (2 minutes)
"Today I'll demonstrate the AI Brand Visibility Scanner - a tool that analyzes how visible a brand is across AI-generated responses."

### Key Features to Highlight
1. **Free AI Integration** - Uses local Ollama (no API costs)
2. **Real-time Analysis** - Live progress logging
3. **Comprehensive Results** - Mentions, sentiment, ranking, context
4. **Visibility Score** - Aggregate 0-100 score
5. **Modern UI** - Clean, responsive interface

### Demo Steps

#### Step 1: Show the Interface (1 minute)
- Navigate to http://localhost:3000
- Show the clean form interface
- Explain the input fields (brand name, queries)

#### Step 2: Run a Live Scan (3-4 minutes)
**Input:**
- Brand: "Notion"  
- Queries: 
  - "best productivity tools for teams"
  - "top note-taking apps 2025"
  - "alternatives to Microsoft Word"

**What to Point Out:**
- Real-time progress indicators
- Loading states and animations
- Backend logs showing processing

#### Step 3: Review Results (2-3 minutes)
**Highlight:**
- Overall visibility score (0-100)
- Individual query results
- Sentiment analysis (positive/neutral/negative)
- Ranking information
- Context explanations

#### Step 4: Show Technical Features (2 minutes)
- **Backend Logs**: Show the detailed logging
- **API Documentation**: Visit http://localhost:8000/docs
- **Architecture**: Explain the folder structure
- **Free AI**: Mention Ollama integration

---

## 🔧 Technical Talking Points

### Architecture
```
├── backend/           # FastAPI service
│   ├── main.py       # API endpoints
│   └── services/     # Business logic
├── common/           # Shared components
│   ├── models/       # Pydantic schemas  
│   └── utils/        # Utilities
├── frontend/         # Next.js app
└── docs/            # Documentation
```

### Key Technologies
- **Backend**: FastAPI, Python, Ollama
- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **AI**: Local Llama 3.1 8B model
- **Infrastructure**: CORS, logging, error handling

### Competitive Advantages
1. **Zero Cost** - No API charges
2. **Private** - Data stays local
3. **Fast** - Local inference
4. **Reliable** - No rate limits
5. **Scalable** - Modular architecture

---

## 🚨 Demo Checklist

### Before Demo
- [ ] Ollama is running (`ollama list`)
- [ ] Backend starts without errors
- [ ] Frontend starts without errors  
- [ ] Test API call works
- [ ] Clear browser cache

### During Demo
- [ ] Speak slowly and clearly
- [ ] Explain each step
- [ ] Show both UI and logs
- [ ] Highlight key features
- [ ] Allow for questions

### Backup Plans
- **If Ollama fails**: Restart with `ollama serve`
- **If backend fails**: Check Python path and imports
- **If frontend fails**: Clear cache, restart dev server
- **If demo is slow**: Use fewer queries (1-2 instead of 3)

---

## 🎯 Sample Demo Data

### Good Demo Brands
- **Notion** - Productivity tools (high visibility)
- **Slack** - Communication tools (well known)
- **Figma** - Design tools (specific niche)

### Sample Queries
- "best [category] tools"
- "top [category] 2025"  
- "alternatives to [competitor]"
- "[category] for [use case]"

---

## 💡 Pro Tips

1. **Have multiple brands ready** - Show variety
2. **Prepare 2-3 query sets** - Different scenarios
3. **Show the logs** - Demonstrates transparency
4. **Explain the score** - How it's calculated
5. **Mention the tech stack** - Shows technical depth

Good luck with your interview! 🚀
