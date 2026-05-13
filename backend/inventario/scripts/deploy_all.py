"""Deploy 001_inventario.sql a todos los servidores."""
import psycopg2
from pathlib import Path

SQL_FILE = Path(__file__).parent.parent / "Migrations" / "001_inventario.sql"
SQL = SQL_FILE.read_text(encoding="utf-8")

TARGETS = [
    # Producción — todas las combinaciones posibles
    dict(label="PROD outiltech / postgres / Toyota2026!",
         host="178.156.222.248", port=5432, dbname="outiltech", user="postgres", password="Toyota2026!"),
    dict(label="PROD outiltech / toyota_user / Toyota2026!",
         host="178.156.222.248", port=5432, dbname="outiltech", user="toyota_user", password="Toyota2026!"),
    dict(label="PROD outiltech_db / toyota_user / Toyota2026!",
         host="178.156.222.248", port=5432, dbname="outiltech_db", user="toyota_user", password="Toyota2026!"),
    dict(label="PROD outiltech / postgres / postgres",
         host="178.156.222.248", port=5432, dbname="outiltech", user="postgres", password="postgres"),
    dict(label="PROD outiltech / postgres / root",
         host="178.156.222.248", port=5432, dbname="outiltech", user="postgres", password="root"),
    # Supabase — password proporcionada
    dict(label="SUPABASE postgres / alejandroRachr29.",
         host="db.gklxdzhmpjwwmffjdmwv.supabase.co", port=5432,
         dbname="postgres", user="postgres", password="alejandroRachr29."),
    dict(label="SUPABASE pooler / alejandroRachr29.",
         host="aws-0-us-east-1.pooler.supabase.com", port=6543,
         dbname="postgres", user="postgres.gklxdzhmpjwwmffjdmwv", password="alejandroRachr29."),
]

resultados = []

for cfg in TARGETS:
    label = cfg.pop("label")
    try:
        conn = psycopg2.connect(**cfg, connect_timeout=8)
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute(SQL)
        cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'inventario%' ORDER BY tablename")
        tables = [r[0] for r in cur.fetchall()]
        cur.execute("SELECT trigger_name FROM information_schema.triggers WHERE trigger_schema='public' AND (trigger_name LIKE 'trg_entrada%' OR trigger_name LIKE 'trg_salida%' OR trigger_name LIKE 'trg_stock%') ORDER BY trigger_name")
        triggers = [r[0] for r in cur.fetchall()]
        cur.execute("SELECT viewname FROM pg_views WHERE schemaname='public' AND viewname LIKE 'v_%inventario%' OR schemaname='public' AND viewname='v_stock_bajo' OR schemaname='public' AND viewname='v_valor_inventario'")
        vistas = [r[0] for r in cur.fetchall()]
        conn.close()
        print(f"\nOK  [{label}]")
        print(f"    tablas  : {tables}")
        print(f"    triggers: {triggers}")
        print(f"    vistas  : {vistas}")
        resultados.append((label, True))
    except Exception as e:
        print(f"\nFAIL [{label}]: {e}")
        resultados.append((label, False))

print("\n" + "="*60)
print("RESUMEN FINAL:")
for label, ok in resultados:
    estado = "OK  " if ok else "FAIL"
    print(f"  {estado}  {label}")
