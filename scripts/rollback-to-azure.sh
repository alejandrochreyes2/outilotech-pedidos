#!/bin/bash
echo "⚠️ Rollback: deteniendo contenedores en Oracle VM..."
# Asumiendo que la IP está guardada en algún lugar, o se obtiene de Terraform output
echo "Para ejecutar el rollback, destruye la VM con 'terraform destroy' en la carpeta terraform/."
echo "Luego, asegúrate de que los DNS y flujos de Azure estén activos."
echo "No se han eliminado recursos de Azure automáticamente."
