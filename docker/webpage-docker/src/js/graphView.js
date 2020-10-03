
import * as d3 from "d3";
import "d3-selection-multi";
import {mockedData, 
    clearView, 
    removeLinksRelations, 
    ticked, 
    dragended,
    initDefinitions,
    forceSimulation
} from './utils';
import '../css/style.css';
import socketio from 'socket.io-client';
import {updateSelf} from './index'


export const SOCKET = socketio('http://localhost:1617');
let hasTeam= false;

const svg = d3.select("svg")
            .call(d3.zoom().on("zoom", function () {
              svg.attr("transform", d3.event.transform)
            }))
            .append("g");

const width = $("svg").width();
const height = $("svg").height();

export const render = (data) => {
    let { links, nodes } = data;
    clearView(svg); // removes everything! 
    initDefinitions(svg);
    const simulation = forceSimulation(d3, {width,height});
    const dataDomain = data.domain;
    const dataDomain2 =data.domain2;

    //Sets the radius scale
    const radiusScale = d3.scaleLinear()
      .domain(dataDomain)
      .range([10,50]);

    //Sets the color scale (can be changed to a heatmap)
    let colorScale = d3.scaleQuantize()
        .domain(dataDomain2)
        .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);

    //Creats links with the arrwohead
    const link = svg.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr('marker-end','url(#arrowhead)')


    const edgepaths = svg.selectAll(".edgepath")
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
    const node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("r",function(d){ return radiusScale(d.firstMetric)})
        .call(d3.drag()
               .on("start", (d) => dragended(d3, d, simulation))
               .on("drag", function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            })
               .on("end", (d) => dragended(d3, d, simulation))
         );
    
    node.append('circle')
        .attr("r",function(d){ return radiusScale(d.firstMetric)}) //radius
        .attr("id", function(d){return d.id});
        
        //.attr("transform", transform(d3.zoomIdentity));
        
    d3.selectAll('circle') //Sets the color at the begining
      .style("fill", function(d) {return colorScale(d.firstMetric)});
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

    svg.selectAll('circle')
    .on('click', function (d) { // arrow function will produce this = undefined
       d3.selectAll('circle')
       //.style("fill", "lightgray");
       .style("fill", function(d) {return colorScale(d.firstMetric)});
       d3.select(this)
        .style("fill", "aliceblue");
       sendNode(d.name);
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
    .on("mousemove", function(){
        return tooltip
          .style("top", (event.pageY-10)+"px")
          .style("left",(event.pageX+10)+"px");
     })
    .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
    });

    node.append("title")
        .text(function (d) {return d.id;});

    simulation
        .nodes(nodes)
        .on("tick", () => { ticked(link, node, dataDomain, dataDomain2 /*edgepaths, edgelabels*/)});

    simulation.force("link")
        .links(links);
}

function sendNode(nodeSignature){
  console.log(hasTeam);
  if(hasTeam && nodeSignature!= undefined){
    let temp = {
      query: nodeSignature,
      metric1: "1",
      metric2: "2",
    }
    SOCKET.emit('teamClick',JSON.stringify(temp));
    console.log("Emmitted team click.");
    updateSelf(temp);
  }
  else if(nodeSignature!= undefined){
    SOCKET.emit('nodeClicked', nodeSignature);
  }
}


export const setTeam = (value) =>{
  hasTeam = value;
}


