## AVIB Plugin

Este repositorio contiene el código de los plugin para Visual Studio y Eclipse IDE. El repositorio cuenta con cuatro proyectosÑ

1. Scripts de la base datos (https://github.com/antgonto/plugin/tree/master/docker/neo4j-docker).
2. Backend - el núcleo de la aplicación (https://github.com/antgonto/plugin/tree/master/docker/avib-app).
3. Servidor del backend (https://github.com/antgonto/plugin/tree/master/docker/server-docker).
4. Frontend (https://github.com/antgonto/plugin/tree/master/docker/webpage-docker).

Estos proyectos cuentan con su propio Dockerfile, el cual es utilizado para construir las imágenes y cargarlas en Docker Hub. La carpeta de cada proyecto cuenta con su propio archivo `README.md` que tiene las instrucciones especifícas de cada uno.

El primer paso que se debe realizar es clonar el proyecto que se encuentran en el repositorio https://github.com/antgonto/plugin.git.

### Configurar la base de datos

La configuraciónn de la base de datos requiere realizar los paso que se detallan en las siguientes secciones.

#### Crear imagen
1. Abra una consola de terminal y escriba `docker build --tag olbapd/avib-db .`

#### Crear y ejecutar el contenedor

Para realizar esto ejecute el siguiente comando:

```
docker run \
    --name avib-db \
    -p7474:7474 -p7687:7687 \
    -v ~/Documents/visualizacion/docker/db-volume/data:/data \
    -v ~/Documents/visualizacion/docker/db-volume/logs:/logs \
    -v ~/Documents/visualizacion/docker/db-volume/import:/var/lib/neo4j/import \
    -v ~/Documents/visualizacion/docker/db-volume/plugins:/plugins \
    --env NEO4J_AUTH=neo4j/admin \
    olbapd/avib-neo4j
```

Si desea ejecutr el contenedor en modo desconectado, ejecute el siguiente comando:

```
docker run \
    --name avib-db \
    -d \
    -p7474:7474 -p7687:7687 \
    -v ~/Documents/visualizacion/docker/db-volume/data:/data \
    -v ~/Documents/visualizacion/docker/db-volume/logs:/logs \
    -v ~/Documents/visualizacion/docker/db-volume/import:/var/lib/neo4j/import \
    -v ~/Documents/visualizacion/docker/db-volume/plugins:/plugins \
    --env NEO4J_AUTH=neo4j/admin \
    olbapd/avib-neo4j
```

#### Verificar el estado de la base de datos

Una vez que la base de datos se esté ejecutando, ejecute los siguientes comandos para asegurarse de que los archivos se hayan copiado.

Primero debe acceder al bash de Docker:
`docker exec -it avib-db bash`

Ingrese a la carpeta de importación con `cd import` y verifique si se encuentran los archivos de la carpeta imports del proyecto con `ls`. En la carpeta la carpeta neo4j-docker, ejecute los siguientes comandos para copiar los archivos CSV.


```
sudo docker cp ./imports/calls.csv avib-db:/var/lib/neo4j/import/calls.csv
sudo docker cp ./imports/classes.csv avib-db:/var/lib/neo4j/import/classes.csv
sudo docker cp ./imports/collapses.csv avib-db:/var/lib/neo4j/import/collapses.csv
sudo docker cp ./imports/hierarchy.csv avib-db:/var/lib/neo4j/import/hierarchy.csv
sudo docker cp ./imports/ics.csv avib-db:/var/lib/neo4j/import/ics.csv
sudo docker cp ./imports/methods.csv avib-db:/var/lib/neo4j/import/methods.csv
sudo docker cp ./imports/namespaces.csv avib-db:/var/lib/neo4j/import/namespaces.csv
sudo docker cp ./imports/project.csv avib-db:/var/lib/neo4j/import/project.csv
sudo docker cp ./imports/scccalls.csv avib-db:/var/lib/neo4j/import/scccalls.csv
sudo docker cp ./imports/sccs.csv avib-db:/var/lib/neo4j/import/sccs.csv
```

#### Cargue la base de datos

1. Acceda al bash del contenedor, luego acceda al shell de cifrado con `cypher-shell -u neo4j -p admin`. 

2. Ejecute los comandos en el archivo load_csv_neo4j.cypher para llenar la base de datos.

3. Acceda `http://localhost:7474/browser/` y asegurese que se crearon todos los nodos.


