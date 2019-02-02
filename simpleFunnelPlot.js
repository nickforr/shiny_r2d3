// !preview r2d3 data=createFunnelData()
//
// r2d3: https://rstudio.github.io/r2d3
//

var summarydata = d3.nest()
  .key(function(d){
    return d.qtile;
  })
  .entries(data.flSummary);

var summarydata_circles = data.flSummary;
//console.log(JSON.stringify(summarydata_circles));
var sampledata = d3.nest()
  .key(function(d){
    return d.sim;
  })
  .entries(data.flSample);
  

var layer_left   = 0.1;
    layer_top    = 0.1;
    layer_height = 0.8;
    layer_width  = 0.85;

function svg_height() { return parseInt(svg.style('height')) }
function svg_width() { return parseInt(svg.style('width')) }
function panel_width()  { return svg_width() * layer_width; }
function panel_height() { return svg_height() * layer_height; }

function panel_top()  { return svg_height() * layer_top; }
function panel_left() { return svg_width()  * layer_left; }

// x axis
var x = d3.scaleLinear()
    .domain(d3.extent(summarydata[0].values, d => d.timestep)).nice()
    .range([0, panel_width()]);

// y axis...
var y = d3.scaleLinear()
    .domain([0,140]).nice()
    .range([panel_height(), 0]);

// add summary lines
var summarylines_gcheck = svg.selectAll("g.summarylines").data(data);
console.log(summarylines_gcheck.empty());
if (summarylines_gcheck.empty()) {
  console.log("hello");
  var summarylines_gcheck = svg.append('g')
      .attr("class", "summarylines")
      .attr("transform", function(d) {return "translate(" + panel_left() + ", " + panel_top() + ")";});// + ;
}
