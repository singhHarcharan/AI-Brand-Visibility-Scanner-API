from __future__ import annotations

SENTIMENT_WEIGHTS: dict[str, float] = {
    "positive": 1.0,
    "neutral": 0.6,
    "negative": 0.2,
    "not_applicable": 0.0,
}

RANK_DECAY_BASE = 0.85  # score multiplier per rank position (rank 1 = full, rank 2 = 0.85x, …)


def compute_visibility_score(results: list) -> float:
    """
    Compute an aggregate brand visibility score (0–100).

    Scoring logic:
    - Each query contributes equally to the final score.
    - A mentioned brand earns a base score weighted by sentiment.
    - If a rank is provided, apply exponential decay so higher ranks score more.
    - The raw per-query scores are averaged and scaled to 0–100.

    Args:
        results: List of QueryResult objects.

    Returns:
        A float between 0.0 and 100.0.
    """
    if not results:
        return 0.0

    per_query_scores: list[float] = []

    for result in results:
        if not result.mentioned:
            per_query_scores.append(0.0)
            continue

        sentiment_weight = SENTIMENT_WEIGHTS.get(result.sentiment, 0.6)
        rank_multiplier = (
            RANK_DECAY_BASE ** (result.rank - 1) if result.rank is not None else 1.0
        )
        score = sentiment_weight * rank_multiplier
        per_query_scores.append(score)

    raw_average = sum(per_query_scores) / len(per_query_scores)
    return round(raw_average * 100, 2)
