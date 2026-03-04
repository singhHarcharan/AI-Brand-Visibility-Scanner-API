import json
import logging
import time
from models.schemas import ScanRequest, ScanResponse, QueryResult
from services.ollama_client import OllamaClient
from utils.scoring import compute_visibility_score

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a brand visibility analyst. When given a query and a brand name, 
you must determine whether the brand is mentioned in a typical AI response to that query.

Respond ONLY with a valid JSON object using this exact schema:
{
  "mentioned": true or false,
  "sentiment": "positive" | "neutral" | "negative" | "not_applicable",
  "rank": null or integer (1-based position if brand is listed among options, else null),
  "context": "brief explanation of how the brand appears in the response, or why it does not"
}"""


class BrandAnalyzer:
    """Orchestrates brand visibility scans across multiple queries."""

    def __init__(self):
        self.ollama = OllamaClient()

    async def scan(self, request: ScanRequest) -> ScanResponse:
        results: list[QueryResult] = []
        logger.info(f"📊 Processing {len(request.queries)} queries for brand '{request.brand_name}'")

        for i, query in enumerate(request.queries, 1):
            logger.info(f"🔍 [{i}/{len(request.queries)}] Analyzing query: '{query}'")
            query_start_time = time.time()
            
            user_prompt = (
                f'Brand to track: "{request.brand_name}"\n'
                f'Query: "{query}"\n\n'
                "Would the brand above typically be mentioned when an AI answers that query? "
                "Respond with the JSON schema described in the system prompt."
            )

            logger.info(f"🤖 Calling AI model for query {i}...")
            raw = self.ollama.complete(SYSTEM_PROMPT, user_prompt)
            logger.info(f"📝 Received response for query {i} (length: {len(raw)} chars)")

            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                # Fallback if Ollama wraps JSON in markdown fences
                import re
                match = re.search(r"\{.*\}", raw, re.DOTALL)
                data = json.loads(match.group()) if match else {}
                logger.warning(f"⚠️  Had to extract JSON from markdown for query {i}")

            query_result = QueryResult(
                query=query,
                mentioned=data.get("mentioned", False),
                sentiment=data.get("sentiment", "not_applicable"),
                rank=data.get("rank"),
                context=data.get("context", ""),
            )
            results.append(query_result)
            
            query_time = time.time() - query_start_time
            status = "✅ Mentioned" if query_result.mentioned else "⭕ Not mentioned"
            logger.info(f"{status} - Query {i} completed in {query_time:.2f}s")

        logger.info(f"🧮 Computing visibility score from {len(results)} results...")
        visibility_score = compute_visibility_score(results)

        return ScanResponse(
            brand_name=request.brand_name,
            total_queries=len(request.queries),
            visibility_score=visibility_score,
            results=results,
        )
