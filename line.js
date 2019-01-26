// !preview r2d3 data=create_dummy_line_data(500, 0.05)
//
// r2d3: https://rstudio.github.io/r2d3
//

var data = d3.nest()
  .key(function(d){
    return d.ref;
  })
  .entries(data);


var duration= 800; 

var margin = {top: 50, right: 50, bottom: 50, left: 50};

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
        .domain(d3.extent(data[0].values, d => d.xval)).nice()
        .range([0, iwidth]);

var x_axis = d3.axisBottom()
			        .scale(x);

// y axis	fns
var y = d3.scaleLinear()
        .domain([0, 120]).nice()
        //.domain([0, 120]).nice()
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


// lines
var line = d3.line()
            .x(d => x(d.xval))
            .y(d => y(d.yval));
let lines = svg.append('g')
  .attr('class', 'lines');

lines.selectAll('.line-group')
  .data(data).enter()
  .append('g')
  .attr('class', 'line-group')  
  .append('path')
  .attr('class', 'line')  
  .attr('d', d => line(d.values))
  .style('stroke', "#69b3a2")
  .style('opacity', "0.25")
  .style('fill', 'none');

