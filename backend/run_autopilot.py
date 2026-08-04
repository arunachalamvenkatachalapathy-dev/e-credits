import sys
import os
import json
import logging

# Ensure backend directory is on PYTHONPATH
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.linkedin_autopilot.orchestrator import NewsroomOrchestrator

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

def main():
    print("🚀 Running LinkedIn Autopilot v3.0 Newsroom Pipeline...")
    orchestrator = NewsroomOrchestrator()
    result = orchestrator.run_pipeline()
    
    print("\n=================== PUBLISHED PACKAGE ===================")
    print(f"TITLE: {result.get('story_title')}")
    print(f"HOOK: {result.get('selected_hook')}")
    print(f"SCORECARD: {json.dumps(result.get('review_scorecard'), indent=2)}")
    print("\nCONTENT:")
    print(result.get('post_content'))
    print("=========================================================\n")
    return 0

if __name__ == "__main__":
    sys.exit(main())
