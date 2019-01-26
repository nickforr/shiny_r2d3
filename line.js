// !preview r2d3 data=data.frame(x = c(0, 1, -20, 5), y = c(0, 1, -20, 5))
//
// r2d3: https://rstudio.github.io/r2d3
//

var data = [
  {
    name: "USA",
    values: [
      {date: "2000", price: "100"},
      {date: "2001", price: "110"},
      {date: "2002", price: "145"},
      {date: "2003", price: "241"},
      {date: "2004", price: "101"},
      {date: "2005", price: "90"},
      {date: "2006", price: "10"},
      {date: "2007", price: "35"},
      {date: "2008", price: "21"},
      {date: "2009", price: "201"}
    ]
  },
  {
    name: "Canada",
    values: [
      {date: "2000", price: "200"},
      {date: "2001", price: "120"},
      {date: "2002", price: "33"},
      {date: "2003", price: "21"},
      {date: "2004", price: "51"},
      {date: "2005", price: "190"},
      {date: "2006", price: "120"},
      {date: "2007", price: "85"},
      {date: "2008", price: "221"},
      {date: "2009", price: "101"}
    ]
  },
  {
    name: "Maxico",
    values: [
      {date: "2000", price: "50"},
      {date: "2001", price: "10"},
      {date: "2002", price: "5"},
      {date: "2003", price: "71"},
      {date: "2004", price: "20"},
      {date: "2005", price: "9"},
      {date: "2006", price: "220"},
      {date: "2007", price: "235"},
      {date: "2008", price: "61"},
      {date: "2009", price: "10"}
    ]
  }
];

data.forEach(function(d) { 
  d.values.forEach(function(d) {
    d.date = +d.date;
    d.price = +d.price;    
  });
});


var duration= 800; 

var margin = {top: 50, right: 50, bottom: 50, left: 50};

var iwidth = parseInt(svg.style('width'), 10) - margin.left - margin.right;
var iheight = parseInt(svg.style('height'), 10) - margin.top - margin.bottom;

var g = svg.selectAll("g").data([null]);
if (g.empty()) { 
  svg = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
} 

// x axis fns
var x = d3.scaleLinear()
        .domain(d3.extent(data[0].values, d => d.date)).nice()
        .range([0, iwidth]);

var x_axis = d3.axisBottom()
			        .scale(x);

// y axis	fns
var y = d3.scaleLinear()
        .domain(d3.extent(data[0].values, d => d.price)).nice()
        //.domain([0, 120]).nice()
        .range([iheight, 0]);

var y_axis = d3.axisLeft()
			        .scale(y);
			        
// setup and transition x axis
var xx = svg.selectAll('.x_axis')
          .data(["null"]);

xx.enter()
  .append("g")
  .attr("class", "x_axis")
  .attr("transform", "translate(0,"+ iheight + ")")
  .call(x_axis);
  
xx.exit().remove();

xx.transition()
  .duration(duration)
  .attr("transform", "translate(0,"+ iheight + ")")
  .call(x_axis);
  
// setup and transition y axis
var yy = svg.selectAll('.y_axis')
          .data(["null"]);

yy.enter()
  .append("g")
  .attr("class", "y_axis")
  .attr("transform", "translate(0,0)")
  .call(y_axis);
  
yy.exit().remove();

yy.transition()
  .duration(duration)
  .attr("transform", "translate(0,0)")
  .call(y_axis);


// lines
var line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.price));
let lines = svg.append('g')
  .attr('class', 'lines');

lines.selectAll('.line-group')
  .data(data).enter()
  .append('g')
  .attr('class', 'line-group')  
  .append('path')
  .attr('class', 'line')  
  .attr('d', d => line(d.values))
  .style('stroke', "#69b3a2")
  .style('opacity', "0.25")
  .style('fill', 'none');

