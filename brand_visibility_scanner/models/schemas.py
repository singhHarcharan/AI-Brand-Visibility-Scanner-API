from typing import Literal, Optional
from pydantic import BaseModel, Field


class ScanRequest(BaseModel):
    brand_name: str = Field(..., description="The brand name to track.", examples=["OpenAI"])
    queries: list[str] = Field(
        ...,
        min_length=1,
        description="List of search queries to evaluate brand visibility.",
        examples=[["best AI tools", "top chatbots 2025"]],
    )


class QueryResult(BaseModel):
    query: str = Field(..., description="The evaluated query.")
    mentioned: bool = Field(..., description="Whether the brand was mentioned.")
    sentiment: Literal["positive", "neutral", "negative", "not_applicable"] = Field(
        ..., description="Sentiment associated with the brand mention."
    )
    rank: Optional[int] = Field(
        None, description="1-based rank of the brand if listed among options."
    )
    context: str = Field(
        ..., description="Brief explanation of the brand's presence in the response."
    )


class ScanResponse(BaseModel):
    brand_name: str = Field(..., description="The scanned brand name.")
    total_queries: int = Field(..., description="Total number of queries evaluated.")
    visibility_score: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Aggregate visibility score from 0 to 100.",
    )
    results: list[QueryResult] = Field(..., description="Per-query analysis results.")
