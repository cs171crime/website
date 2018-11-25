
//Data Struct for Crime Type
var neighborhoods = ["Allston",
    "Allston / Brighton",
    "Back Bay",
    "Beacon Hill",
    "Boston",
    "Brighton",
    "Charlestown",
    "Dorchester",
    "Downtown / Financial District",
    "East Boston",
    "Fenway / Kenmore / Audubon Circle / Longwood",
    "Greater Mattapan",
    "Hyde Park",
    "Jamaica Plain",
    "Mattapan",
    "Mission Hill",
    "Roslindale",
    "Roxbury",
    "South Boston",
    "South Boston / South Boston Waterfront",
    "South End",
    "West Roxbury"];


// Define dimensions of vis
var margin = { top: 30, right: 50, bottom: 30, left: 50 },
    width  = 650 - margin.left - margin.right,
    height = 250 - margin.top  - margin.bottom;

// Make x scale
var xScale = d3.scaleBand()
    .domain(neighborhoods)
    .range([0,width])
    .padding(.1);

//Create yScale - domain to be defined on "bar update"
var yScale = d3.scaleLinear()
    .range([height, 0]);

//Draw Canvas
//Set SVG
var svg = d3.select("#chart-area2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 150)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Create xAxis
var xAxis = d3.axisBottom(xScale);


// Create yAxis
var yAxis = d3.axisLeft(yScale);

//Add xAxis to canvas - translate and fix ticks
svg.append("g")
    .attr("class", "x-axis axis")
    .attr("transform","translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "rotate(-70)")
    .attr("dx", "-.8em")
    .attr("dy",".25em")
    .style("text-anchor", "end")
    .style("font-size", "8px");

// Add yAxis to canvas
svg.append("g")
    .attr("class", "y-axis axis")
    .call(yAxis)
    .style("font-size", "8px");

//Add Labels for y axis (Need to play around with to align correctly)
svg.append('text')
    .attr('x', -20)
    .attr('y', 10)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Crimes')
    .style("font-size", "8px");

//Add Labels for x axis (Need to play around with to align correctly)
svg.append('text')
    .attr('x', width / 2 + margin)
    .attr('y', 400)
    .attr('text-anchor', 'middle')
    .text('Neighborhood')
    .style("font-size", "8px");

loadData();

Object.defineProperty(window, 'data', {
    get: function() { return _data; },

    set: function(value) {
        _data = value;

        updateVisualization();
    }
});

//Load Data

function loadData() {
    d3.csv("data/allData.csv", function(error, csv) {

        console.log(csv);


        csv.forEach(function (d, i) {

            d.Marijuana = +d.Marijuana;
            d.Heroin = +d.Heroin;

        });
        data = csv;
        //console.log(data);
    });
}

function updateVisualization() {

    // First update the y-axis domain to match data
    var grouping = d3.select("#selector").node().value;

    console.log(data);
    var maxY = d3.max(data, function (d) {
        if (grouping == "Marijuana") {
            return d.Marijuana;
        } else {
            console.log("fucl");
            console.log(d);
            return d.Heroin;
        }
    });
    console.log(maxY);
    yScale.domain([0, maxY]);

    var bars = svg.selectAll(".bar").data(data);

    // Add bars for new data
    bars.enter()
        .append("rect")
        .attr("fill", "purple")
        .attr("class", "bar")
        .merge(bars)
        .attr("x", function(d,i) {
            return xScale( neighborhoods[i] );
        })
        .attr("width", xScale.bandwidth())
        .attr("y", function(d,i) {
            if (grouping == "Marijuana") return yScale(d.Marijuana);
            else return yScale(d.Heroin);
        })
        .attr("height", function(d,i) {
            if (grouping == "Marijuana") return height - yScale(d.Marijuana);
            else return height - yScale(d.Heroin);
        });

    bars.exit().remove();

    svg.select(".x-axis")
        .transition()
        .call(xAxis);

    svg.select(".y-axis")
        .transition()
        .call(yAxis);
}














