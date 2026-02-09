"""AI Models module."""

from app.prompts.templates import (
    SYSTEM_PROMPT,
    SYSTEM_PROMPT_SHORT,
    build_itinerary_prompt,
    get_rephrase_day_prompt,
    get_cost_optimization_prompt,
)

__all__ = [
    "SYSTEM_PROMPT",
    "SYSTEM_PROMPT_SHORT",
    "build_itinerary_prompt",
    "get_rephrase_day_prompt",
    "get_cost_optimization_prompt",
]
