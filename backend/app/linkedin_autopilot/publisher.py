import os
import json
import logging
import time
from typing import Dict, Any
from .memory_engine import MemoryEngine

logger = logging.getLogger("linkedin_autopilot.publisher")

class Publisher:
    """
    Step 14-16: Payload Exporter, Memory Metadata Recorder & LinkedIn Publisher.
    """
    def __init__(self, memory_engine: MemoryEngine):
        self.memory = memory_engine

    def prepare_and_record(self, story_title: str, thesis: str, selected_hook: str, post_content: str, image_spec: Dict[str, Any], review_scorecard: Dict[str, Any]) -> Dict[str, Any]:
        
        # Record in Memory to prevent future duplicates
        self.memory.record_publication(
            topic_name=story_title,
            thesis=thesis,
            selected_hook=selected_hook,
            image_prompt=image_spec.get("final_prompt", "")
        )

        publication_package = {
            "timestamp": int(time.time()),
            "status": "READY_FOR_PUBLICATION",
            "story_title": story_title,
            "thesis": thesis,
            "selected_hook": selected_hook,
            "post_content": post_content,
            "cta_question": "If your Scope 3 calculations currently default to global databases for Indian supply chains, how are you validating grid uplift factors before filing your BRSR report?",
            "image_spec": image_spec,
            "review_scorecard": review_scorecard
        }

        # Save local JSON artifact
        artifacts_dir = os.path.join(os.getcwd(), "published_posts")
        os.makedirs(artifacts_dir, exist_ok=True)
        filename = os.path.join(artifacts_dir, f"linkedin_post_{int(time.time())}.json")
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(publication_package, f, indent=2)

        logger.info(f"Published package saved to {filename}")
        return publication_package
