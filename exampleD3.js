const hello = d3.select("body")

d3.select(".nodeCircle").attr("cx", coord[0]).attr("cy", coord[1]);

// or

d3.select(".nodeCircle")
    .attr("cx", coord[0])
    .attr("cy", coord[1]);

d3.select("#nodeColorOptions") // d3.selectAll("div")
    .append("button") // d3.insert("a", "b")
    .attr("style", "background-color: " + color + ";")
    .attr("class", "selector nodeColor off")
    .attr("id", "nodeColor-"+color)
    .attr("onclick", "setNodeColor('"+color+"')")
    .text("\xa0")
    .style("color", "red")
