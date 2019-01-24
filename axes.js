// !preview r2d3 data=c(0.3, 0.6, 0.8, 0.95, 0.40, 0.20)
//
// r2d3: https://rstudio.github.io/r2d3
//

var margin = {top: 20, right: 20, bottom: 30, left: 20},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

svg
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          
// Create the scale
var x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width ]);

// Draw the axis
svg
  .append("g")
  .attr("transform", "translate(0," + height + ")")      // This controls the vertical position of the Axis
  .call(d3.axisBottom(x));

// Create the scale
var y = d3.scaleLinear()
    .domain([0, 100])         // This is what is written on the Axis: from 0 to 100
    .range([height, 0]);         // Note it is reversed

// Draw the axis
svg
  .append("g")
  .attr("transform", "translate(" + x(0) + ", 0)")      // This controls the vertical position of the Axis
  .call(d3.axisLeft(y));
