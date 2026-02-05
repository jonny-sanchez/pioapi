# PIOAPP

## Configurar Redis
- Definir servicio de redis e docker-compose.yml
- luego instalar redis en el contenedor de esta forma "docker-compose up -d"
- luego dentro del proyecto instalo redis "npm i redis"

## ver cache en redis
- docker exec -it pioapi-redis redis-cli
- SCAN 0
- SCAN 0 MATCH cache:*
# ver una key en especifico
- GET cache:tiendas
- GET cache:tienda:12
# timpo de vida del cache
- TTL cache:tiendas
# eliminar cache
- DEL cache:tiendas
# ver en timepo real el cache
- MONITOR

