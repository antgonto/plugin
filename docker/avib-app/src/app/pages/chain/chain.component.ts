import { 
  Component,
  OnInit
} from '@angular/core';
//import { Neo4jService } from '../../services/neo4j.service';
import * as d3 from 'd3';
import { AvibMethod } from '../../models/avib-method';

import { AngularNeo4jService } from 'angular-neo4j';

@Component({
  selector: 'app-chain',
  templateUrl: './chain.component.html',
  styleUrls: ['./chain.component.scss']
})
export class ChainComponent implements OnInit {
  metric1="1"
  metric2="2"
	
  margin = 50;
  width :number;
  height :number;
  svg:any;
  color:any;
  simulation:any;
  link:any;
  node:any;

  data:any;
  url:string='bolt://localhost:7687';
  username:string= 'neo4j';
  password:string= 'admin';
  encrypted:boolean=false;

  constructor(private neo4jService : AngularNeo4jService) { }

  ngOnInit(): void {
    //Get screen size
    this.width = window.innerWidth;
    this.height = window.innerHeight;

  	this.neo4jService.connect(this.url,this.username,this.password,this.encrypted)
  		.then(driver =>{
  			if(driver){
  				console.log("Connected succesfully");
  			}
  		});
    this.getData('Neo4j.Driver.Internal.ConnectionPool.Release');
  }

  createGraphSvg(){
    let transform;
    this.svg = d3.select("svg")
      .attr("width",this.width-10)
      .attr("height",this.height-100)
      
    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    
    this.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { 
            let temp :any = d;
            return temp.id; 
         }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(this.width / 2, this.height / 2));
    
    this.render(this.data);
  }

  render(graph){
    this.link = this.svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    this.node = this.svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
        .attr("r", 5)
        .attr("fill", (d)=> { return this.color(d.group); })
        .call(d3.drag()
            .on("start", (event,d)=>{return this.dragstarted(event,d)})
            .on("drag", (event,d)=>{return this.dragged(event,d)})
            .on("end", (event,d)=>{return this.dragended(event,d)})
        );

    this.node.append("title")
      .text(function(d) { return d.id; });

    this.simulation
      .nodes(graph.nodes)
      .on("tick", ()=>{return this.ticked()});

    this.simulation.force("link")
      .links(graph.links);  
  }

  async getData(method){

    await this.neo4jService.run('MATCH (m:Metodo {name:'+"'"+method+"'"+'})-[r:CALLS *]->(b) RETURN m,r,b')
    .then((result)=>{
      let mainMethod=null;
      let methodsList=[];
      let cont = 1;
      result.map(res=>{
        if(mainMethod==null){
          mainMethod = new AvibMethod(res[0].properties,0,[]);
          methodsList.push({"method":mainMethod, "depth":0});
        }
        let tempMethod = new AvibMethod(res[2].properties,cont,[])
        let temp = {"method":tempMethod, "depth":res[1].length}
        methodsList.push(temp);
        cont+=1;
      })
      result = methodsList;
      this.data = {"nodes":[],"links":[], "domain":[], "domain2":[]}

      //Creates the nodes and the metrics
      let min= Number.MAX_SAFE_INTEGER;
      let max = Number.MIN_SAFE_INTEGER;
      let min2= Number.MAX_SAFE_INTEGER;
      let max2 = Number.MIN_SAFE_INTEGER;

      cont = 1;
      for (let i = 0; i < result.length; i++) {
        if(result[i].depth==1){ //Used to create the links for the main node
          
          cont+=1
          this.data.links.push({
                    "id": cont,
                    "source": 0,
                    "target": result[i].method.id,
                    //"type": "CALLS"
                  });
        }
        //let metric = result[i].method.icrlavg;
        let metric = this.getMetric(this.metric1,result[i].method);
        let metric2 = this.getMetric(this.metric2,result[i].method);

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
        this.data.nodes.push(
          {
           "name":result[i].method.name,
           "id":result[i].method.id,
           "label":"Method",
           "firstMetric": metric,
           "secondMetric": metric2,
          }
        );
        
      }

      this.data.domain.push(min);
      this.data.domain.push(max);
      this.data.domain2.push(min2);
      this.data.domain2.push(max2);

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
              this.data.links.push(temp);
           }
           else if(result[i].depth== result[j].depth){
             break;
           }
        }
      }
    })
    .catch(error => {
      this.neo4jService.disconnect();
      console.log(error)
      throw error;
    });
    this.createGraphSvg();
  }

  getMetric(type,method){
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

  dragged(event,d) {
    d.fx = event.x;
    d.fy = event.y;
    d3.pack
  }

  ticked() {
    this.link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    this.node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
  
  dragended(event,d) {
    if (!event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  dragstarted(event,d) {
    if (!event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  sendNode(nodeSignature){
    console.log(nodeSignature)
  }
}
