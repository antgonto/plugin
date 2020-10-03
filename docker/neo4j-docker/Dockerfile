FROM neo4j:latest
ENV NEO4J_AUTH=neo4j/admin
ENV NEO4J_dbms.connector.bolt.address=0.0.0.0:7687
EXPOSE 7687 
EXPOSE 7474

VOLUME ~/Documents/visualizacion/db-volume/data:/var/lib/neo4j/data
VOLUME ~/Documents/visualizacion/db-volume/logs:/var/lib/neo4j/logs
VOLUME ~/Documents/visualizacion/db-volume/import:/var/lib/neo4j/import
VOLUME ~/Documents/visualizacion/db-volume/plugins:/var/lib/neo4j/plugins

#Copy files
COPY ./imports/calls.csv /var/lib/neo4j/import/
COPY ./imports/classes.csv /var/lib/neo4j/import/
COPY ./imports/collapses.csv /var/lib/neo4j/import/
COPY ./imports/hierarchy.csv /var/lib/neo4j/import/
COPY ./imports/ics.csv /var/lib/neo4j/import/
COPY ./imports/methods.csv /var/lib/neo4j/import/
COPY ./imports/namespaces.csv /var/lib/neo4j/import/
COPY ./imports/project.csv /var/lib/neo4j/import/
COPY ./imports/scccalls.csv /var/lib/neo4j/import/
COPY ./imports/sccs.csv /var/lib/neo4j/import/

#COPY ./src/load_csv_neo4j.cypher /var/lib/neo4j/import/