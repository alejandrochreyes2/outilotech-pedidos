"""Deploy inventario SQL a Supabase usando IP directa del pooler."""
import psycopg2
from pathlib import Path

SQL_FILE = Path(__file__).parent.parent / "Migrations" / "001_inventario.sql"
SQL = SQL_FILE.read_text(encoding="utf-8")

SUPABASE_TARGETS = [
    # Pooler IPv4 puerto 6543 (Session mode)
    dict(label="SUPABASE pooler 44.208.221.186:6543",
         host="44.208.221.186", port=6543,
         dbname="postgres", user="postgres.gklxdzhmpjwwmffjdmwv", password="alejandroRachr29."),
    # Pooler IPv4 puerto 5432
    dict(label="SUPABASE pooler 44.208.221.186:5432",
         host="44.208.221.186", port=5432,
         dbname="postgres", user="postgres.gklxdzhmpjwwmffjdmwv", password="alejandroRachr29."),
    # Segundo IP del pooler
    dict(label="SUPABASE pooler 52.45.94.125:6543",
         host="52.45.94.125", port=6543,
         dbname="postgres", user="postgres.gklxdzhmpjwwmffjdmwv", password="alejandroRachr29."),
    # Direct DB IPv6
    dict(label="SUPABASE direct IPv6:5432",
         host="2600:1f16:1cd0:3336:6fb:3b86:f0c3:441a", port=5432,
         dbname="postgres", user="postgres", password="alejandroRachr29."),
]

for cfg in SUPABASE_TARGETS:
    label = cfg.pop("label")
    try:
        conn = psycopg2.connect(**cfg, connect_timeout=10)
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute("SELECT current_database(), current_user, version()")
        db, usr, ver = cur.fetchone()
        print(f"\nCONECTADO [{label}] db={db} user={usr}")
        cur.execute(SQL)
        cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'inventario%' ORDER BY tablename")
        tables = [r[0] for r in cur.fetchall()]
        cur.execute("SELECT trigger_name FROM information_schema.triggers WHERE trigger_schema='public' AND (trigger_name LIKE 'trg_entrada%' OR trigger_name LIKE 'trg_salida%' OR trigger_name LIKE 'trg_stock%') ORDER BY trigger_name")
        triggers = [r[0] for r in cur.fetchall()]
        print(f"  tablas  : {tables}")
        print(f"  triggers: {triggers}")
        conn.close()
        print(f"\nSUPABASE LISTO!")
        break
    except Exception as e:
        print(f"FAIL [{label}]: {e}")
