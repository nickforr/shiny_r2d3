// !preview r2d3 data=data.frame(x = c(0, 1, -20, 5), y = c(0, 1, -20, 5))
//
// r2d3: https://rstudio.github.io/r2d3
//

 
// Rendering
r2d3.onRender(function(data, svg, width, height, options) {
  
  var margin = {top: 50, right: 50, bottom: 50, left: 50};
  
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;
  
  var duration= 800; 
  
  var g = svg.selectAll("g").data([null]);
  if (g.empty()) 
    svg = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  // x axis fns
  var x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x)).nice()
      .range([0, width]);
  
  var x_axis = d3.axisBottom()
  			.scale(x);
  
  // y axis	fns
  var y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.y)).nice()
      .range([height, 0]);
  
  var y_axis = d3.axisLeft()
  			.scale(y);
  
  
  // setup and transition x axis
  var xx = svg.selectAll('.x_axis')
      .data(["null"]);
  
  xx.enter()
    .append("g")
    .attr("class", "x_axis")
    .attr("transform", "translate(0," + y(0) + ")")
    //.attr("transform", "translate(0,"+ height + ")")
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
    //.attr("transform", "translate(0,0)")
    .call(y_axis);
    
  yy.exit().remove();
  
  yy.transition()
    .duration(duration)
    .attr("transform", "translate(" + x(0) + ",0)")
    .call(y_axis);


  // points
  var pts = svg.selectAll('circle')
      .data(r2d3.data);
  
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
  
  
  
});
