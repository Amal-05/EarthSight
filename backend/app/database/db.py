import sqlite3
import json
import os
from typing import Dict, Any, List

DB_FILE = os.path.join(os.path.dirname(__file__), "earthsight.db")

def init_db():
    """Initializes lightweight database tables for persistent session history."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Analysis History Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS analysis_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            location_name TEXT,
            year1 INTEGER,
            year2 INTEGER,
            mode TEXT,
            target_feature TEXT,
            query_text TEXT,
            statistics_json TEXT,
            ai_report_json TEXT
        )
    """)
    
    conn.commit()
    conn.close()

def save_analysis_record(
    location_name: str,
    year1: int,
    year2: int,
    mode: str,
    target_feature: str,
    query_text: str,
    stats: Dict[str, Any],
    report: Dict[str, Any]
):
    try:
        init_db()
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO analysis_history 
            (location_name, year1, year2, mode, target_feature, query_text, statistics_json, ai_report_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                location_name,
                year1,
                year2,
                mode,
                target_feature,
                query_text,
                json.dumps(stats),
                json.dumps(report)
            )
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[DB] Error saving analysis record: {e}")

def get_recent_analyses(limit: int = 10) -> List[Dict[str, Any]]:
    try:
        init_db()
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT id, timestamp, location_name, year1, year2, mode, query_text FROM analysis_history ORDER BY id DESC LIMIT ?", (limit,))
        rows = cursor.fetchall()
        conn.close()
        
        return [
            {
                "id": r[0],
                "timestamp": r[1],
                "location_name": r[2],
                "year1": r[3],
                "year2": r[4],
                "mode": r[5],
                "query_text": r[6]
            }
            for r in rows
        ]
    except Exception as e:
        print(f"[DB] Error fetching recent analyses: {e}")
        return []
