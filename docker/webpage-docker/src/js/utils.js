
import * as d3 from "d3";
import "d3-selection-multi";

export const resetStyle = (d3, element) => {
d3.selectAll(element)
.style("fill", "lightgray");
return d3;
}

export const clearView = (svg) => svg.selectAll("*").remove();

export const removeLinksRelations = (links, nodeId) => {
  return links.reduce((_links, link) => {
    if (link.source.id !== nodeId && link.target.id !== nodeId) {
        _links.push(link);
    }
    return _links;
}, []);
}

export const ticked = (link, node, dataDomain /*edgepaths, edgelabels*/) => {
  //Gets the radius scale
  const radiusScale = d3.scaleLinear()
      .domain(dataDomain)
      .range([10,50]);
  
  //Links the nodes
  link.attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { 
            return calculateX(d.target.x, d.target.y, d.source.x, d.source.y,radiusScale(d.target.firstMetric)); 
        })
        .attr("y2", function (d) { 
            return calculateY(d.target.x, d.target.y, d.source.x, d.source.y, radiusScale(d.target.firstMetric));
        });
  
  node.attr("transform", 
  function (d) {return "translate(" + d.x + ", " + d.y + ")";});

}

export const dragended = (d3, d, simulation) => {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart()
  d.fx = d.x;
  d.fy = d.y;
}
/*
  Creates the arrowhead
 */
export const initDefinitions = (svg) =>
    svg.append('defs')
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

export const forceSimulation = (d3, {width, height}) => d3.forceSimulation()
  .force("link", 
  d3.forceLink()
  .id(function (d) {return d.id;})
  .distance(200)
  .strength(2))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2));

//Gets the x position of the pointed node
function calculateX( tx, ty, sx, sy, radius){
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
function calculateY(tx, ty, sx, sy, radius){
    if(ty == sy) return ty;                 //if the target y == source y, no need to change the target y.
    radius+=8;
    let xLength = Math.abs(tx - sx);    //calculate the difference of x
    let yLength = Math.abs(ty - sy);    //calculate the difference of y
    //calculate the ratio using the trigonometric function
    let ratio = radius / Math.sqrt(xLength * xLength + yLength * yLength);
    if(ty > sy) return ty - yLength * ratio;   //if target y > source y return target x - radius
    if(ty < sy) return ty + yLength * ratio;   //if target y > source y return target x - radius

}