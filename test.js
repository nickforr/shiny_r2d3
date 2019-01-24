// !preview r2d3 data=c(0.3, 0.6, 0.8, 0.95, 0.40, 0.20)
//
// r2d3: https://rstudio.github.io/r2d3
//


var margin = {top: 20, right: 100, bottom: 50, left: 50},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

var svg = r2d3.svg
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

var g = svg
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          
// Create the scale
var x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);

// Draw the axis
g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(" + 0 + "," + height + ")")      // This controls the vertical position of the Axis
  .call(d3.axisBottom(x));

// Create the scale
var y = d3.scaleLinear()
    .domain([0, 100])         // This is what is written on the Axis: from 0 to 100
    .range([height, 0]);         // Note it is reversed

// Draw the axis
svg
  .append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(" + x(0) + ", 0)")      // This controls the vertical position of the Axis
  .call(d3.axisLeft(y));
