"""SQLite storage for leads. Dedupes by (source, external_id)."""
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "leads.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS leads (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    source        TEXT NOT NULL,
    external_id   TEXT NOT NULL,
    author        TEXT,
    title         TEXT,
    body          TEXT,
    url           TEXT,
    community     TEXT,
    matched_topic TEXT,
    pain_score    INTEGER DEFAULT 0,
    upvotes       INTEGER DEFAULT 0,
    created_utc   INTEGER,
    status        TEXT DEFAULT 'new',
    notes         TEXT DEFAULT '',
    found_at      TEXT DEFAULT (datetime('now')),
    UNIQUE(source, external_id)
);
"""


def connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init():
    with connect() as conn:
        conn.executescript(SCHEMA)


def upsert_lead(lead: dict) -> bool:
    """Insert a lead. Returns True if newly inserted, False if it already existed."""
    init()
    with connect() as conn:
        try:
            conn.execute(
                """INSERT INTO leads
                   (source, external_id, author, title, body, url, community,
                    matched_topic, pain_score, upvotes, created_utc)
                   VALUES (:source, :external_id, :author, :title, :body, :url,
                           :community, :matched_topic, :pain_score, :upvotes, :created_utc)""",
                lead,
            )
            return True
        except sqlite3.IntegrityError:
            # Already have it — bump the matched_topic/score if this hit scored higher.
            conn.execute(
                """UPDATE leads SET pain_score = MAX(pain_score, :pain_score)
                   WHERE source = :source AND external_id = :external_id""",
                lead,
            )
            return False


def query_leads(status=None, source=None, search=None, order="pain_score"):
    init()
    sql = "SELECT * FROM leads WHERE 1=1"
    params = []
    if status and status != "all":
        sql += " AND status = ?"
        params.append(status)
    if source and source != "all":
        sql += " AND source = ?"
        params.append(source)
    if search:
        sql += " AND (title LIKE ? OR body LIKE ? OR matched_topic LIKE ?)"
        like = f"%{search}%"
        params += [like, like, like]
    order_col = {"pain_score": "pain_score DESC, upvotes DESC",
                 "recent": "created_utc DESC",
                 "upvotes": "upvotes DESC"}.get(order, "pain_score DESC")
    sql += f" ORDER BY {order_col}"
    with connect() as conn:
        return [dict(r) for r in conn.execute(sql, params).fetchall()]


def update_lead(lead_id, status=None, notes=None):
    init()
    with connect() as conn:
        if status is not None:
            conn.execute("UPDATE leads SET status = ? WHERE id = ?", (status, lead_id))
        if notes is not None:
            conn.execute("UPDATE leads SET notes = ? WHERE id = ?", (notes, lead_id))


def stats():
    init()
    with connect() as conn:
        rows = conn.execute("SELECT status, COUNT(*) c FROM leads GROUP BY status").fetchall()
        total = conn.execute("SELECT COUNT(*) c FROM leads").fetchone()["c"]
    by_status = {r["status"]: r["c"] for r in rows}
    return {"total": total, "by_status": by_status}
