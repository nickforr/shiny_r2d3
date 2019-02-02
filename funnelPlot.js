// !preview r2d3 data=createFunnelData()
//
// r2d3: https://rstudio.github.io/r2d3
//

// Data functions for initial render
var summarydata_circles = data.flSummary;

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

function svg_height() { return parseInt(svg.style('height')) }
function svg_width() { return parseInt(svg.style('width')) }
function panel_width()  { return svg_width() * layer_width; }
function panel_height() { return svg_height() * layer_height; }

function panel_top()  { return svg_height() * layer_top; }
function panel_left() { return svg_width()  * layer_left; }
function panel_right() { return panel_left() +  panel_width(); }

// Title
if (svg.selectAll(".titletext").data("null").empty()) {
  svg.append('text')
  .attr('class', 'titletext')
  .attr('x', svg_width() * 0.01)             
  .attr('y', svg_height() * 0.05)
  .style('font-size', '14px') 
  .style('font-family', 'sans-serif')
  .text('Projection of funding levels');
}

//Sub-title
svg.append('text')
  .attr('x', panel_right())             
  .attr('y', (panel_top() + 0.99 * panel_height()))
  .attr('text-anchor', 'end')
  .style('font-size', '10px') 
  .style('font-family', 'sans-serif')
  .text('10% of individual simulations shown');
    
// set up g elements for each part
// summary lines and circles
var summary_gcheck = svg.selectAll(".summary").data("null");
if (summary_gcheck.empty()) {
  var summary_gcheck = svg.append('g')
      .attr("class", "summary")
      .attr("transform", "translate(" + panel_left() + ", " + (panel_top() + panel_height()) + ");");
}
// sample
var sample_gcheck = svg.selectAll(".sample").data("null");
if (sample_gcheck.empty()) {
  var sample_gcheck = svg.append('g')
      .attr("class", "sample")
      .attr("transform", "translate(" + panel_left() + ", " + (panel_top() + panel_height()) + ");");
}

// render function
r2d3.onRender(function(data, svg, width, height, options) {
  
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
  
  //setup x axis
  var x = d3.scaleLinear()
            .domain(d3.extent(summarydata[0].values, d => d.timestep)).nice()
            .range([0, panel_width()]);
  var x_axis = d3.axisBottom()
                .scale(x);
  var xaxis_check = svg.selectAll(".x_axis").data("null");
  if (xaxis_check.empty()) {
    var xaxis = svg.append('g')
        .attr("class", "x_axis")
        .attr("transform", "translate(" + panel_left() + ", " + (panel_top() + panel_height()) + ")")
        .call(x_axis);
  }

  //setup y axis
  var y = d3.scaleLinear()
          .domain([0,130]).nice()
          .range([panel_height(), 0]);
  var y_axis = d3.axisLeft()
  			        .scale(y);
  var yaxis_check = svg.selectAll(".y_axis").data("null");
  if (yaxis_check.empty()) {
    var yaxis = svg.append('g')
        .attr("class", "y_axis")
        .attr("transform", "translate(" + panel_left() + ", " + panel_top() + ")")
        .call(y_axis);
  }
  
  // summary lines
  var summaryline = d3.line()
            .x(d => x(d.timestep))
            .y(d => y(d.qtileValue));
  
  var summarylines = summary_gcheck.selectAll('path').data(summarydata);
  
  summarylines.enter().append('path')
        .attr('d', d => summaryline(d.values))
        .attr("transform", function(d) {return "translate(" + panel_left() + "," + panel_top() + ")"; })
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
    .attr('d', d => summaryline(d.values));
	
	// summary circles
  var summarycircles = summary_gcheck.selectAll('circle').data(summarydata_circles);
  
  summarycircles.enter().append('circle')
        .attr("transform", function(d) {return "translate(" + panel_left() + "," + panel_top() + ")"; })
        .attr("cx", function (d) { return x(d.timestep); })
        .attr("cy", function (d) { return y(d.qtileValue); })
        .attr("r", 3)
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
  
  // sample lines
  var samplelines = sample_gcheck.selectAll('path').data(sampledata);

  var sampleline = d3.line()
              .x(d => x(d.timestep))
              .y(d => y(d.value));

  samplelines.enter().append('path')
        .attr('d', d => sampleline(d.values))
        .attr("transform", function(d) {return "translate(" + panel_left() + "," + panel_top() + ")"; })
        .style('stroke', '#BEBEBE')
        .style('opacity', "0.2")
        .style('fill', 'none')
        .on("mouseenter", function(){
            d3.select(this)
              .style('stroke-width', "2")
              .style('opacity', "0.8");
        })
        .on("mouseleave", function(){
            d3.select(this)
              .style('stroke-width', "1")
              .style('opacity', "0.2");
        });      
  
  samplelines.exit().remove();
  
  samplelines.transition()
    .duration(500)
    .attr('d', d => sampleline(d.values));

});


