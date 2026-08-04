import os
import sqlite3
import hashlib
import time
from typing import Dict, Any, List, Optional

class MemoryEngine:
    """
    Persistent SQLite memory tracking published topics, hooks, statistics, and image concepts.
    Prevents repetitive content generation.
    """
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path or os.getenv("AUTOPILOT_DB_PATH", "linkedin_autopilot_memory.db")
        self._init_db()

    def _get_connection(self):
        return sqlite3.connect(self.db_path)

    def _init_db(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS memory_records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    topic_hash TEXT UNIQUE,
                    topic_name TEXT,
                    thesis TEXT,
                    selected_hook TEXT,
                    image_prompt TEXT,
                    published_at INTEGER
                )
            """)
            conn.commit()

    def hash_text(self, text: str) -> str:
        cleaned = "".join(text.lower().split())
        return hashlib.sha256(cleaned.encode("utf-8")).hexdigest()

    def is_duplicate_topic(self, topic_name: str, thesis: str) -> bool:
        """
        Checks if the topic or thesis has been covered recently.
        """
        t_hash = self.hash_text(topic_name)
        th_hash = self.hash_text(thesis)
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM memory_records WHERE topic_hash = ? OR topic_hash = ?", (t_hash, th_hash))
            row = cursor.fetchone()
            return row is not None

    def record_publication(self, topic_name: str, thesis: str, selected_hook: str, image_prompt: str):
        """
        Stores published post metadata in memory.
        """
        t_hash = self.hash_text(topic_name)
        now = int(time.time())
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO memory_records (topic_hash, topic_name, thesis, selected_hook, image_prompt, published_at)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (t_hash, topic_name, thesis, selected_hook, image_prompt, now))
            conn.commit()

    def get_recent_history(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Returns recent publication history for deduplication context.
        """
        with self._get_connection() as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM memory_records ORDER BY published_at DESC LIMIT ?", (limit,))
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
