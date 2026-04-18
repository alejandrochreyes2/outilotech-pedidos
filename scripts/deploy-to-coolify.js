const axios = require('axios');
require('dotenv').config();

const COOLIFY_URL = process.env.COOLIFY_URL;
const COOLIFY_API_TOKEN = process.env.COOLIFY_API_TOKEN;

if (!COOLIFY_URL || !COOLIFY_API_TOKEN) {
  console.error("❌ Error: Falta COOLIFY_URL o COOLIFY_API_TOKEN en el entorno.");
  process.exit(1);
}

// Configuración de Axios para Coolify API
const api = axios.create({
  baseURL: COOLIFY_URL.replace(/\/$/, '') + '/api/v1',
  headers: {
    'Authorization': `Bearer ${COOLIFY_API_TOKEN}`
  }
});

// UUID de la aplicación autogenerado por Coolify para 'outiltech'
const APP_UUID = "g12weuw6n4h1cag21oo53sd1";

async function deploy() {
  try {
    console.log(`🔌 Conectando al Webhook de Despliegue en Coolify...`);
    
    // Invocación a una sola línea del Webhook Automático
    const { data } = await api.post(`/deploy?uuid=${APP_UUID}&force=true`);
    
    console.log(`✅ ¡WebHook disparado con éxito!`);
    console.log(`📝 Despliegue encolado:`, JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Hubo un error al invocar el webhook de Coolify:');
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

deploy();
