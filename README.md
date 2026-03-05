# AI Brand Visibility Scanner API

A FastAPI service that uses local AI (Ollama) to evaluate how visible a brand is across AI-generated responses to user queries.

## Quick Start

```bash
# 1. Install Ollama and pull model
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3.1:8b

# 2. Setup environment
cp .env.example .env
# Edit .env with your settings

# 3. Install dependencies
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt

# 4. Start the API
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Project Structure

```
├── backend/           # API and business logic
│   ├── main.py       # FastAPI application
│   └── services/     # Business logic
├── common/           # Shared components
│   ├── models/       # Pydantic schemas
│   └── utils/        # Shared utilities
├── docs/             # Documentation
└── frontend/         # Frontend application
```

## API Documentation

- **Interactive Docs**: http://127.0.0.1:8000/docs
- **Detailed Documentation**: See `docs/` folder

## Features

- 🆓 **Free AI** - Uses local Ollama (no API costs)
- 📊 **Brand Analysis** - Mentions, sentiment, ranking, context
- 🎯 **Visibility Score** - Aggregate 0-100 score
- 📝 **Progress Logging** - Real-time processing updates
- 🔒 **Private** - Data never leaves your machine

For detailed information, see the [documentation](docs/README.md).
