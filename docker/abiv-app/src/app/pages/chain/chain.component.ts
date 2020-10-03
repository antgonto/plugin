import { Component, OnInit } from '@angular/core';
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
	private dataTest = [
    {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
    {"Framework": "React", "Stars": "150793", "Released": "2013"},
    {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
    {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
    {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
  ];
  svg;
  margin = 50;
  width = 750 - (this.margin * 2);
  height = 400 - (this.margin * 2);

  data:any;
  url:string='bolt://localhost:7687';
  username:string= 'neo4j';
  password:string= 'admin';
  encrypted:boolean=false;

  constructor(private neo4jService : AngularNeo4jService) { }

  ngOnInit(): void {
  	this.neo4jService.connect(this.url,this.username,this.password,this.encrypted)
  		.then(driver =>{
  			if(driver){
  				console.log("Connected succesfully");
  			}
  		});
  	//this.createSvg();
    //this.drawBars(this.dataTest);
    this.getData('Neo4j.Driver.Internal.ConnectionPool.Release');
    //this.createGraphSvg();
    //this.render();
  }

  createGraphSvg(){
    this.svg = d3.select("figure#force-graph")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .call(d3.zoom()
      .on("zoom", ()=> {
          this.svg.attr("transform", d3.event.transform)
      })
    )
    .append("g");
  }

  render(){
    let { links, nodes } = this.data;
    //Clear screen
    this.svg.selectAll("*").remove();
    //Initial Definitions
    this.svg.append('defs')
      .append('marker')
      .attrs({'id':'arrowhead',
          'viewBox':'-0 -5 10 10',
          'refX':5,
          'refY':0,
          'orient':'auto',
          'markerWidth':8,
          'markerHeight':8,
          'xoverflow':'visible'})
      /*.attr("refX", function (d) {console.log()return d.target.x;})
      .attr("refY", function (d) {return d.target.y;})*/
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999')
      .style('stroke','none');

    const simulation= this.forceSimulation(d3, { w,h});
    const dataDomain = this.data.domain;
    const dataDomain2 = this.data.domain2;

    //Sets the radius scale
    const radiusScale = d3.scaleLinear()
      .domain(dataDomain)
      .range([10,50]);

    //Sets the color scale (can be changed to a heatmap)
    let colorScale = d3.scaleQuantize()
        .domain(dataDomain2)
        .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);

    //Creats links with the arrwohead
    const link = this.svg.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr('marker-end','url(#arrowhead)')


    const edgepaths = this.svg.selectAll(".edgepath")
        .data(links)
        .enter()
        .append('path')
        .attrs({
            'class': 'edgepath',
            'fill-opacity': 0,
            'stroke-opacity': 0
        })
        .style("pointer-events", "none");

    //Creates the node
    const node = this.svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("r",function(d){ return radiusScale(d.firstMetric)})
        .call(d3.drag()
               .on("start", (d) => this.dragended(d3, d, simulation))
               .on("drag", function dragged(d :{fx:any,fy:any}) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            })
               .on("end", (d) => this.dragended(d3, d, simulation))
         );
    
    node.append('circle')
        .attr("r",function(d){ return radiusScale(d.firstMetric)}) //radius
        .attr("id", function(d){return d.id});
        
        //.attr("transform", transform(d3.zoomIdentity));
        
    d3.selectAll('circle') //Sets the color at the begining
      .style("fill", function(d: {firstMetric:any}) {return colorScale(d.firstMetric)});
    // create a tooltip
    let  tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("background-color", "black")
      .style("color", "white")
      .style("border-radius", "5px")
      .style("padding", "10px")

    this.svg.selectAll('circle')
    .on('click', function (d) { // arrow function will produce this = undefined
       d3.selectAll('circle')
       //.style("fill", "lightgray");
       .style("fill", function(d:{firstMetric:any}) {return colorScale(d.firstMetric)});
       d3.select(this)
        .style("fill", "aliceblue");
       this.sendNode(d.name);
     })
    .on('mouseover', function (d) {
        d3.selectAll('circle')
          .style("stroke", "black");
        d3.select(this)
          .style("stroke", "green");
        return tooltip
          .text(d.name)
          .style("visibility", "visible")
    })
    .on("mousemove", ($event=>{
        return tooltip
          .style("top", ($event.pageY-10)+"px")
          .style("left",($event.pageX+10)+"px");
     }))
    .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
    });

    node.append("title")
        .text(function (d) {return d.id;});

    simulation
        .nodes(nodes)
        .on("tick", () => { this.ticked(link, node, dataDomain /*dataDomain2*/ /*edgepaths, edgelabels*/)});

    simulation.force("link")
        .links(links);

  }

  forceSimulation(d3, {width, height}): any { 
    const simulation = (d3, {width, height}) => d3.forceSimulation()
      .force("link", 
      d3.forceLink()
      .id(function (d) {return d.id;})
      .distance(200)
      .strength(2))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));
    return simulation;
  }

  ticked (link, node, dataDomain) {
  //Gets the radius scale
    const radiusScale = d3.scaleLinear()
        .domain(dataDomain)
        .range([10,50]);
    
    //Links the nodes
    link.attr("x1", function (d) { return d.source.x; })
          .attr("y1", function (d) { return d.source.y; })
          .attr("x2", (d)=> { 
              return this.calculateX(d.target.x, d.target.y, d.source.x, d.source.y,radiusScale(d.target.firstMetric)); 
          })
          .attr("y2", (d)=> { 
              return this.calculateY(d.target.x, d.target.y, d.source.x, d.source.y, radiusScale(d.target.firstMetric));
          });
    
    node.attr("transform", 
    function (d) {return "translate(" + d.x + ", " + d.y + ")";});

  }

  dragended(d3, d, simulation){
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x;
    d.fy = d.y;
  }


  getData(method){

    this.neo4jService.run('MATCH (m:Metodo {name:'+"'"+method+"'"+'})-[r:CALLS *]->(b) RETURN m,r,b')
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
        this.data.nodes.push({
                       "name":result[i].method.name,
                       "id":result[i].method.id,
                       "label":"Method",
                       "firstMetric": metric,
                       "secondMetric": metric2,
                    });
        
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
      this.createGraphSvg();
      this.render();
      //return this.data;
    })
    .catch(error => {
      this.neo4jService.disconnect();
      console.log(error)
      throw error;
    });
  }

  /*private createSvg(): void {
    this.svg = d3.select("figure#force-graph")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
	}*/

	/*private drawBars(data: any[]): void {
    // Create the X-axis band scale
    const x = d3.scaleBand()
    .range([0, this.width])
    .domain(data.map(d => d.Framework))
    .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
    .domain([0, 200000])
    .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
    .call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg.selectAll("bars")
    .data(data)
    .enter
	}*/

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

  sendNode(nodeSignature){
    console.log(nodeSignature)
  }
}
