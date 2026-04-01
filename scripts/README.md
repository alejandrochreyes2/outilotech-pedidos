# OUTILTECH — Sistema de Deploy

## Deploy diario
```bash
./scripts/deploy.sh "descripción de lo que cambiaste"
```

## Rollback (revertir cambios)
```bash
./scripts/deploy.sh --rollback
```

## Ver historial completo
```bash
cat scripts/deploy_history.log
```

## Ver todos los puntos de rollback
```bash
git tag -l "deploy-*" | sort -r
```

## Ejemplos de uso
```bash
./scripts/deploy.sh "nuevo logo outiltech y eslogan"
./scripts/deploy.sh "implementación correo corporativo"
./scripts/deploy.sh "nueva página seguridad forense"
./scripts/deploy.sh --rollback
```
