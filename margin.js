var pagePadding = options && options.margin !== null ? options.margin : 75;

svg = svg.append("g")
.attr('transform', 'translate(' + pagePadding + ',' + pagePadding + ')');

width = width - pagePadding * 2;
height = height - pagePadding * 2;
