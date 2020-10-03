# Instructions
Created by Pablo Garcia Brenes
Version: 1.0
Date: June 2020

## Create image 
1. Download the project into a folder.
2. Open a cmd console in Windows or a terminal in Linux and type `docker build --tag olbapd/avib-db .`

## Create and run container
You must change the volume path to match yours.

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

If you want to run the container in detach mode then you can run this command.

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

## Verify database state 

Once the database is running run the following commands to make sure the files have been copied.

First we must access the docker bash:
`docker exec -it avib-db bash`


Once inside we go into the import folder with `cd import` and see if the files are in there with `ls`. If there are no files then you must exit the container bash with `exit`.

Inside the neo4j-docker folder run the following commands to copy the CSV files.

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
## Loading database

Acces the container bash like previously shown, then acces the cypher shell with `cypher-shell -u neo4j -p admin`.

Then start executing the commands inside the load_csv_neo4j.cypher file to populate the database. 

Once done you can acces `http://localhost:7474/browser/` and make sure all the nodes are created. 
