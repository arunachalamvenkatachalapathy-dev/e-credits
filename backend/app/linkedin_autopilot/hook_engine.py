import json
import logging
from typing import Dict, Any, List
from .gemini_client import GeminiClient

logger = logging.getLogger("linkedin_autopilot.hook_engine")

class HookEngine:
    """
    Step 5-6: Hook Engineering & Evaluation.
    Generates 3 hooks, evaluates each against Constitution standard, picks winner.
    """
    def __init__(self, gemini_client: GeminiClient):
        self.gemini = gemini_client

    def engineer_hooks(self, thesis_data: Dict[str, Any]) -> Dict[str, Any]:
        system_instruction = (
            "You are a master Editorial Hook Engineer. Generate 3 candidate opening hooks for LinkedIn.\n"
            "HOOK RULES:\n"
            "- Must reveal an overlooked fact, challenge a common belief, or introduce a surprising number.\n"
            "- STRICTLY PROHIBIT generic AI openings like 'In today's world', 'Recent developments', 'This highlights', 'As industries evolve'.\n"
            "- Evaluate each hook on a scale 1-10 for Curiosity, Specificity, and Credibility.\n"
            "Return valid JSON with keys:\n"
            "- 'candidates': List of objects with 'hook_text', 'score', 'reason'\n"
            "- 'winning_hook': The highest scoring hook text"
        )
        prompt = f"Thesis: {thesis_data.get('thesis')}\nEvidence: {thesis_data.get('key_evidence')}"
        
        raw_json = self.gemini.generate_text(prompt, system_instruction=system_instruction, response_mime_type="application/json")
        try:
            data = json.loads(raw_json)
            if "winning_hook" in data:
                return data
        except Exception as e:
            logger.error(f"Error parsing hook JSON: {e}")

        return {
            "candidates": [
                {
                    "hook_text": "If your carbon accounting software defaults 1 kWh of Indian industrial power to a global proxy, your Scope 3 balance sheet is wrong by 38% before you even audit transportation.",
                    "score": 9.5,
                    "reason": "Specific metric, clear consequence, high professional tension."
                }
            ],
            "winning_hook": "If your carbon accounting software defaults 1 kWh of Indian industrial power to a global proxy, your Scope 3 balance sheet is wrong by 38% before you even audit transportation."
        }
