# AI Brand Visibility Scanner API

A FastAPI service that uses Anthropic's Claude to evaluate how visible a brand is across AI-generated responses to user queries.

---

## Features

- Submit a brand name and a list of queries
- Claude analyses each query and determines whether the brand would be mentioned
- Returns per-query results (mentioned, sentiment, rank, context) and an aggregate **visibility score** (0–100)

---

## Project Structure

```
brand_visibility_scanner/
├── main.py                  # FastAPI app & route definitions
├── services/
│   ├── claude_client.py     # Anthropic Claude API wrapper
│   └── analyzer.py          # Core scan orchestration logic
├── models/
│   └── schemas.py           # Pydantic request/response schemas
└── utils/
    └── scoring.py           # Visibility score computation
```

---

## Setup

### 1. Create & activate a virtual environment
```bash
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure environment variables
Copy `.env` and fill in your Anthropic API key:
```bash
# .env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

---

## Running the API

```bash
cd brand_visibility_scanner
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.  
Interactive docs: `http://127.0.0.1:8000/docs`

---

## Example Request

```bash
curl -X POST http://127.0.0.1:8000/scan \
  -H "Content-Type: application/json" \
  -d '{
    "brand_name": "Notion",
    "queries": [
      "best productivity tools for teams",
      "top note-taking apps 2025",
      "alternatives to Microsoft Word"
    ]
  }'
```

### Example Response

```json
{
  "brand_name": "Notion",
  "total_queries": 3,
  "visibility_score": 71.33,
  "results": [
    {
      "query": "best productivity tools for teams",
      "mentioned": true,
      "sentiment": "positive",
      "rank": 2,
      "context": "Notion is frequently listed as a top team productivity tool."
    },
    ...
  ]
}
```

---

## Visibility Score

The score (0–100) is computed in `utils/scoring.py` using:

| Factor | Weight |
|---|---|
| Sentiment: positive | 1.0× |
| Sentiment: neutral | 0.6× |
| Sentiment: negative | 0.2× |
| Rank decay per position | 0.85× |

---

## License

MIT
