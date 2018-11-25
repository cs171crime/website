
/*
 * Clockchart - Object constructor function
 * @param _parentElement -- the HTML element in which to draw the line chart
 * @param _data	-- the data
 */

Clockchart = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.measure = "HeroinCrimes";

    // set up the clock look
    this.tickLength = 10;
    this.radians = 0.0174532925;
    this.hourLabelAdjustment = 7;

    // call initVis
    this.initVis();
};


Clockchart.prototype.initVis = function() {
    var vis = this;

    // SVG drawing area
    vis.height = 300;
    vis.width = 300;
    vis.radius = 150;
    vis.p = Math.PI * 2;

    vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .attr("height", vis.height)
        .attr("width", vis.width);


    vis.g = vis.svg.append("g")
        .attr("transform", "translate(150,150)");

    vis.arc = d3.arc()
        .innerRadius(0)
        .outerRadius(vis.radius)
        //.startAngle(0)
        .endAngle(vis.p);


    vis.clock = d3.pie()
        .sort(null)
        .value(function(d) {
            return d.angle;
        });

    vis.arcs = vis.g.selectAll(".arc")
        .data(vis.clock(vis.data))
        .enter()
        .append("g")
        .attr("class", "arc");

    // for clock
    vis.hourScale = d3.scaleLinear()
        .range([0,330])
        .domain([0,11]);

    vis.hourLabelRadius = vis.radius - 40;

    // call wrangleData
    vis.wrangleData();
};


Clockchart.prototype.wrangleData = function() {
    var vis = this;

    // Update color scale
    vis.maxForColorScale = d3.max(vis.data, function(d) { return d[vis.measure]; });

    console.log(vis.maxForColorScale);

    vis.color = d3.scaleLinear()
        .domain([0, vis.maxForColorScale]);
    if (vis.measure === "HeroinCrimes") {
        vis.color.range(["white","red"]);
    }
    else if (vis.measure === "WeedCrimes") {
        vis.color.range(["white","#31a354"]);
    }
    else if (vis.measure === "NumNeedles") {
        vis.color.range(["white","orange"]);
    }

    // call updateVis
    vis.updateVis();
};


Clockchart.prototype.updateVis = function() {
    var vis = this;

    // Pie chart
    vis.arcs.append("path")
        .attr("d", vis.arc)
        .style("fill", function(d) {
            return vis.color(d.data.HeroinCrimes);
        });

    // Clock look
    vis.g.append('g')
        .attr('class', 'ticks')
        .selectAll('path')
        .data(splitDegrees(12))
        .enter()
        .append('path')
        .attr('d', function(d) {
            var coord = {
                outer: getCoordFromCircle(d, 0, 0, vis.radius),
                inner: getCoordFromCircle(d, 0, 0, vis.radius - vis.tickLength)
            };
            return 'M' + coord.outer[0] + ' ' + coord.outer[1] + 'L' + coord.inner[0] + ' ' + coord.inner[1] + 'Z';
        })
        .attr('stroke', 'black');

    vis.g.append("circle")
        .attr("r", 5)
        .attr("fill", "black")
        .attr("class", "innercircle");

    vis.g.append("line")
        .attr("class","hour-hand")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", vis.radius/2 - 5*vis.tickLength)
        .attr("y2", -((vis.radius / 2) * Math.sqrt(3) - 5*vis.tickLength));

    vis.g.append("line")
        .attr("class","minute-hand")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", vis.radius/Math.sqrt(2) - 2*vis.tickLength)
        .attr("y2", vis.radius/Math.sqrt(2) - 2*vis.tickLength);

    vis.g.selectAll('.hour-label')
        .data(d3.range(3,13,3))
        .enter()
        .append('text')
        .attr('class', 'hour-label')
        .attr('text-anchor','middle')
        .attr('x',function(d){
            return vis.hourLabelRadius*Math.sin(vis.hourScale(d)*vis.radians);
        })
        .attr('y',function(d){
            return -vis.hourLabelRadius*Math.cos(vis.hourScale(d)*vis.radians) + vis.hourLabelAdjustment;
        })
        .text(function(d){
            return d;
        });
};


// Functions for clock look
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function getCoordFromCircle(deg, cx, cy, r) {
    var rad = degToRad(deg);
    var x = cx + r * Math.cos(rad);
    var y = cy + r * Math.sin(rad);
    return [x, y];
}

function splitDegrees(num) {
    var angle = 360 / num;
    var degrees = [];

    for (var ang = 0; ang < 360; ang += angle) {
        degrees.push(ang);
    }

    return degrees;
}