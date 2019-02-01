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

var x_axis = d3.axisBottom()
			        .scale(x);

var xaxis_check = svg.selectAll(".x_axis").data(data);

if (xaxis_check.empty()) {
  var xaxis = svg.append('g')
      .attr("class", "x_axis")
      .attr("transform", function(d) {return "translate(" + panel_left() + ", " + (panel_top() + panel_height()) + ")";})// +  svg_width() * layer_left + "," + panel_top() + + ")"; })
      .call(x_axis);
}

// y axis...
var y = d3.scaleLinear()
    .domain([0,140]).nice()
    .range([panel_height(), 0]);

var y_axis = d3.axisLeft()
			        .scale(y);

var yaxis_check = svg.selectAll(".y_axis").data(data);
if (yaxis_check.empty()) {
  var yaxis = svg.append('g')
      .attr("class", "y_axis")
      .attr("transform", function(d) {return "translate(" +  (svg_width() * layer_left) + "," + panel_top() + ")"; })
      .call(y_axis);
}

// add summary lines
var summarylines_gcheck = svg.selectAll("g.summarylines").data(data);
if (summarylines_gcheck.empty()) {
  var summarylines_gcheck = svg.append('g')
      .attr("class", "summarylines");
}
var summarylines = summarylines_gcheck.selectAll('g.summarylines.path').data(summarydata);

var summaryline = d3.line()
            .x(d => x(d.timestep))
            .y(d => y(d.qtileValue));
//console.log(JSON.stringify(summarydata[0]));
summarylines.enter().append('path')
        .attr('d', d => summaryline(d.values))
        .attr("class", "path")
        .attr("transform", function(d) {return "translate(" +  (layer_left * svg_width()) + "," + panel_top() + ")"; })
        .style('stroke', "#6CBCD8FF")
        .style('stroke-width', "2")
        .style('fill', 'none')
        .on("mouseenter", function(){
            d3.select(this)
              .style('stroke', '#97D276FF');
        })
        .on("mouseleave", function(){
            d3.select(this)
              .style('stroke', '#6CBCD8FF');
        });      

summarylines.exit().remove();

summarylines.transition()
  .duration(500)
  .attr('d', d => summaryline(d.values))
  .attr('opacity', 0.5);

// add sample lines
var samplelines_gcheck = svg.selectAll("g.samplelines").data(data);
if (samplelines_gcheck.empty()) {
  var samplelines_gcheck = svg.append('g')
      .attr("class", "samplelines");
}
var samplelines = samplelines_gcheck.selectAll('path').data(sampledata);

var sampleline = d3.line()
            .x(d => x(d.timestep))
            .y(d => y(d.value));
//console.log(JSON.stringify(summarydata[0]));
samplelines.enter().append('path')
        .attr('d', d => sampleline(d.values))
        .attr("class", "path")
        .attr("transform", function(d) {return "translate(" +  (layer_left * svg_width()) + "," + panel_top() + ")"; })
        .style('stroke', '#BEBEBE')
        .style('opacity', "0.2")
        .style('fill', 'none');      

samplelines.exit().remove();

samplelines.transition()
  .duration(500)
  .attr('d', d => sampleline(d.values))
  .attr('opacity', 0.1);

// add circles
var summarycircles_gcheck = svg.selectAll("g.summarycircles").data(data);
if (summarycircles_gcheck.empty()) {
  var summarycircles_gcheck = svg.append('g')
      .attr("class", "summarycircles");
}
var summarycircles = summarycircles_gcheck.selectAll('circle').data(summarydata_circles);
  
summarycircles.enter().append('circle')
        .attr("transform", function(d) {return "translate(" +  (layer_left * svg_width()) + "," + panel_top() + ")"; })
        .attr("class", "path")
        .attr("cx", function (d) { return x(d.timestep); })
        .attr("cy", function (d) { return y(d.qtileValue); })
        .attr("r", 2.0)
        .style("fill", "#6CBCD8FF")
        .on("mouseenter", function(){
            d3.select(this)
              .style('fill', '#97D276FF');
        })
        .on("mouseleave", function(){
            d3.select(this)
              .style('fill', '#6CBCD8FF');
        });      

summarycircles.exit().remove();

summarycircles.transition()
  .duration(500)
  .attr("cx", function (d) { return x(d.timestep); })
  .attr("cy", function (d) { return y(d.qtileValue); });

