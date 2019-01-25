// !preview r2d3 data=data.frame(x = c(0, 1, -5, 5), y = c(0, 1, -5, 5))
//
// r2d3: https://rstudio.github.io/r2d3
//

var pts = svg.selectAll('circle')
    .data(r2d3.data);

var duration = 800; 

// x axis
var x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x)).nice()
    .range([0, width]);

var x_axis = d3.axisBottom()
			.scale(x);

// y axis			
var y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.y)).nice()
    .range([height, 0]);

var y_axis = d3.axisLeft()
			.scale(y);

svg
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0,"+ height - 50 + ")")
    .call(x_axis);
 
svg
  .append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(20,20)")
    .call(y_axis);
   
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
  
svg
  .select('.x.axis')
    .transition()
    .duration(duration)
    //.attr("transform", "translate(0,"+ y(0) + ")")
    .call(x_axis);
    
svg
  .select('.y.axis')
    .transition()
    .duration(duration)
    //.attr("transform", "translate(" + x(0) + ",0)")
    .call(y_axis);


