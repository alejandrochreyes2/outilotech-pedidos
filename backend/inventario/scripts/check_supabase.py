import psycopg2
from pathlib import Path

SQL_SCHEMA = (Path(__file__).parent.parent / "Migrations" / "002_supabase_inventario.sql").read_text(encoding="utf-8")

IPS = ["3.148.140.216", "13.58.13.125", "3.131.201.192"]
conn = None
for ip in IPS:
    try:
        dsn = (
            f"host=aws-1-us-east-2.pooler.supabase.com "
            f"hostaddr={ip} port=6543 dbname=postgres "
            f"user=postgres.gklxdzhmpjwwmffjdmwv "
            f"password=alejandroRachr29. sslmode=require connect_timeout=10"
        )
        conn = psycopg2.connect(dsn)
        print(f"Conectado via {ip}")
        break
    except Exception as e:
        print(f"FAIL {ip}: {e}")

if not conn:
    print("No se pudo conectar")
    exit(1)

conn.autocommit = True
cur = conn.cursor()

cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename='inventario_stock'")
stock_exists = cur.fetchone() is not None
print(f"inventario_stock existe: {stock_exists}")

if not stock_exists:
    print("Ejecutando schema completo en Supabase...")
    try:
        cur.execute(SQL_SCHEMA)
        print("Schema creado OK")
    except Exception as e:
        print(f"Error en schema: {e}")

cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'inventario_s%' ORDER BY tablename")
tables = [r[0] for r in cur.fetchall()]
print("Tablas creadas:", tables)

cur.execute("SELECT trigger_name FROM information_schema.triggers WHERE trigger_schema='public' AND (trigger_name LIKE 'trg_entrada%' OR trigger_name LIKE 'trg_salida%' OR trigger_name LIKE 'trg_stock%') ORDER BY trigger_name")
triggers = [r[0] for r in cur.fetchall()]
print("Triggers:", triggers)

conn.close()
