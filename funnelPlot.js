// !preview r2d3 data=createFunnelData()
//
// r2d3: https://rstudio.github.io/r2d3
//

var summarydata = d3.nest()
  .key(function(d){
    return d.qtile;
  })
  .entries(data.flSummary);
  
var sampledata = d3.nest()
  .key(function(d){
    return d.sim;
  })
  .entries(data.flSample);
  

var layer_left   = 0.1;
    layer_top    = 0.1;
    layer_height = 0.8;
    layer_width  = 0.85;

function svg_height() {return parseInt(svg.style('height'))}
function svg_width() {return parseInt(svg.style('width'))}
function actual_max() {return 140; }
function col_width()  {return svg_width()  / data.length * layer_width;}
function col_height() {return (svg_height() / actual_max()) * layer_height; }

function col_top()  {return svg_height() * layer_top; }
function col_left() {return svg_width()  * layer_left;}

// x axis
var x = d3.scaleLinear()
    .domain(d3.extent(summarydata[0].values, d => d.timestep)).nice()
        .range([col_left(), 500]);

// y axis...
var y = d3.scaleLinear()
    .domain([0,140]).nice()
    .range([actual_max() * col_height(), 0]);

var y_axis = d3.axisLeft()
			        .scale(y);

var yaxis_check = svg.selectAll(".y_axis").data(data);
if (yaxis_check.empty()) {
  var yaxis = svg.append('g')
      .attr("class", "y_axis")
      .attr("transform", function(d) {return "translate(" +  svg_width() * layer_left + "," + col_top() + ")"; })
      .call(y_axis);
}

// add summary lines
var summarylines_gcheck = svg.selectAll("g.summarylines").data(data);
if (summarylines_gcheck.empty()) {
  var summarylines_gcheck = svg.append('g')
      .attr("class", "summarylines");
}
var summarylines = summarylines_gcheck.selectAll('g.summarylines').data(summarydata);

var summaryline = d3.line()
            .x(d => x(d.timestep))
            .y(d => y(d.qtileValue));
//console.log(JSON.stringify(summarydata[0]));
summarylines.enter().append('path')
        .attr('d', d => summaryline(d.values))
        .attr("transform", function(d) {return "translate(" +  layer_left + "," + col_top() + ")"; })
        .style('stroke', "#69b3a2")
        .style('opacity', "0.55")
        .style('fill', 'none')
        .on("mouseenter", function(){
            d3.select(this)
              .attr('opacity', 1)
              .attr('stroke', '#ffb14e');
        })
        .on("mouseleave", function(){
            d3.select(this)
              .attr('opacity', 0.5)
              .attr('stroke', '#009E73');
        });      

summarylines.exit().remove();

summarylines.transition()
  .duration(500)
  .attr('opacity', 0.5);

// add sample lines
var samplelines_gcheck = svg.selectAll("g.samplelines").data(data);
if (samplelines_gcheck.empty()) {
  var samplelines_gcheck = svg.append('g')
      .attr("class", "samplelines");
}
var samplelines = samplelines_gcheck.selectAll('g.samplelines').data(sampledata);

var sampleline = d3.line()
            .x(d => x(d.timestep))
            .y(d => y(d.value));
//console.log(JSON.stringify(summarydata[0]));
samplelines.enter().append('path')
        .attr('d', d => sampleline(d.values))
        .attr("transform", function(d) {return "translate(" +  layer_left + "," + col_top() + ")"; })
        .style('stroke', '#009E73')
        .style('opacity', "0.1")
        .style('fill', 'none')
        .on("mouseenter", function(){
            d3.select(this)
              .attr('opacity', 1)
              .attr('stroke', '#ffb14e');
        })
        .on("mouseleave", function(){
            d3.select(this)
              .attr('opacity', 0.5)
              .attr('stroke', '#009E73');
        });      

samplelines.exit().remove();

samplelines.transition()
  .duration(500)
  .attr('opacity', 0.1);
