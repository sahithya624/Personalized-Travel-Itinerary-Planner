"""AI Model Integration Services."""

import logging
import json
from typing import Optional
from abc import ABC, abstractmethod
from app.config import get_settings
from app.utils.errors import AIGenerationError

logger = logging.getLogger(__name__)


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""

    @abstractmethod
    async def generate(self, system_prompt: str, user_prompt: str) -> str:
        """Generate text using the LLM."""
        pass


class GroqProvider(LLMProvider):
    """Groq API provider."""

    def __init__(self, api_key: str):
        """Initialize Groq provider."""
        try:
            from groq import AsyncGroq
            self.client = AsyncGroq(api_key=api_key)
            logger.info("Groq AsyncClient initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Groq: {str(e)}")
            raise AIGenerationError(f"Groq initialization failed: {str(e)}")

    async def generate(self, system_prompt: str, user_prompt: str) -> str:
        """Generate text using Groq API."""
        try:
            logger.info(f"Calling Groq API with model llama-3.3-70b-versatile")
            response = await self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.7,
                max_tokens=2048,
                top_p=1,
            )
            content = response.choices[0].message.content
            logger.info("Successfully received response from Groq")
            return content
        except Exception as e:
            logger.exception(f"Groq generation error: {str(e)}")
            raise AIGenerationError(f"Failed to generate itinerary: {str(e)}")


class HuggingFaceProvider(LLMProvider):
    """HuggingFace Inference API provider."""

    def __init__(self, api_key: str):
        """Initialize HuggingFace provider."""
        self.api_key = api_key
        self.model_id = "mistralai/Mistral-7B-Instruct-v0.1"

    async def generate(self, system_prompt: str, user_prompt: str) -> str:
        """Generate text using HuggingFace API."""
        try:
            from huggingface_hub import InferenceClient

            client = InferenceClient(api_key=self.api_key)
            prompt = f"{system_prompt}\n\n{user_prompt}"

            response = client.text_generation(
                prompt,
                model=self.model_id,
                max_new_tokens=2048,
                temperature=0.7,
            )
            return response
        except Exception as e:
            logger.error(f"HuggingFace generation error: {str(e)}")
            raise AIGenerationError(f"Failed to generate itinerary: {str(e)}")


class OllamaProvider(LLMProvider):
    """Ollama local model provider."""

    def __init__(self, base_url: str):
        """Initialize Ollama provider."""
        self.base_url = base_url
        self.model = "mistral"  # Or your chosen model

    async def generate(self, system_prompt: str, user_prompt: str) -> str:
        """Generate text using Ollama."""
        try:
            import httpx

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": f"{system_prompt}\n\n{user_prompt}",
                        "stream": False,
                        "temperature": 0.7,
                    },
                    timeout=60.0,
                )
                response.raise_for_status()
                data = response.json()
                return data.get("response", "")
        except Exception as e:
            logger.error(f"Ollama generation error: {str(e)}")
            raise AIGenerationError(f"Failed to generate itinerary: {str(e)}")


class AIOrchestrator:
    """Main AI orchestration service."""

    def __init__(self):
        """Initialize AI orchestrator with configured provider."""
        settings = get_settings()
        self.provider = self._init_provider(settings)

    def _init_provider(self, settings) -> LLMProvider:
        """Initialize the configured LLM provider."""
        provider = settings.ai_provider.lower()

        if provider == "groq":
            if not settings.groq_api_key:
                raise AIGenerationError("Groq API key not configured")
            return GroqProvider(settings.groq_api_key)

        elif provider == "huggingface":
            if not settings.huggingface_api_key:
                raise AIGenerationError("HuggingFace API key not configured")
            return HuggingFaceProvider(settings.huggingface_api_key)

        elif provider == "ollama":
            return OllamaProvider(settings.ollama_base_url)

        else:
            raise AIGenerationError(f"Unknown AI provider: {provider}")

    async def generate_itinerary(
        self,
        system_prompt: str,
        user_prompt: str,
    ) -> str:
        """Generate itinerary using the configured provider."""
        logger.info(f"Generating itinerary with {type(self.provider).__name__}")
        return await self.provider.generate(system_prompt, user_prompt)

    def parse_itinerary_response(self, response: str) -> dict:
        """Parse LLM response into structured itinerary format."""
        try:
            # Try to parse as JSON first
            return json.loads(response)
        except json.JSONDecodeError:
            # Otherwise, extract structured data from text
            return self._parse_text_itinerary(response)

    def _parse_text_itinerary(self, text: str) -> dict:
        """Parse text-based itinerary into structured format."""
        days = []
        day_blocks = text.split("DAY")

        for block in day_blocks[1:]:  # Skip first split (before first DAY)
            lines = block.strip().split("\n")
            if not lines:
                continue

            day_data = {
                "day": len(days) + 1,
                "morning": "",
                "afternoon": "",
                "evening": "",
                "food_recommendations": "",
                "accommodation_info": "",
                "transport_tips": "",
                "estimated_cost_inr": 0.0,
            }

            current_field = None
            for line in lines:
                line = line.strip()
                if not line:
                    continue

                if "Morning:" in line:
                    current_field = "morning"
                    day_data["morning"] = line.replace("Morning:", "").strip()
                elif "Afternoon:" in line:
                    current_field = "afternoon"
                    day_data["afternoon"] = line.replace("Afternoon:", "").strip()
                elif "Evening:" in line:
                    current_field = "evening"
                    day_data["evening"] = line.replace("Evening:", "").strip()
                elif "Food" in line or "Recommendations" in line:
                    current_field = "food_recommendations"
                elif "Accommodation" in line:
                    current_field = "accommodation_info"
                    day_data["accommodation_info"] = line.replace("Accommodation Info:", "").strip()
                elif "Transport" in line or "Tips" in line:
                    current_field = "transport_tips"
                    day_data["transport_tips"] = line.replace("Transport Tips:", "").strip()
                elif "Estimated" in line or "Cost" in line:
                    try:
                        # Extract cost
                        import re
                        # Look for ₹ or Rs or ₹
                        cost = re.search(r'[₹₹\$]\s?(\d+(?:\.\d{2})?)', line)
                        if cost:
                            day_data["estimated_cost_inr"] = float(cost.group(1))
                    except:
                        pass
                elif current_field and line:
                    day_data[current_field] += " " + line

            # Clean up fields
            for key in ["morning", "afternoon", "evening", "food_recommendations", "accommodation_info", "transport_tips"]:
                day_data[key] = day_data[key].strip()

            if any([day_data["morning"], day_data["afternoon"], day_data["evening"]]):
                days.append(day_data)

        return {"days": days}


# Global AI orchestrator instance
_ai_orchestrator: Optional[AIOrchestrator] = None


def get_ai_orchestrator() -> AIOrchestrator:
    """Get or initialize AI orchestrator."""
    global _ai_orchestrator
    if _ai_orchestrator is None:
        _ai_orchestrator = AIOrchestrator()
    return _ai_orchestrator
