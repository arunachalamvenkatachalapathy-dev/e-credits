import logging
from typing import Dict, Any, Optional
from .gemini_client import GeminiClient
from .memory_engine import MemoryEngine
from .research_engine import ResearchEngine
from .editorial_engine import EditorialEngine
from .hook_engine import HookEngine
from .review_engine import ReviewEngine
from .image_director import ImageDirector
from .publisher import Publisher

logger = logging.getLogger("linkedin_autopilot.orchestrator")

class NewsroomOrchestrator:
    """
    Master Autonomous Orchestrator executing the complete 16-step LinkedIn Autopilot v3.0 pipeline.
    """
    def __init__(self, api_key: Optional[str] = None, db_path: Optional[str] = None):
        self.gemini = GeminiClient(api_key=api_key)
        self.memory = MemoryEngine(db_path=db_path)
        self.research = ResearchEngine(self.gemini)
        self.editorial = EditorialEngine(self.gemini)
        self.hook_eng = HookEngine(self.gemini)
        self.reviewer = ReviewEngine(self.gemini)
        self.image_dir = ImageDirector(self.gemini)
        self.publisher = Publisher(self.memory)

    def run_pipeline(self, domain_context: str = "Scope 3 Carbon Accounting & India Industrial GHG Factors") -> Dict[str, Any]:
        logger.info("=== Starting LinkedIn Autopilot v3.0 Newsroom Pipeline ===")

        # Step 1-3: Research Discovery & Credibility Ranking
        candidates = self.research.extract_candidate_stories(domain_context=domain_context)
        
        # Step 4-5: Deduplication check against Memory
        selected_story = None
        for story in candidates:
            if not self.memory.is_duplicate_topic(story.get("story_title", ""), story.get("core_finding", "")):
                selected_story = story
                break
        
        if not selected_story:
            selected_story = candidates[0]

        logger.info(f"Selected Story: {selected_story.get('story_title')}")

        # Step 6-7: Form Editorial Thesis & Select Narrative Framework
        thesis_data = self.editorial.form_editorial_thesis(selected_story)

        # Step 8-9: Engineer & Select Winning Hook
        hook_data = self.hook_eng.engineer_hooks(thesis_data)
        winning_hook = hook_data.get("winning_hook", "")

        # Draft Article using Thesis & Winning Hook
        draft_prompt = (
            f"Write an executive-level, highly analytical LinkedIn post based on this winning hook and thesis.\n"
            f"HOOK:\n{winning_hook}\n"
            f"THESIS:\n{thesis_data.get('thesis')}\n"
            f"EVIDENCE:\n{thesis_data.get('key_evidence')}\n"
            f"TAKEAWAY:\n{thesis_data.get('actionable_takeaway')}\n\n"
            f"WRITING CONSTRAINTS:\n"
            f"- 1 to 2 short sentences per paragraph with clean line breaks.\n"
            f"- Do NOT use forbidden AI phrases ('in today's world', 'underscores', 'delve', 'testament').\n"
            f"- Focus on concrete numbers and engineering reality.\n"
            f"- End with one precise technical question for practitioner discussion."
        )
        
        draft_text = self.gemini.generate_text(draft_prompt, temperature=0.6)

        # Step 10-11: Multi-Stage Editorial Review & Quality Scorecard
        review_audit = self.reviewer.audit_draft(draft_text, winning_hook, thesis_data.get("thesis", ""))
        
        final_post_text = review_audit.get("sanitized_post", draft_text)

        # Step 12-13: Editorial Image Direction
        image_spec = self.image_dir.design_editorial_image(thesis_data.get("thesis", ""), selected_story.get("story_title", ""))

        # Step 14-16: Record Metadata & Publish Package
        final_package = self.publisher.prepare_and_record(
            story_title=selected_story.get("story_title", ""),
            thesis=thesis_data.get("thesis", ""),
            selected_hook=winning_hook,
            post_content=final_post_text,
            image_spec=image_spec,
            review_scorecard=review_audit.get("scorecard", {})
        )

        logger.info("=== Pipeline Execution Complete ===")
        return final_package
