"""Deploy a Supabase usando hostaddr para forzar IPv4 con SNI correcto."""
import psycopg2
from pathlib import Path

SQL = Path(__file__).parent.parent / "Migrations" / "001_inventario.sql"
sql = SQL.read_text(encoding="utf-8")

attempts = [
    ("POOLER 44.208 :6543", "host=aws-0-us-east-1.pooler.supabase.com hostaddr=44.208.221.186 port=6543 dbname=postgres user=postgres.gklxdzhmpjwwmffjdmwv password=alejandroRachr29. sslmode=require connect_timeout=10"),
    ("POOLER 52.45  :6543", "host=aws-0-us-east-1.pooler.supabase.com hostaddr=52.45.94.125  port=6543 dbname=postgres user=postgres.gklxdzhmpjwwmffjdmwv password=alejandroRachr29. sslmode=require connect_timeout=10"),
    ("DIRECT 44.208 :5432", "host=db.gklxdzhmpjwwmffjdmwv.supabase.co  hostaddr=44.208.221.186 port=5432 dbname=postgres user=postgres password=alejandroRachr29. sslmode=require connect_timeout=10"),
    ("POOLER sesion :5432", "host=aws-0-us-east-1.pooler.supabase.com hostaddr=44.208.221.186 port=5432 dbname=postgres user=postgres.gklxdzhmpjwwmffjdmwv password=alejandroRachr29. sslmode=require connect_timeout=10"),
]

for label, cs in attempts:
    try:
        conn = psycopg2.connect(cs)
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute("SELECT current_database(), current_user")
        db, usr = cur.fetchone()
        print(f"\nCONECTADO [{label}] db={db} user={usr}")
        cur.execute(sql)
        cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'inventario%' ORDER BY tablename")
        tables = [r[0] for r in cur.fetchall()]
        cur.execute("SELECT trigger_name FROM information_schema.triggers WHERE trigger_schema='public' AND (trigger_name LIKE 'trg_entrada%' OR trigger_name LIKE 'trg_salida%' OR trigger_name LIKE 'trg_stock%') ORDER BY trigger_name")
        triggers = [r[0] for r in cur.fetchall()]
        print(f"  tablas  : {tables}")
        print(f"  triggers: {triggers}")
        conn.close()
        print("\nSUPABASE LISTO!")
        break
    except Exception as e:
        print(f"FAIL [{label}]: {str(e)[:120]}")
