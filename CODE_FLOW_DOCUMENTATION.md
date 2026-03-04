# AI Brand Visibility Scanner - Code Flow Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Component Breakdown](#component-breakdown)
4. [Request Processing Flow](#request-processing-flow)
5. [Data Models](#data-models)
6. [AI Integration](#ai-integration)
7. [Logging System](#logging-system)
8. [Configuration](#configuration)

---

## Project Overview

The AI Brand Visibility Scanner is a FastAPI-based service that analyzes how visible a brand is across AI-generated responses to user queries. It uses local AI inference (via Ollama) to evaluate brand mentions, sentiment, ranking, and context.

**Key Features:**
- Brand visibility analysis across multiple queries
- Sentiment analysis (positive/neutral/negative)
- Ranking detection (position in AI responses)
- Context extraction
- Aggregate visibility score (0-100)
- Real-time progress logging
- Free local AI inference (no API costs)

---

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   FastAPI       │    │  BrandAnalyzer   │    │  OllamaClient   │
│   (main.py)     │───▶│  (analyzer.py)   │───▶│ (ollama_client) │
│                 │    │                  │    │                 │
│ - HTTP Routes   │    │ - Query Loop     │    │ - AI Calls      │
│ - CORS          │    │ - Progress Log   │    │ - Error Handling│
│ - Logging       │    │ - JSON Parsing   │    │ - Health Check  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   ScanRequest   │    │   QueryResult    │    │  Ollama Server  │
│   (schemas.py)  │    │   (schemas.py)   │    │  (Local AI)     │
│                 │    │                  │    │                 │
│ - Validation    │    │ - Results Store  │    │ - Llama 3.1 8B  │
│ - Type Safety   │    │ - Response Model │    │ - Free Inference│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## Component Breakdown

### 1. `main.py` - FastAPI Application
**Purpose**: Entry point, HTTP server, request routing

**Key Functions:**
- `root()` - Health check endpoint
- `health_check()` - Service status
- `scan_brand()` - Main scan endpoint

**Responsibilities:**
- Initialize FastAPI app with CORS middleware
- Handle HTTP requests/responses
- Request validation via Pydantic models
- High-level logging (request start/end)
- Error handling and timing

**Logging Added:**
```
🚀 Starting scan for brand 'Notion' with 3 queries
✅ Scan completed in 15.23s - Visibility score: 71.33
❌ Scan failed after 2.45s: Connection error
```

### 2. `analyzer.py` - Core Business Logic
**Purpose**: Orchestrates the entire scanning process

**Key Functions:**
- `scan()` - Main analysis loop

**Responsibilities:**
- Iterate through each query
- Generate prompts for AI
- Parse AI responses
- Create QueryResult objects
- Calculate visibility scores
- Detailed progress logging

**Processing Flow:**
1. Log start of processing
2. Loop through queries (1 to N)
3. For each query:
   - Log query analysis start
   - Generate user prompt
   - Call AI model
   - Parse JSON response
   - Create QueryResult
   - Log completion status
4. Calculate final visibility score
5. Return ScanResponse

**Logging Added:**
```
📊 Processing 3 queries for brand 'Notion'
🔍 [1/3] Analyzing query: 'best productivity tools for teams'
🤖 Calling AI model for query 1...
📝 Received response for query 1 (length: 245 chars)
✅ Mentioned - Query 1 completed in 4.12s
🧮 Computing visibility score from 3 results...
```

### 3. `ollama_client.py` - AI Integration Layer
**Purpose**: Handles communication with local Ollama server

**Key Functions:**
- `complete()` - Send prompts to AI
- `health_check()` - Verify Ollama availability

**Responsibilities:**
- HTTP requests to Ollama API
- Request/response formatting
- Error handling (timeouts, connection issues)
- JSON parsing
- Debug logging

**API Endpoint Used:**
```
POST http://localhost:11434/api/generate
```

**Request Payload:**
```json
{
  "model": "llama3.1:8b",
  "prompt": "system_prompt + user_prompt",
  "stream": false,
  "options": {
    "temperature": 0.7,
    "top_p": 0.9,
    "max_tokens": 1024
  }
}
```

**Logging Added:**
```
🔄 Sending request to Ollama model 'llama3.1:8b'
📤 Prompt length: 1250 chars
📥 Received response in 3.45s (length: 180 chars)
⏰ Ollama request timed out after 30.00s
🔌 Failed to connect to Ollama at http://localhost:11434
```

### 4. `schemas.py` - Data Models
**Purpose**: Define data structures and validation

**Models:**
- `ScanRequest` - Input validation
- `ScanResponse` - Output format
- `QueryResult` - Individual query results

**Key Features:**
- Type safety via Pydantic
- Automatic validation
- Serialization/deserialization
- OpenAPI documentation generation

### 5. `scoring.py` - Visibility Score Calculation
**Purpose**: Calculate aggregate visibility scores

**Algorithm:**
- Weight-based scoring system
- Sentiment multipliers (positive: 1.0x, neutral: 0.6x, negative: 0.2x)
- Rank decay (0.85x per position)
- Normalization to 0-100 scale

---

## Request Processing Flow

### Step-by-Step Request Lifecycle

```
1. HTTP Request Received
   └── POST /scan with JSON payload
   └── FastAPI validates against ScanRequest model

2. Request Logging (main.py)
   └── 🚀 Starting scan for brand 'X' with N queries
   └── Start timer

3. BrandAnalyzer.scan() (analyzer.py)
   └── 📊 Processing N queries for brand 'X'
   └── Initialize results list

4. Query Loop (for each query)
   └── 🔍 [i/N] Analyzing query: 'query text'
   └── Start query timer
   
   4a. Prompt Generation
       └── Combine SYSTEM_PROMPT + user_prompt
       └── Format: "Brand to track: 'X'\nQuery: 'Y'\n\n..."
   
   4b. AI Call (ollama_client.py)
       └── 🤖 Calling AI model for query i...
       └── POST to http://localhost:11434/api/generate
       └── 📝 Received response for query i
       └── Parse JSON response
   
   4c. Result Processing
       └── Extract mentioned, sentiment, rank, context
       └── Create QueryResult object
       └── ✅/⭕ Mentioned/Not mentioned - Query i completed
   
5. Score Calculation (scoring.py)
   └── 🧮 Computing visibility score from N results...
   └── Apply sentiment weights and rank decay
   └── Normalize to 0-100 scale

6. Response Assembly
   └── Create ScanResponse with all results
   └── Include aggregate metrics

7. Final Logging (main.py)
   └── ✅ Scan completed in X.XXs - Visibility score: YY.YY
   └── Return JSON response

8. HTTP Response Sent
   └── 200 OK with ScanResponse JSON
```

### Error Handling Flow

```
1. Validation Errors
   └── FastAPI returns 400 Bad Request
   └── Automatic error response

2. Ollama Connection Errors
   └── ollama_client.py catches exceptions
   └── Logs 🔌 Failed to connect to Ollama
   └── Raises custom exception

3. AI Model Errors
   └── Timeout → ⏰ Ollama request timed out
   └── Invalid JSON → 🔧 Invalid JSON response
   └── HTTP errors → ❌ Ollama API error

4. Processing Errors
   └── analyzer.py catches exceptions
   └── Logs error details
   └── main.py logs ❌ Scan failed after X.XXs
   └── Returns 500 Internal Server Error
```

---

## Data Models

### ScanRequest (Input)
```python
{
    "brand_name": "string",     # Brand to analyze
    "queries": ["string"]       # List of queries to test
}
```

### QueryResult (Per-query output)
```python
{
    "query": "string",          # Original query
    "mentioned": boolean,       # Was brand mentioned?
    "sentiment": "string",      # positive/neutral/negative/not_applicable
    "rank": integer|null,       # Position in response (1-based)
    "context": "string"         # Explanation of brand appearance
}
```

### ScanResponse (Final output)
```python
{
    "brand_name": "string",     # Analyzed brand
    "total_queries": integer,   # Number of queries processed
    "visibility_score": float,  # 0-100 aggregate score
    "results": [QueryResult]    # All individual results
}
```

---

## AI Integration

### System Prompt
```python
SYSTEM_PROMPT = """You are a brand visibility analyst. When given a query and a brand name, 
you must determine whether the brand is mentioned in a typical AI response to that query.

Respond ONLY with a valid JSON object using this exact schema:
{
  "mentioned": true or false,
  "sentiment": "positive" | "neutral" | "negative" | "not_applicable",
  "rank": null or integer (1-based position if brand is listed among options, else null),
  "context": "brief explanation of how the brand appears in the response, or why it does not"
}"""
```

### User Prompt Template
```python
user_prompt = (
    f'Brand to track: "{request.brand_name}"\n'
    f'Query: "{query}"\n\n'
    "Would the brand above typically be mentioned when an AI answers that query? "
    "Respond with the JSON schema described in the system prompt."
)
```

### AI Model Configuration
- **Model**: Llama 3.1 8B (via Ollama)
- **Temperature**: 0.7 (balanced creativity)
- **Top P**: 0.9 (focused sampling)
- **Max Tokens**: 1024 (sufficient for JSON response)
- **Timeout**: 30 seconds

### Response Processing
1. **Direct JSON**: Try parsing response as JSON directly
2. **Markdown Fallback**: Extract JSON from markdown code blocks if needed
3. **Error Handling**: Log warnings and use default values if parsing fails

---

## Logging System

### Log Levels
- **INFO**: High-level progress (request start/end, query completion)
- **DEBUG**: Detailed API calls, prompt lengths, response sizes
- **WARNING**: Non-critical issues (JSON parsing fallbacks)
- **ERROR**: Critical failures (timeouts, connection errors)

### Log Format
```
HH:MM:SS - LEVEL - MESSAGE
```

### Key Log Messages
- **Request Level**: 🚀 Starting scan, ✅ Scan completed, ❌ Scan failed
- **Query Level**: 🔍 Analyzing query, 🤖 Calling AI model, 📝 Received response
- **Result Level**: ✅ Mentioned, ⭕ Not mentioned
- **System Level**: 🧮 Computing score, 📊 Processing queries

### Progress Indicators
- `[i/N]` - Query progress (e.g., [2/5])
- Timing information for performance monitoring
- Emoji indicators for quick visual scanning

---

## Configuration

### Environment Variables (.env)
```bash
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
OLLAMA_TIMEOUT=30

# Anthropic (backup, not used currently)
ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-3-haiku-20240307
CLAUDE_MAX_TOKENS=1024
```

### Dependencies
```bash
# Core Framework
fastapi>=0.111.0
uvicorn[standard]>=0.29.0

# AI Integration
anthropic>=0.25.0          # Original Claude SDK (not used)
requests>=2.32.5           # For Ollama API calls

# Data & Configuration
pydantic>=2.7.0
python-dotenv>=1.0.1
```

### Server Configuration
- **Host**: 0.0.0.0 (all interfaces)
- **Port**: 8000
- **Reload**: Enabled (development)
- **CORS**: All origins allowed (development)

---

## Claude SDK Question

**Are we using Claude SDK in this project?**

**Answer**: **NO**, we are NOT using the Claude SDK anymore.

### History:
1. **Originally**: The project was built using Anthropic's Claude SDK (`anthropic` package)
2. **Problem**: Required API credits, got "credit balance too low" errors
3. **Solution**: Migrated to **Ollama** with free local Llama 3.1 8B model

### Current State:
- **Claude SDK**: Still installed as dependency but NOT used
- **Ollama Client**: Custom implementation in `ollama_client.py`
- **AI Model**: Llama 3.1 8B running locally via Ollama
- **Cost**: Completely free

### Files Changed:
- ✅ **Added**: `ollama_client.py` - Custom Ollama integration
- ✅ **Modified**: `analyzer.py` - Uses OllamaClient instead of ClaudeClient
- ✅ **Modified**: `.env` - Ollama configuration added
- ❌ **Unused**: `claude_client.py` - Still present but not referenced

### Benefits of Migration:
- 🆓 **Zero Cost**: No API charges
- 🚀 **Fast**: Local inference, no network latency
- 🔒 **Private**: Data never leaves your machine
- 🎯 **Reliable**: No rate limits or credit issues

The Claude SDK code remains in the project for potential fallback use, but the active implementation uses 100% free local AI via Ollama.
