// !preview r2d3 data=data.frame(x = c(0, 1, -20, 5), y = c(0, 1, -20, 5))
//
// r2d3: https://rstudio.github.io/r2d3
//
//console.log(JSON.stringify(data));
var duration= 1000; 

var margin = {top: 50, right: 50, bottom: 50, left: 50};

//console.log(width + ", " + parseInt(svg.style('width'), 10));
var iwidth = parseInt(svg.style('width'), 10) - margin.left - margin.right;
var iheight = parseInt(svg.style('height'), 10) - margin.top - margin.bottom;

var g = svg.selectAll("g").data([null]);
if (g.empty()) { 
  svg = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
} 

// x axis fns
var x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.x)).nice()
        .range([0, iwidth]);
//console.log(iwidth);
var x_axis = d3.axisBottom()
  			     .scale(x);
  
// y axis	fns
var y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.y)).nice()
        .range([iheight, 0]);
  
var y_axis = d3.axisLeft()
  			    .scale(y);
 
// setup and transition x axis
var xx = svg.selectAll('.x_axis')
          .data(["null"]);

xx.enter()
  .append("g")
  .attr("class", "x_axis")
  .attr("transform", "translate(0," + y(0) + ")")
  .call(x_axis);
    
xx.exit().remove();
  
xx.transition()
  .duration(duration)
  .attr("transform", "translate(0,"+ y(0) + ")")
  .call(x_axis);
    
    
// setup and transition y axis
var yy = svg.selectAll('.y_axis')
          .data(["null"]);

yy.enter()
  .append("g")
  .attr("class", "y_axis")
  .attr("transform", "translate(" + x(0) + ",0)")
  .call(y_axis);
  
yy.exit().remove();
  
yy.transition()
  .duration(duration)
  .attr("transform", "translate(" + x(0) + ",0)")
  .call(y_axis);
  			
// points
var pts = svg.selectAll('circle')
          .data(data);  			

pts.enter()
  .append("g")
  .attr("class", "circle")
  .append('circle')
  .attr("cx", function (d) { return x(d.x); })
  .attr("cy", function (d) { return y(d.y); })
  .attr("r", 2.0)
  .style("fill", "#69b3a2");
        
pts.exit().remove();
  
pts.transition()
  .duration(duration)
  .attr("cx", function (d) { return x(d.x); })
  .attr("cy", function (d) { return y(d.y); });


//r2d3.onResize(function() {
//  var newwidth = parseInt(svg.style('width'), 10);
//  console.log(newwidth);
//});

