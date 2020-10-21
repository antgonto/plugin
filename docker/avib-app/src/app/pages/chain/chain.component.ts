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
      
    this.color = d3.scaleQuantize<string>()
        .domain(this.data.domain2)
        .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);
    
    this.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { 
            let temp :any = d;
            return temp.id; 
         })
          .distance(200)
          .strength(2)
        )
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(this.width / 2, this.height / 2));
    
    this.render(this.data);
  }

  render(graph){
    const radiusScale = d3.scaleLinear()
      .domain(this.data.domain)
      .range([10,50]);


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
        .attr("id", function(d){return d.id})
        .attr("r",(d)=>{ return radiusScale(d.firstMetric)})
        .attr("fill", (d)=> {return this.color(d.firstMetric)})
        .call(d3.drag()
            .on("start", (event,d)=>{return this.dragstarted(event,d)})
            .on("drag", (event,d)=>{return this.dragged(event,d)})
            .on("end", (event,d)=>{return this.dragended(event,d)})
        );
    let  tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("background-color", "black")
      .style("color", "white")
      .style("border-radius", "5px")
      .style("padding", "10px")

    //Display tooltip
    this.svg.selectAll('circle')
        .on('click', function (event,d) { // arrow function will produce this = undefined
           d3.selectAll('circle')
           //.style("fill", "lightgray");
           .style("fill", (d)=> {
             let temp:any;
             temp=d;
             return this.color(temp.firstMetric)
           });
           d3.select(this)
            .style("fill", "aliceblue");
           this.sendNode(d.name);
         })
        .on('mouseover', function (event,d) {
            d3.selectAll('circle')
              .style("stroke", "black");
            d3.select(this)
              .style("stroke", "green");
            return tooltip
              .text(d.name)
              .style("visibility", "visible")
        })
        .on("mousemove", function(event:MouseEvent){
            return tooltip
              .style("top", (event.clientY-10)+"px")
              .style("left",(event.clientX+10)+"px");
         })
        .on("mouseout", function(){
            return tooltip.style("visibility", "hidden");
        });

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
    const radiusScale = d3.scaleLinear()
      .domain(this.data.domain)
      .range([10,50]);
  
    this.link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", (d)=> { 
            return this.calculateX(d.target.x, d.target.y, d.source.x, d.source.y,radiusScale(d.target.firstMetric)); 
        })
        .attr("y2", (d)=> { 
            return this.calculateY(d.target.x, d.target.y, d.source.x, d.source.y, radiusScale(d.target.firstMetric));
        });

    this.node.attr("transform", function (d) {return "translate(" + d.x + ", " + d.y + ")";});
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

  calculateX( tx, ty, sx, sy, radius){
      if(tx == sx) return tx;                 //if the target x == source x, no need to change the target x.

      radius+=8;
      let xLength = Math.abs(tx - sx);    //calculate the difference of x
      let yLength = Math.abs(ty - sy);    //calculate the difference of y
      //calculate the ratio using the trigonometric function
      let ratio = radius / Math.sqrt(xLength * xLength + yLength * yLength);
      if(tx > sx)  return tx - xLength * ratio;    //if target x > source x return target x - radius
      if(tx < sx) return  tx + xLength * ratio;    //if target x < source x return target x + radius

  }

  //Gets the y position of the pointed node
  calculateY(tx, ty, sx, sy, radius){
      if(ty == sy) return ty;                 //if the target y == source y, no need to change the target y.
      radius+=8;
      let xLength = Math.abs(tx - sx);    //calculate the difference of x
      let yLength = Math.abs(ty - sy);    //calculate the difference of y
      //calculate the ratio using the trigonometric function
      let ratio = radius / Math.sqrt(xLength * xLength + yLength * yLength);
      if(ty > sy) return ty - yLength * ratio;   //if target y > source y return target x - radius
      if(ty < sy) return ty + yLength * ratio;   //if target y > source y return target x - radius

  }
}
