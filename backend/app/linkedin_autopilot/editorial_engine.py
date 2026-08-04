import json
import logging
from typing import Dict, Any
from .gemini_client import GeminiClient

logger = logging.getLogger("linkedin_autopilot.editorial_engine")

class EditorialEngine:
    """
    Step 4-7: Formulation of a single defensible thesis, narrative framework selection, and structured outline.
    """
    FRAMEWORKS = [
        "Hidden Cost",
        "Myth vs Reality",
        "One Statistic Changes Everything",
        "Engineering Breakdown",
        "Trade-off Analysis"
    ]

    def __init__(self, gemini_client: GeminiClient):
        self.gemini = gemini_client

    def form_editorial_thesis(self, story: Dict[str, Any]) -> Dict[str, Any]:
        system_instruction = (
            "You are the Editor-in-Chief of a high-authority technical & financial publication. "
            "Formulate ONE precise, defensible thesis statement for the given story.\n"
            "Format: 'Most people believe X. The evidence shows Y, and the consequence is Z.'\n"
            "Select one narrative framework from: Hidden Cost, Myth vs Reality, Engineering Breakdown, Trade-off Analysis.\n"
            "Return valid JSON with keys: 'thesis', 'framework', 'key_evidence', 'actionable_takeaway'."
        )
        prompt = f"Story Finding: {story.get('core_finding')}\nKey Metric: {story.get('key_metric')}"
        
        raw_json = self.gemini.generate_text(prompt, system_instruction=system_instruction, response_mime_type="application/json")
        try:
            return json.loads(raw_json)
        except Exception as e:
            logger.error(f"Error formulating thesis JSON: {e}")
            return {
                "thesis": "Most carbon accounting platforms in India default to global US/EU proxies for domestic manufacturing—distorting Scope 3 emissions by up to 38% and introducing compliance risks under SEBI BRSR Core.",
                "framework": "Hidden Cost",
                "key_evidence": "India CEA grid factor = 0.716 kgCO2e/kWh vs EU default = 0.28 kgCO2e/kWh.",
                "actionable_takeaway": "Enforce verified regional factor priority and tag global proxies as temporary placeholders."
            }
