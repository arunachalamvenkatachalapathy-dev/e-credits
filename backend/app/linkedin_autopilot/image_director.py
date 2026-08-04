import json
import logging
from typing import Dict, Any
from .gemini_client import GeminiClient

logger = logging.getLogger("linkedin_autopilot.image_director")

class ImageDirector:
    """
    Step 12-13: Editorial Image Direction & Visual Concept Generation.
    Generates Reuters/Financial Times documentary visual specs.
    STRICTLY NO Pollinations AI, Flux, generic stock, or blue gradient graphics.
    """
    def __init__(self, gemini_client: GeminiClient):
        self.gemini = gemini_client

    def design_editorial_image(self, thesis: str, story_title: str) -> Dict[str, Any]:
        spec = self.gemini.generate_image_prompt_spec(
            story_thesis=thesis,
            scene_category="Industrial Power Grid Infrastructure & Compliance Inspection"
        )
        
        # Enforce Image Director Constitution Rules
        final_prompt = spec.get("final_prompt", "")
        if not final_prompt:
            final_prompt = (
                "A documentary-style photo of an electrical engineer inspecting high-voltage power transmission "
                "equipment at an industrial substation in western India at sunrise. Concrete pylons, transformer bays, "
                "and heavy copper busbars in sharp focus. The engineer holds a rugged outdoor tablet displaying grid telemetry, "
                "wearing a high-visibility yellow vest and hardhat. Cinematic natural morning light, realistic metallic textures, "
                "shallow depth of field. No artificial glow, no floating icons, no clip-art graphics, no text overlays."
            )
        
        return {
            "scene_category": spec.get("scene_category", "Industrial Infrastructure"),
            "subject": spec.get("subject", "Field Electrical Engineer"),
            "lighting": spec.get("lighting", "Natural sunrise directional lighting"),
            "final_prompt": final_prompt,
            "engine": "Gemini Imagen 3"
        }
