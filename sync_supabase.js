/**
 * SYNC: PostgreSQL local → Supabase
 * Ejecutar desde Windows con: node sync_supabase.js
 * Requiere: npm install pg node-fetch
 *
 * Obtener SUPABASE_ANON_KEY en:
 * Supabase Dashboard → Settings → API → Project API Keys → anon (public)
 */

const { Client } = require('pg');
const https = require('https');

// ============================================================
// CONFIGURACIÓN — cambiar SUPABASE_ANON_KEY con su clave real
// ============================================================
const PG_LOCAL = {
  host: 'localhost',
  port: 5432,
  database: 'outiltech_db',
  user: 'toyota_user',
  password: 'Toyota2026!'
};

const SUPABASE_URL = 'https://gklxdzhmpjwwmffjdmwv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbHhkemhtcGp3d21mZmpkbXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NTM0MDEsImV4cCI6MjA5MTQyOTQwMX0.Es3YyKtLnx9lKiA_xyTHxK_IDSICb9kGf5-nu2XE_jg'; // ← cambiar esto

// ============================================================
// Helper: llamada a Supabase REST API
// ============================================================
function supabaseRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: `gklxdzhmpjwwmffjdmwv.supabase.co`,
      path: `/rest/v1/${path}`,
      method: method,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      }
    };
    if (data) options.headers['Content-Length'] = Buffer.byteLength(data);

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseData ? JSON.parse(responseData) : {});
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// ============================================================
// Sincronización principal
// ============================================================
async function syncToSupabase() {
  if (SUPABASE_ANON_KEY === 'PEGAR_AQUI_SU_ANON_KEY') {
    console.error('❌ ERROR: Debe pegar su SUPABASE_ANON_KEY en el script.');
    console.error('   Vaya a Supabase → Settings → API → Project API Keys → anon (public)');
    process.exit(1);
  }

  const pg = new Client(PG_LOCAL);
  await pg.connect();
  console.log('✅ Conectado a PostgreSQL local');

  try {
    // --- PEDIDOS ---
    const pedidos = await pg.query(`
      SELECT "Id" AS id, "Cliente" AS cliente, "Total" AS total, "Fecha" AS fecha,
             "Email" AS email, "Telefono" AS telefono, "Nombre" AS nombre,
             "Apellido" AS apellido, "Empresa" AS empresa, "Ciudad" AS ciudad,
             "Direccion" AS direccion, "Barrio" AS barrio, "TipoId" AS tipo_id,
             "NumeroId" AS numero_id, "MetodoEnvio" AS metodo_envio,
             "MetodoPago" AS metodo_pago, "ItemsJson" AS items_json, "Estado" AS estado
      FROM pedidos ORDER BY "Id"
    `);

    if (pedidos.rows.length > 0) {
      await supabaseRequest('POST', 'pedidos', pedidos.rows);
      console.log(`✅ Pedidos sincronizados: ${pedidos.rows.length} registros`);
    }

    // --- PAGOS ---
    const pagos = await pg.query(`
      SELECT "Id" AS id, "PedidoId" AS pedido_id, "Monto" AS monto,
             "Moneda" AS moneda, "Metodo" AS metodo, "Estado" AS estado,
             "Referencia" AS referencia, "Banco" AS banco, "Fecha" AS fecha
      FROM pagos ORDER BY "Id"
    `);

    if (pagos.rows.length > 0) {
      await supabaseRequest('POST', 'pagos', pagos.rows);
      console.log(`✅ Pagos sincronizados: ${pagos.rows.length} registros`);
    }

    // --- LISTA PRODUCTOS ---
    const productos = await pg.query(`
      SELECT id, ref, nombre, descripcion, categoria, subcategoria, marca,
             cantidad, v_unitario, imei_serial, contrasena, display, back_cover,
             celular, computador, observaciones, activo
      FROM lista_productos ORDER BY id
    `);

    if (productos.rows.length > 0) {
      await supabaseRequest('POST', 'lista_productos', productos.rows);
      console.log(`✅ Lista productos sincronizada: ${productos.rows.length} registros`);
    }

    // --- RELACION VENTAS ---
    const ventas = await pg.query(`
      SELECT id, fecha, hora::text AS hora, descripcion, costo, compras,
             fac, cliente, celular, observaciones, semana, anio
      FROM relacion_ventas ORDER BY id
    `);

    if (ventas.rows.length > 0) {
      await supabaseRequest('POST', 'relacion_ventas', ventas.rows);
      console.log(`✅ Relación ventas sincronizada: ${ventas.rows.length} registros`);
    }

    console.log('\n🎉 Sincronización completada. Verifique en Supabase Table Editor.');

  } catch (err) {
    console.error('❌ Error durante la sincronización:', err.message);
  } finally {
    await pg.end();
  }
}

syncToSupabase();
