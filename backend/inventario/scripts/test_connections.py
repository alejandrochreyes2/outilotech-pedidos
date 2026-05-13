"""Test connections to all database targets."""
import psycopg2

configs = [
    # Producción
    dict(label="PROD outiltech/postgres/root",
         host="178.156.222.248", port=5432, dbname="outiltech", user="postgres", password="root"),
    dict(label="PROD outiltech/toyota_user",
         host="178.156.222.248", port=5432, dbname="outiltech", user="toyota_user", password="Toyota2026!"),
    # Local Docker
    dict(label="LOCAL outiltech_db/toyota_user",
         host="localhost", port=5432, dbname="outiltech_db", user="toyota_user", password="Toyota2026!"),
    dict(label="LOCAL outiltech/postgres",
         host="localhost", port=5432, dbname="outiltech", user="postgres", password="postgres"),
    # Supabase direct (pooler)
    dict(label="SUPABASE direct",
         host="db.gklxdzhmpjwwmffjdmwv.supabase.co", port=5432,
         dbname="postgres", user="postgres", password="SUPABASE_DB_PASSWORD"),
]

for cfg in configs:
    label = cfg.pop("label")
    try:
        conn = psycopg2.connect(**cfg, connect_timeout=5)
        cur = conn.cursor()
        cur.execute("SELECT current_database(), current_user")
        db, usr = cur.fetchone()
        cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename")
        tables = [r[0] for r in cur.fetchall()]
        print(f"OK  [{label}] db={db} user={usr}")
        print(f"    tablas: {tables}")
        conn.close()
    except Exception as e:
        print(f"FAIL [{label}]: {e}")
