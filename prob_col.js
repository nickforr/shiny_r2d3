// !preview r2d3 data=data.frame(y = c(70,80,60,20), x = c(1,2,4,5), label = c('jan', 'feb', 'mar', 'apr'), ylabel = sprintf("%.f%%", c(70,80,60,20)))

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

var cols = svg.selectAll('rect').data(data);

cols.enter().append('rect')
  .attr('height', function(d) {return (d.y * col_height()); })
  .attr('width', col_width())
  .attr('x', function(d, i) {return (i * col_width()) + (svg_width()* layer_left); })
  .attr('y', function(d) {return col_top() + ((actual_max() - d.y) * col_height()); })
  .attr('fill', '#009E73')
  .attr('opacity', 0.5)
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
        .attr('fill', '#ffb14e');
  })
  .on("mouseleave", function(){
      d3.select(this)
        .attr('opacity', 0.5)
        .attr('fill', '#009E73');
  });      
      
cols.exit().remove();

cols.transition()
  .duration(500)
  .attr('height', function(d) {return (d.y * col_height()); })
  .attr('width', col_width())
  .attr('x', function(d, i) {return (i * col_width()) + (svg_width()* layer_left); })
  .attr('y', function(d) {return col_top() + ((actual_max() - d.y) * col_height()); })
  .attr('fill', '#009E73')
  .attr('opacity', 0.5)
  .attr('stroke', 'white');

// Identity labels

var txt = svg.selectAll('text').data(data);

txt.enter().append('text')
    .attr('x', function(d, i) {return (i * col_width()) + (svg_width()* layer_left) + (col_width() * 0.5); })
    .attr('y', function(d) {return svg_height()* 0.95;})
    .style('font-size', '10px') 
    .text(function(d) {return d.label;})
    .style('font-family', 'sans-serif')
    .attr('text-anchor', 'middle');
      
      
txt.exit().remove();

txt.transition()
  .duration(500)
    .attr('x', function(d, i) {return (i * col_width()) + (svg_width()* layer_left) + (col_width() * 0.5); })
    .attr('y', function(d) {return svg_height()* 0.95;})
    .style('font-size', '10px') 
    .text(function(d) {return d.label;})
    .style('font-family', 'sans-serif')
    .attr('text-anchor', 'middle');

// Numeric labels

var totals = svg.selectAll('totals').data(data);

totals.enter().append('text')
      .attr('x', function(d, i) {return (i * col_width()) + (svg_width()* layer_left) + (col_width() * 0.5); })
      .attr('y', function(d) {return (col_top() * 0.9) + ((actual_max() - d.y) * col_height()); })
      .attr('text-anchor', 'middle')
      .style('font-size', '10px') 
      .style('font-family', 'sans-serif')
      .text(function(d) {return d.ylabel; });  
      
totals.exit().remove();

totals.transition()
  .duration(500)
      .attr('x', function(d, i) {return (i * col_width()) + (svg_width()* layer_left) + (col_width() * 0.5); })
      .attr('y', function(d) {return col_top() + ((actual_max() - d.y) * col_height()); })
      .text(function(d) {return d.ylabel; });

// Title
svg.append('text')
  .attr('x', svg_width()* 0.01)             
  .attr('y', svg_height()* 0.05)
  .style('font-size', '16px') 
  .style('font-family', 'sans-serif')
  .text('Probability of success');
 
// y axis...
var y = d3.scaleLinear()
    .domain([0,100]).nice()
    .range([actual_max() * col_height(), 0]);

var y_axis = d3.axisLeft()
			        .scale(y);

var yaxis = svg.append('g')
      .attr("class", "y axis")
      .attr("transform", function(d) {return "translate(" +  svg_width() * layer_left * 0.9 + "," + col_top() + ")"; })
      .call(y_axis);
