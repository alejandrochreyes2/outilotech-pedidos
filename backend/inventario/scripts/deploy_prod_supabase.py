"""
deploy_prod_supabase.py
-----------------------
Ejecuta 001_inventario.sql en:
  1. Producción  178.156.222.248:5432
  2. Supabase    db.gklxdzhmpjwwmffjdmwv.supabase.co:5432

Uso:
    python deploy_prod_supabase.py --prod-pass TU_PASSWORD_PROD --supa-pass TU_PASSWORD_SUPA
"""
import argparse, psycopg2
from pathlib import Path

SQL_FILE = Path(__file__).parent.parent / "Migrations" / "001_inventario.sql"

def ejecutar_sql(cfg, label):
    print(f"\n{'='*60}")
    print(f"  Conectando a: {label}")
    try:
        conn = psycopg2.connect(**cfg, connect_timeout=10)
        conn.autocommit = True
        cur = conn.cursor()
        sql = SQL_FILE.read_text(encoding="utf-8")
        cur.execute(sql)
        cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'inventario%' ORDER BY tablename")
        tables = [r[0] for r in cur.fetchall()]
        cur.execute("SELECT trigger_name FROM information_schema.triggers WHERE trigger_schema='public' AND trigger_name LIKE 'trg_%inventario%' OR trigger_schema='public' AND trigger_name LIKE 'trg_entrada%' OR trigger_schema='public' AND trigger_name LIKE 'trg_salida%' OR trigger_schema='public' AND trigger_name LIKE 'trg_stock%'")
        triggers = [r[0] for r in cur.fetchall()]
        print(f"  OK -> tablas: {tables}")
        print(f"  OK -> triggers: {triggers}")
        conn.close()
        return True
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--prod-pass",  default="", help="Password de PostgreSQL producción 178.156.222.248")
    p.add_argument("--prod-user",  default="postgres")
    p.add_argument("--prod-db",    default="outiltech")
    p.add_argument("--supa-pass",  default="", help="Password de Supabase PostgreSQL directo")
    args = p.parse_args()

    resultados = {}

    if args.prod_pass:
        resultados["PRODUCCION"] = ejecutar_sql(
            dict(host="178.156.222.248", port=5432,
                 dbname=args.prod_db, user=args.prod_user, password=args.prod_pass),
            "PRODUCCION 178.156.222.248"
        )
    else:
        print("\nSaltar PRODUCCION (--prod-pass no proporcionado)")

    if args.supa_pass:
        resultados["SUPABASE"] = ejecutar_sql(
            dict(host="db.gklxdzhmpjwwmffjdmwv.supabase.co", port=5432,
                 dbname="postgres", user="postgres", password=args.supa_pass),
            "SUPABASE gklxdzhmpjwwmffjdmwv"
        )
    else:
        print("\nSaltar SUPABASE (--supa-pass no proporcionado)")

    print("\n=== RESUMEN ===")
    for k, v in resultados.items():
        print(f"  {k}: {'OK' if v else 'FALLO'}")
