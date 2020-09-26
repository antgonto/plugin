LOAD CSV FROM 'file:///project.csv' as f
    CREATE(:Project { id: f[0] });
CREATE CONSTRAINT ON (p:Project) ASSERT p.id IS UNIQUE;

LOAD CSV FROM 'file:///namespaces.csv' as f
    MERGE (p:Project { id: f[3] })
    CREATE (n:Namespace { id: f[0], name: f[1], qualifiedname: f[2] })
    CREATE (p)-[:HAS_NAMESPACE]->(n);
CREATE CONSTRAINT ON (n:Namespace) ASSERT n.id IS UNIQUE;

LOAD CSV FROM 'file:///hierarchy.csv' as f
    MERGE (n1:Namespace { id: f[0] })
    MERGE (n2:Namespace { id: f[1] })
    CREATE (n1)-[:CONTAINS_NAMESPACE]->(n2);

LOAD CSV FROM 'file:///classes.csv' as f
    MERGE (p:Project { id: f[4] })
    MERGE (n:Namespace { id: f[3] })
    CREATE (c:Clase { id: f[0], name: f[1], qualifiedname: f[2] })
    CREATE (p)-[:HAS_CLASS]->(c)
    CREATE (n)-[:CONTAINS_CLASS]->(c);
CREATE CONSTRAINT ON (c:Clase) ASSERT c.id IS UNIQUE;

LOAD CSV FROM 'file:///methods.csv' as f
    MERGE (p:Project { id: f[4] })
    MERGE (n:Namespace { id: f[3] })
    MERGE (c:Clase { id: f[2] })
    CREATE (m:Metodo { id: f[0], name: f[1], 
        lines:   toInteger(f[ 5]), cyclomatic: toInteger(f[6]),  constant: toInteger(f[7]),
        icrlmin: toInteger(f[ 8]),    icrlmax: toInteger(f[9]),  icrlavg: toInteger(f[10]), icrlsum: toInteger(f[11]),
        icflmin: toInteger(f[12]),    icflmax: toInteger(f[13]), icflavg: toInteger(f[14]), icflsum: toInteger(f[15]),
        icrcmin: toInteger(f[16]),    icrcmax: toInteger(f[17]), icrcavg: toInteger(f[18]), icrcsum: toInteger(f[19]),
        icfcmin: toInteger(f[20]),    icfcmax: toInteger(f[21]), icfcavg: toInteger(f[22]), icfcsum: toInteger(f[23]),
        icrkmin: toInteger(f[24]),    icrkmax: toInteger(f[25]), icrkavg: toInteger(f[26]), icrksum: toInteger(f[27]),
        icfkmin: toInteger(f[28]),    icfkmax: toInteger(f[29]), icfkavg: toInteger(f[30]), icfksum: toInteger(f[31]),
        ismethod: toInteger(f[32]),   iscollapsed: toInteger(f[33]), isrecursive: toInteger(f[34])
     })
    CREATE (p)-[:HAS_METHOD]->(m)
    CREATE (n)-[:CONTAINS_METHOD]->(m)
    CREATE (c)-[:OWNS_METHOD]->(m);
LOAD CSV FROM 'file:///sccs.csv' as f
    MERGE (p:Project { id: f[4] })
    CREATE (m:Metodo { id: f[0], name: f[1], 
        lines:   toInteger(f[ 5]), cyclomatic: toInteger(f[6]),  constant: toInteger(f[7]),
        icrlmin: toInteger(f[ 8]),    icrlmax: toInteger(f[9]),  icrlavg: toInteger(f[10]), icrlsum: toInteger(f[11]),
        icflmin: toInteger(f[12]),    icflmax: toInteger(f[13]), icflavg: toInteger(f[14]), icflsum: toInteger(f[15]),
        icrcmin: toInteger(f[16]),    icrcmax: toInteger(f[17]), icrcavg: toInteger(f[18]), icrcsum: toInteger(f[19]),
        icfcmin: toInteger(f[20]),    icfcmax: toInteger(f[21]), icfcavg: toInteger(f[22]), icfcsum: toInteger(f[23]),
        icrkmin: toInteger(f[24]),    icrkmax: toInteger(f[25]), icrkavg: toInteger(f[26]), icrksum: toInteger(f[27]),
        icfkmin: toInteger(f[28]),    icfkmax: toInteger(f[29]), icfkavg: toInteger(f[30]), icfksum: toInteger(f[31]),
        ismethod: toInteger(f[32]),   iscollapsed: toInteger(f[33]), isrecursive: toInteger(f[34])
     })
    CREATE (p)-[:HAS_METHOD]->(m);
CREATE CONSTRAINT ON (m:Metodo) ASSERT m.id IS UNIQUE;

LOAD CSV FROM 'file:///calls.csv' as f
    MERGE (m1:Metodo { id: f[0] })
    MERGE (m2:Metodo { id: f[1] })
    CREATE (m1)-[:CALLS]->(m2);

LOAD CSV FROM 'file:///scccalls.csv' as f
    MERGE (m1:Metodo { id: f[0] })
    MERGE (m2:Metodo { id: f[1] })
    CREATE (m1)-[:CALLS]->(m2);

LOAD CSV FROM 'file:///collapses.csv' as f
    MERGE (m1:Metodo { id: f[0] })
    MERGE (m2:Metodo { id: f[1] })
    CREATE (m1)-[:COLLAPSES]->(m2);

LOAD CSV FROM 'file:///ics.csv' as f
    MERGE (m1:Metodo { id: f[0] })
    MERGE (m2:Metodo { id: f[1] })
    CREATE (ics:ICS  { 
        icslmin: toInteger(f[ 2]), icslmax: toInteger(f[ 3]), icslavg: toInteger(f[ 4]), icslsum: toInteger(f[ 5]),
        icscmin: toInteger(f[ 6]), icscmax: toInteger(f[ 7]), icscavg: toInteger(f[ 8]), icscsum: toInteger(f[ 9]),
        icskmin: toInteger(f[10]), icskmax: toInteger(f[11]), icskavg: toInteger(f[12]), icsksum: toInteger(f[13])
    })
    CREATE (m1)-[:ICS]->(ics)-[:ICS]->(m2);

DROP CONSTRAINT ON (p:Project) ASSERT p.id IS UNIQUE;
DROP CONSTRAINT ON (n:Namespace) ASSERT n.id IS UNIQUE;
DROP CONSTRAINT ON (c:Clase) ASSERT c.id IS UNIQUE;
DROP CONSTRAINT ON (m:Metodo) ASSERT m.id IS UNIQUE;
MATCH (x) WHERE x:Namespace OR x:Clase OR x:Metodo REMOVE x.id;