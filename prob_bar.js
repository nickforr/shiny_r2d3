// !preview r2d3 data=data.frame(x = c(0, 1, 2, 3, 4), y = c(0, 0.3, 0.5, 0.6, 0.8))
//
// r2d3: https://rstudio.github.io/r2d3
//

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
var x = d3.scaleBand()
    .domain(d3.range(data.length))
    .rangeRound([0, iwidth])
    .padding(0.2);

var x_axis = d3.axisBottom()
			.scale(x);

// y axis	fns
var y = d3.scaleLinear()
    .domain([0,1]).nice()
    .range([iheight, 0]);

var y_axis = d3.axisLeft()
			.scale(y);

  
// setup and transition x axis
var xx = svg.selectAll('.x_axis')
    .data(["null"]);

xx.enter()
  .append("g")
  .attr("class", "x_axis")
  .attr("transform", "translate(0,"+ iheight + ")")
  .call(x_axis);
  
xx.exit().remove();

xx.transition()
  .duration(duration)
  .attr("transform", "translate(0,"+ iheight + ")")
  .call(x_axis);
    
    
// setup and transition y axis
var yy = svg.selectAll('.y_axis')
    .data(["null"]);

yy.enter()
  .append("g")
  .attr("class", "y_axis")
  .attr("transform", "translate(0,0)")
  .call(y_axis);
  
yy.exit().remove();
  
yy.transition()
  .duration(duration)
  .attr("transform", "translate(0,0)")
  .call(y_axis);


// bars
var cols = svg.selectAll('rect')
  .data(r2d3.data);
  
cols.enter()
  .append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d.y); })
    .attr("height", function(d) { return iheight - y(d.y); })
    .style("fill", "#69b3a2");

cols.exit().remove();

cols.transition()
  .duration(100)
  .attr("x", function(d) { return x(d.x); })
  .attr("width", x.bandwidth())
  .attr("y", function(d) { return y(d.y); })
  .attr("height", function(d) { return iheight - y(d.y); })
  .style("fill", "#69b3a2");
  
  
