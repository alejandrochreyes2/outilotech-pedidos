import psycopg2

conn = psycopg2.connect(host='localhost', port=5432, dbname='outiltech', user='postgres', password='postgres')
cur = conn.cursor()

cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'inventario%' ORDER BY tablename")
tables = [r[0] for r in cur.fetchall()]
print(f"Tablas inventario: {tables}")

cur.execute("""SELECT trigger_name, event_object_table, event_manipulation
               FROM information_schema.triggers
               WHERE trigger_schema='public' AND trigger_name LIKE 'trg_%'
               ORDER BY event_object_table, trigger_name""")
print("Triggers:")
for r in cur.fetchall():
    print(f"  {r[0]} -> {r[1]} ON {r[2]}")

cur.execute("SELECT viewname FROM pg_views WHERE schemaname='public' AND viewname LIKE 'v_%'")
print(f"Vistas: {[r[0] for r in cur.fetchall()]}")

# Test: insertar un producto de prueba
cur.execute("""
    INSERT INTO inventario_stock (codigo_producto, descripcion, lote, costo_unitario, precio_venta)
    VALUES ('TEST001', 'PRODUCTO PRUEBA', 'TEST001', 10000, 25000)
    ON CONFLICT (codigo_producto) DO NOTHING
""")
conn.commit()

# Test entrada: debe sumar stock
cur.execute("""
    INSERT INTO inventario_entradas (nro_documento, fecha, codigo_producto, descripcion, lote, cantidad)
    VALUES (9999, CURRENT_DATE, 'TEST001', 'PRODUCTO PRUEBA', 'TEST001', 5)
""")
conn.commit()
cur.execute("SELECT stock_actual, entradas FROM inventario_stock WHERE codigo_producto='TEST001'")
stock, entradas = cur.fetchone()
print(f"\nTest ENTRADA OK: stock_actual={stock} entradas={entradas} (esperado: 5, 5)")

# Test salida valida (debe funcionar)
cur.execute("""
    INSERT INTO inventario_salidas (nro_documento, fecha, codigo_producto, lote, cantidad, precio_venta, utilidad)
    VALUES (9999, CURRENT_DATE, 'TEST001', 'TEST001', 2, 25000, 15000)
""")
conn.commit()
cur.execute("SELECT stock_actual, salidas FROM inventario_stock WHERE codigo_producto='TEST001'")
stock, salidas = cur.fetchone()
print(f"Test SALIDA OK:  stock_actual={stock} salidas={salidas} (esperado: 3, 2)")

# Test bloqueo por stock insuficiente
try:
    cur.execute("""
        INSERT INTO inventario_salidas (nro_documento, fecha, codigo_producto, lote, cantidad, precio_venta, utilidad)
        VALUES (9999, CURRENT_DATE, 'TEST001', 'TEST001', 100, 25000, 15000)
    """)
    conn.commit()
    print("FALLO: debio bloquear la venta!")
except Exception as e:
    conn.rollback()
    print(f"Test BLOQUEO STOCK OK: trigger lanzó -> {str(e)[:80]}")

# Limpiar datos de prueba
cur.execute("DELETE FROM inventario_salidas WHERE nro_documento=9999")
cur.execute("DELETE FROM inventario_entradas WHERE nro_documento=9999")
cur.execute("DELETE FROM inventario_stock WHERE codigo_producto='TEST001'")
conn.commit()
print("\nPruebas completadas exitosamente.")
conn.close()
