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
    'Authorization': `Bearer ${COOLIFY_API_TOKEN}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

async function deploy() {
  try {
    console.log(`🔌 Conectando a servidor Coolify: ${COOLIFY_URL}`);
    
    // 1. Verificar Token
    try {
      // Endpoint tentativo para validar permisos
      await api.get('/auth/check');
      console.log('✅ Autenticación exitosa.');
    } catch (e) {
      if (e.response && e.response.status === 404) {
        // En caso de que /auth/check no exista, intentamos /projects como fallback
        await api.get('/projects');
        console.log('✅ Autenticación exitosa (vía listado de proyectos).');
      } else {
        console.error('❌ Fallo de autenticación. Verifica tu Token API.');
        throw e;
      }
    }

    // 2. Obtener o Crear Proyecto "outiltech"
    console.log('🔍 Buscando proyecto "outiltech"...');
    let projectId = null;
    
    const { data: projectsData } = await api.get('/projects');
    const projects = projectsData?.data || projectsData || [];
    
    const existingProject = Array.isArray(projects) ? projects.find(p => p.name === 'outiltech') : null;

    if (existingProject) {
      projectId = existingProject.uuid || existingProject.id;
      console.log(`✅ Proyecto encontrado (ID: ${projectId})`);
    } else {
      console.log('⚠️ Proyecto no encontrado, creando...');
      const { data: newProject } = await api.post('/projects', { name: 'outiltech' });
      projectId = newProject.uuid || newProject.id || newProject.data?.id;
      console.log(`✅ Proyecto creado (ID: ${projectId})`);
    }

    // 3. Crear o Actualizar Recurso de Docker Compose
    console.log('📦 Configurando recurso docker-compose...');
    let composeId = null;
    
    // Asumimos endpoints comunes de REST según las instrucciones
    const composeEndpoint = `/docker-compose`; 
    // Usamos el listado para ver si ya tenemos uno
    let composeExists = false;
    try {
      const { data: composeList } = await api.get(composeEndpoint);
      const composes = composeList?.data || composeList || [];
      const myCompose = Array.isArray(composes) ? composes.find(c => c.name === 'outiltech-stack' && c.project_id === projectId) : null;
      
      if (myCompose) {
        composeExists = true;
        composeId = myCompose.uuid || myCompose.id;
      }
    } catch (err) {
      // Ignorar posibles 404s si el endpoint base no lista así
    }

    const composePayload = {
      project_id: projectId,
      name: 'outiltech-stack',
      docker_compose_location: '/docker-compose.prod.yml',
      watch: true
    };

    if (composeExists && composeId) {
      console.log(`⚙️  Recurso existente (ID: ${composeId}). Actualizando parámetros...`);
      await api.put(`${composeEndpoint}/${composeId}`, composePayload);
    } else {
      console.log('⚙️  Creando nuevo recurso docker-compose en Coolify...');
      const { data: newCompose } = await api.post(composeEndpoint, composePayload);
      composeId = newCompose?.uuid || newCompose?.id || newCompose?.data?.uuid;
    }

    console.log(`✅ Configuración de docker-compose completa.`);

    // 4. Iniciar Despliegue
    console.log('🚀 Iniciando despliegue de los contenedores...');
    const deployEndpoint = `/applications/${composeId}/deploy`;
    
    try {
      const { data: deployResp } = await api.post(deployEndpoint);
      console.log(`✅ ¡Despliegue lanzado exitosamente! Revisa el panel de Coolify para ver los logs.`);
      console.log(`ID del despliegue: ${deployResp?.deployment_uuid || 'N/A'}`);
    } catch (deployErr) {
      console.warn(`⚠️ Error conectando al endpoint estricto de despliegue. Intentando método genérico...`);
      // Intento de fallback
      await api.post(`/deploy?uuid=${composeId}&force=true`);
      console.log(`✅ Despliegue invocado usando webhook de Coolify.`);
    }

  } catch (error) {
    console.error('❌ Hubo un error durante la ejecución del script:');
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

deploy();
