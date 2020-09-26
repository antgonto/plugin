import { AVIBProject } from '../models/AVIBProject';
import { AVIBNamespace } from '../models/AVIBNamespace';
import { AVIBClass }  from '../models/AVIBClass';
import { AVIBMethod }  from '../models/AVIBMethod';

let _ = require('lodash');
const neo4j = require('neo4j-driver').v1;


let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "admin"));
const svgns= "http://www.w3.org/2000/svg";

let expose={  
  createGraph:undefined,
}

expose.createGraph= (methodName,metricType1,metricType2)=>{
  return getChain(methodName)
  .then(result=>{
    let data = {"nodes":[],"links":[], "domain":[], "domain2":[]}

    //Creates the nodes and the metrics
    let min= Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;
    let min2= Number.MAX_SAFE_INTEGER;
    let max2 = Number.MIN_SAFE_INTEGER;

    let cont = 1;
    for (let i = 0; i < result.length; i++) {
      if(result[i].depth==1){ //Used to create the links for the main node
        
        cont+=1
        data.links.push({
                  "id": cont,
                  "source": 0,
                  "target": result[i].method.id,
                  //"type": "CALLS"
                });
      }
      //let metric = result[i].method.icrlavg;
      let metric = getMetric(metricType1,result[i].method);
      let metric2 = getMetric(metricType2,result[i].method);

      if(min>metric){
        min = metric
      }
      if(max<metric){
        max = metric
      }
      if(min2>metric2){
        min2 = metric2
      }
      if(max2<metric2){
        max2 = metric2
      }
      data.nodes.push({
                     "name":result[i].method.name,
                     "id":result[i].method.id,
                     "label":"Method",
                     "firstMetric": metric,
                     "secondMetric": metric2,
                  });
      
    }

    data.domain.push(min);
    data.domain.push(max);
    data.domain2.push(min2);
    data.domain2.push(max2);

    //Creates the links for other nodes (Consider making recursive case 1,2,3)
    for (let i = 1; i < result.length-1; i++) { //Does not evaluate the last because it is already linked
      for (let j = i+1; j < result.length; j++) {
         if(result[i].depth+1== result[j].depth){
           let temp={
                  "id": cont,
                  "source": result[i].method.id,
                  "target": result[j].method.id,
                  //"type": "CALLS"
                }
            data.links.push(temp);
         }
         else if(result[i].depth== result[j].depth){
           break;
         }
      }
    }

    return data;
  });
}

function getMetric(type,method){
  let metric=0;
  if(type==1){
    metric=method.icrlmin
  }
  else if(type==2){
    metric=method.icrlmax
  }
  else if(type==3){
    metric=method.icrlavg
  }
  else if(type==4){
    metric=method.icrlsum
  }
  return metric
}
/**
 * Gets the chain of a method
 * @param  {string} methodName [method to get from the db]
 * @return {Array of nodes}            [All the nodes with the linked the method.]
 */
function getChain(methodName){
	let session = driver.session();
  let mainMethod=null;
  let methodsList=[];
  let cont = 1;
  return session
    .run('MATCH (m:Metodo {name:'+"'"+methodName+"'"+'})-[r:CALLS *]->(b) RETURN m,r,b')
    .then(result=>{
      session.close();
      result.records.map(res=>{
        if(mainMethod==null){
          mainMethod = new AVIBMethod(res.get('m').properties,0,[]);
          methodsList.push({"method":mainMethod, "depth":0});
        }
        let tempMethod = new AVIBMethod(res.get('b').properties,cont,[])
        let temp = {"method":tempMethod, "depth":res.get('r').length}
        methodsList.push(temp);
        cont+=1;
      })
      return methodsList;
    })
    .catch(error => {
      session.close();
      throw error;
    });
}

export default expose;