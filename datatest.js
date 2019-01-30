// !preview r2d3 data=jsonlite::toJSON(data.frame(x = c(0, 1, 2, 3, 4), y = c(0, 0.3, 0.5, 0.6, 0.8)))
//
// r2d3: https://rstudio.github.io/r2d3
//

//a <- jsonlite::fromJSON('[{"a":{"c":[{"x":0,"y":0},{"x":1,"y":0.3},{"x":2,"y":0.5},{"x":3,"y":0.6},{"x":4,"y":0.8}],"b":["hello"]}}]')
//jsonlite::toJSON(list(a = data.frame(x = c(0, 1, 2, 3, 4), y = c(0, 0.3, 0.5, 0.6, 0.8)), b = list("hello")))

console.log(JSON.stringify(data));
var barHeight = Math.ceil(height / data.length);

svg.selectAll('rect')
  .data(data)
  .enter().append('rect')
    .attr('width', function(d) { return d * width; })
    .attr('height', barHeight)
    .attr('y', function(d, i) { return i * barHeight; })
    .attr('fill', 'steelblue');
