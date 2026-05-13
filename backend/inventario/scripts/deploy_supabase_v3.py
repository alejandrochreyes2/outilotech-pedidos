"""
Deploy Supabase con patch DNS para forzar IPv4 (Windows IPv6-only DNS issue).
Prueba también distintos endpoints regionales.
"""
import socket, psycopg2
from pathlib import Path

SQL = (Path(__file__).parent.parent / "Migrations" / "001_inventario.sql").read_text(encoding="utf-8")

# Patch: forzar AF_INET (IPv4) en todas las resoluciones DNS de Python
_orig = socket.getaddrinfo
def _ipv4_only(host, port, family=0, *args, **kwargs):
    try:
        return _orig(host, port, socket.AF_INET, *args, **kwargs)
    except socket.gaierror:
        return _orig(host, port, family, *args, **kwargs)
socket.getaddrinfo = _ipv4_only

PROJECT_REF = "gklxdzhmpjwwmffjdmwv"
PASSWORD    = "alejandroRachr29."

# Intentar distintos hosts de pooler por región
HOSTS = [
    f"aws-0-us-east-1.pooler.supabase.com",
    f"aws-0-us-east-2.pooler.supabase.com",
    f"aws-0-us-west-1.pooler.supabase.com",
    f"aws-0-eu-west-1.pooler.supabase.com",
    f"db.{PROJECT_REF}.supabase.co",
]

for host in HOSTS:
    for port, usr in [
        (6543, f"postgres.{PROJECT_REF}"),
        (5432, f"postgres.{PROJECT_REF}"),
        (5432, "postgres"),
    ]:
        label = f"{host}:{port}/{usr}"
        try:
            conn = psycopg2.connect(
                host=host, port=port, dbname="postgres",
                user=usr, password=PASSWORD,
                connect_timeout=8, sslmode="require"
            )
            conn.autocommit = True
            cur = conn.cursor()
            cur.execute("SELECT current_database(), current_user")
            db, u = cur.fetchone()
            print(f"\n OK [{label}] db={db} user={u}")
            cur.execute(SQL)
            cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'inventario%' ORDER BY tablename")
            tables = [r[0] for r in cur.fetchall()]
            cur.execute("SELECT trigger_name FROM information_schema.triggers WHERE trigger_schema='public' AND (trigger_name LIKE 'trg_entrada%' OR trigger_name LIKE 'trg_salida%' OR trigger_name LIKE 'trg_stock%') ORDER BY trigger_name")
            triggers = [r[0] for r in cur.fetchall()]
            print(f"    tablas  : {tables}")
            print(f"    triggers: {triggers}")
            conn.close()
            print("\n=== SUPABASE LISTO ===")
            import sys; sys.exit(0)
        except Exception as e:
            msg = str(e)[:90]
            print(f"FAIL [{label}]: {msg}")
