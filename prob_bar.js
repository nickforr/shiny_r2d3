// !preview r2d3 data=data.frame(x = c(0, 1, -5, 5), y = c(0, 1, -5, 5))
//
// r2d3: https://rstudio.github.io/r2d3
//

var pts = r2d3.svg.selectAll('circle')
    .data(r2d3.data);

var margin = {top: 40, right: 40, bottom: 40, left: 80},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

svg
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
var duration = 800; 

// x axis
var x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x)).nice()
    .range([0, width]);

var x_axis = d3.axisBottom()
			.scale(x);

// y axis			
var y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.y))//.nice()
    .range([height, 0]);

var y_axis = d3.axisLeft()
			.scale(y);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0,"+ y(0) + ")");
 
svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + x(0) + ",0)");
    
pts.enter()
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
  
svg.select('.x.axis')
    .transition()
    .duration(duration)
    .call(x_axis);
    
svg.select('.y.axis')
    .transition()
    .duration(duration)
    .call(y_axis);


