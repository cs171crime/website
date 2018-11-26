Treemap = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;

	this.initVis();
}


/*
 * Initialize visualization (static content; e.g. SVG area, axes, brush component)
 */

Treemap.prototype.initVis = function(){
	var vis = this;


    vis.margin = { top: 70, right: 60, bottom: 60, left: 60 };

    vis.width = 160 - vis.margin.left - vis.margin.right,
        vis.height = 300 - vis.margin.top - vis.margin.bottom;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


	vis.wrangleData();
}


/*
 * Data wrangling
 */

Treemap.prototype.wrangleData = function(){
	var vis = this;

    vis.data = vis.data.filter(function(d) {
        return d.parentId === "day" || d.parentId === vis.parentElement || d.parentId === ""
    });

    vis.data = d3.stratify()(vis.data);

	vis.updateVis();
}


/*
 * The drawing function
 */

Treemap.prototype.updateVis = function(){
	var vis = this;

    vis.Layout = d3.treemap().size([vis.width, vis.height]).paddingOuter(0);

    vis.Root = d3.hierarchy(vis.data).sum(function (d) { return d.data.size; });

    vis.Nodes = vis.Root.descendants();

    vis.Layout(vis.Root);

    vis.Slices = vis.svg.selectAll('rect')
        .data(vis.Nodes)
        .enter()
        .append('rect')
        .attr("fill", function(d) {
            if (d.data.id === "weed") {
                vis.weed = parseInt(d.data.data["size"])
                return "green"
            }
            else if (d.data.id === "heroin") {
                vis.heroin = parseInt(d.data.data["size"])
                return "red"
            }
            else if (d.data.id === "needle") {
                vis.needle = parseInt(d.data.data["size"])
                return "orange"
            }
        })
        // changes clockvisualization
        .on("click", function(d) {
            if (d.data.id === "weed") {
                updateClockChart("WeedCrimes");
            }
            else if (d.data.id === "heroin") {
                updateClockChart("HeroinCrimes");
            }
            else if (d.data.id === "needle") {
                updateClockChart("NumNeedles");
            }
        });

    // add labels

    vis.svg.append("text")
        .text(vis.parentElement.charAt(0).toUpperCase() + vis.parentElement.substr(1))
        .attr("class", "weekday-label")
        .attr("x", -40)
        .attr("y", -50)

    vis.svg.append("text")
        .text("Marijuana: "+vis.weed)
        .attr("x", -40)
        .attr("y", -20)
        .attr("class", "cal-label")
        .style("fill", "#31a354")

    vis.svg.append("text")
        .text("Heroin: "+vis.heroin)
        .attr("x", -40)
        .attr("y", 0)
        .attr("class", "cal-label")
        .style("fill", "red")

    vis.svg.append("text")
        .text("Needles: "+vis.needle)
        .attr("x", -40)
        .attr("y", 20)
        .attr("class", "cal-label")
        .style("fill", "orange")

    // Draw on screen
    vis.Slices.attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0 + 35; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; });
	
}

