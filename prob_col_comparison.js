// !preview r2d3 data=data.frame(yorig = c(40, 70, 20, 90), y = c(70,80,60,20), x = c(1,2,4,5), label = c('jan', 'feb', 'mar', 'apr'), ylabel = sprintf("%.f%%", c(70,80,60,20)))

var layer_left   = 0.1;
    layer_top    = 0.1;
    layer_height = 0.8;
    layer_width  = 0.85;

function svg_height() {return parseInt(svg.style('height'))}
function svg_width() {return parseInt(svg.style('width'))}
function actual_max() {return 100; }
function col_width()  {return svg_width()  / data.length * layer_width;}
function col_height() {return (svg_height() / actual_max()) * layer_height; }

function col_top()  {return svg_height() * layer_top; }
function col_left() {return svg_width()  * layer_left;}

// add columns
var cols_gcheck = svg.selectAll("g.cols").data(data);
if (cols_gcheck.empty()) {
  var cols_gcheck = svg.append('g')
      .attr("class", "cols");
}
var cols = cols_gcheck.selectAll('rect').data(data);

cols.enter().append('rect')
  .attr('height', function(d) {return (d.y * col_height()); })
  .attr('width', col_width())
  .attr('x', function(d, i) {return (i * col_width()) + (svg_width()* layer_left); })
  .attr('y', function(d) {return col_top() + ((actual_max() - d.y) * col_height()); })
  .attr('fill', '#97D276')
  .attr('opacity', 1)
  .attr('stroke', 'white')
  .attr('d', function(d) { return d.x; })
  .on("click", function(){
    Shiny.setInputValue(
      "column_clicked", 
      d3.select(this).attr("d"),
      {priority: "event"}
    );
  })    
  .on("mouseenter", function(){
      d3.select(this)
        .attr('opacity', 1)
        .attr('fill', '#F73D96');
  })
  .on("mouseleave", function(){
      d3.select(this)
        .attr('opacity', 1)
        .attr('fill', '#97D276');
  });      
      
cols.exit().remove();

cols.transition()
  .duration(500)
  .attr('height', function(d) {return (d.y * col_height()); })
  .attr('width', col_width())
  .attr('x', function(d, i) {return (i * col_width()) + (svg_width()* layer_left); })
  .attr('y', function(d) {return col_top() + ((actual_max() - d.y) * col_height()); });

// Add circles 
var circles = cols_gcheck.selectAll('circle').data(data);

cols.enter().append('circle')
  //.attr('height', function(d) {return (d.y * col_height()); })
  //.attr('width', col_width())
  .attr("cx", function(d, i) {return ((i + 0.5) * col_width()) + (svg_width() * layer_left); })
  .attr("cy", function(d) {return col_top() + ((actual_max() - d.yorig) * col_height()); })
  .attr("r", 8.0)
  .attr('opacity', 0.5)
  .style("fill", "none")
  .style("stroke-width", 3)
  .style("stroke-dasharray", ("7, 3")) // make the stroke dashed
  .attr('stroke', 'grey');

// Identity labels
var labels_gcheck = svg.selectAll("g.labels").data(data);
if (labels_gcheck.empty()) {
  var labels_gcheck = svg.append('g')
      .attr("class", "labels");
}
var txt = labels_gcheck.selectAll('text').data(data);

txt.enter().append('text')
    .attr('x', function(d, i) {return (i * col_width()) + (svg_width()* layer_left) + (col_width() * 0.5); })
    .attr('y', function(d) {return svg_height()* 0.95;})
    .text(function(d) {return d.label;})
    .attr('text-anchor', 'middle')
    .style('font-size', '12px') 
    .style('font-family', 'sans-serif');
    
      
      
txt.exit().remove();

txt.transition()
  .duration(500)
    .attr('x', function(d, i) {return (i * col_width()) + (svg_width()* layer_left) + (col_width() * 0.5); })
    .attr('y', function(d) {return svg_height()* 0.95;})
    .text(function(d) {return d.label;});

// Numeric labels
var total_gcheck = svg.selectAll("g.totals").data(data);

if (total_gcheck.empty()) {
  var total_gcheck = svg.append('g')
      .attr("class", "totals");
}
var totals = total_gcheck.selectAll('text').data(data);

totals.enter().append('text')
      .attr('x', function(d, i) {return (i * col_width()) + (svg_width()* layer_left) + (col_width() * 0.5); })
      .attr('y', function(d) {return (col_top() * 0.9) + ((actual_max() - d.y) * col_height()); })
      .attr('text-anchor', 'middle')
      .style('font-size', '12px') 
      .style('font-family', 'sans-serif')
      .text(function(d) {return d.ylabel; });  

totals.exit().remove();

totals.transition()
  .duration(500)
      .attr('x', function(d, i) {return (i * col_width()) + (svg_width()* layer_left) + (col_width() * 0.5); })
      .attr('y', function(d) {return col_top() + ((actual_max() - d.y) * col_height()); })
      .text(function(d) {return d.ylabel; });

// y axis...
var y = d3.scaleLinear()
    .domain([0,100]).nice()
    .range([actual_max() * col_height(), 0]);

var y_axis = d3.axisLeft()
			        .scale(y);

var yaxis_check = svg.selectAll(".y_axis").data(data);
if (yaxis_check.empty()) {
  var yaxis = svg.append('g')
      .attr("class", "y_axis")
      .attr("transform", function(d) {return "translate(" +  svg_width() * layer_left * 0.9 + "," + col_top() + ")"; })
      .style('font-size', '12px') 
      .call(y_axis);
}

// Title
if (svg.selectAll(".titletext").data("null").empty()) {
  svg.append('text')
  .attr('class', 'titletext')
  .attr('x', svg_width()* 0.01)             
  .attr('y', svg_height()* 0.05)
  .style('font-size', '16px') 
  .style('font-family', 'sans-serif')
  .text('Probability of success');
}

