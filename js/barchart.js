
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
var marginBar = { top: 30, right: 50, bottom: 30, left: 50 },
    widthBar  = 650 - marginBar.left - marginBar.right,
    heightBar = 250 - marginBar.top  - marginBar.bottom;

// Make x scale
var xScaleBar = d3.scaleBand()
    .domain(neighborhoods)
    .range([0,widthBar])
    .padding(.1);

//Create yScale - domain to be defined on "bar update"
var yScaleBar = d3.scaleLinear()
    .range([heightBar, 0]);

//Draw Canvas
//Set SVG
var svgBar = d3.select("#barChart")
    .append("svg")
    .attr("width", widthBar + marginBar.left + marginBar.right)
    .attr("height", heightBar + marginBar.top + marginBar.bottom + 150)
    .append("g")
    .attr("transform", "translate(" + marginBar.left + "," + marginBar.top + ")");

//Create xAxis
var xAxisBar = d3.axisBottom(xScaleBar);


// Create yAxis
var yAxisBar = d3.axisLeft(yScaleBar);

//Add xAxis to canvas - translate and fix ticks
svgBar.append("g")
    .attr("class", "x-axis axis")
    .attr("transform","translate(0," + heightBar + ")")
    .call(xAxisBar)
    .selectAll("text")
    .attr("transform", "rotate(-70)")
    .attr("dx", "-.8em")
    .attr("dy",".25em")
    .style("text-anchor", "end")
    .style("font-size", "8px")
    .style("fill", "white");

// Add yAxis to canvas
svgBar.append("g")
    .attr("class", "y-axis axis")
    .call(yAxisBar)
    .style("font-size", "8px")
    .style("stroke", "white");


//Add Labels for y axis (Need to play around with to align correctly)
svgBar.append('text')
    .attr('x', -20)
    .attr('y', 10)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Reports')
    .style("font-size", "8px")
    .style("fill", "white");

//Add Labels for x axis (Need to play around with to align correctly)
svgBar.append('text')
    .attr('x', widthBar / 2)
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
    yScaleBar.domain([0, maxY]);

    var bars = svgBar.selectAll(".bar").data(data);

    // Add bars for new data
    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .merge(bars)
        .attr("fill", function(d) {
            console.log(colorBars(grouping));
            console.log("yeet");
            return colorBars(grouping);
        })
        .attr("x", function(d,i) {
            return xScaleBar( neighborhoods[i] );
        })
        .attr("width", xScaleBar.bandwidth())
        .attr("y", function(d,i) {
            if (grouping == "Marijuana") return yScaleBar(d.Marijuana);
            else return yScaleBar(d.Heroin);
        })
        .attr("height", function(d,i) {
            if (grouping == "Marijuana") return heightBar - yScaleBar(d.Marijuana);
            else return heightBar - yScaleBar(d.Heroin);
        });

    bars.exit().remove();

    svgBar.select(".x-axis")
        .transition(1000)
        .call(xAxisBar);

    svgBar.select(".y-axis")
        .transition(1000)
        .call(yAxisBar);
}

function colorBars(data_) {

    if (data_ == "Heroin") {
        return '#67000d';
    } else {
        return '#004529';
    }
};















