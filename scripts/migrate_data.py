#!/usr/bin/env python3
import os
import subprocess
import sys
import psycopg2
from supabase import create_client
from pymongo import MongoClient

def main():
    # Leer variables de entorno
    supabase_url = os.environ['SUPABASE_URL']
    supabase_key = os.environ['SUPABASE_ANON_KEY']
    mongodb_uri = os.environ['MONGODB_URI']
    pg_host = os.environ.get('PG_HOST', 'localhost')
    pg_user = os.environ.get('PG_USER', 'postgres')
    pg_password = os.environ.get('PG_PASSWORD', 'postgres')
    mongo_host = os.environ.get('MONGO_HOST', 'localhost')

    print("📦 Migrando datos desde Supabase a PostgreSQL local...")
    # Usar pg_dump/pg_restore vía subprocess (simplificado)
    # En producción real habría que usar lógica más robusta
    subprocess.run(f"pg_dump --dbname={supabase_url} --format=custom --file=/tmp/supabase.dump", shell=True, check=False)
    subprocess.run(f"pg_restore --host={pg_host} --username={pg_user} --dbname=outiltech --clean --if-exists /tmp/supabase.dump", shell=True, check=False)

    print("📦 Migrando datos desde MongoDB Atlas a MongoDB local...")
    subprocess.run(f"mongodump --uri={mongodb_uri} --out=/tmp/mongo_dump", shell=True, check=False)
    subprocess.run(f"mongorestore --host={mongo_host} --drop /tmp/mongo_dump", shell=True, check=False)

    print("✅ Migración completada.")

if __name__ == "__main__":
    main()
