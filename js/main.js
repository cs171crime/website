$(document).ready(function(){

  // Wow animation
  wow = new WOW(
  {
    boxClass:     'wow',
    animateClass: 'animated',
    offset:       0,
    mobile:       false
  });
  wow.init();

  updateClockChart("HeroinCrimes");

});


// Create variables to store chart
var linechart;

// Date parsing
var parseDate = d3.timeParse("%m/%Y");


d3.csv("data/lineChartData.csv", function(data) {

    // Data processing
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.HeroinCrimes = +d.HeroinCrimes;
        d.WeedCrimes = +d.WeedCrimes;
        d.NumbNeedleReports = +d.NumbNeedleReports;
    });

    // Sanity check
    console.log(data)

    // Instantiate line chart object
    linechart = new Linechart("line-chart", data);

    // Reach to new user input and update line chart
    d3.select("#var").on("change", updateLineChart);
});

function updateLineChart() {

    // Grab user input and save it to measure attribute
    linechart.measure = d3.select("#var").property("value");

    // update visual
    linechart.wrangleData();

};

var clockChartMorning;
var clockChartAfternoon;

var treemaps = []

var weekdays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
]

d3.csv('data/crime_calendar.csv', function(error, data) {
    if (error) throw error;

    weekdays.forEach(function(day) {
        treemaps.push(new Treemap(day, data))
    })
});


d3.csv("data/DrugsByhour.csv", function(data) {

    // Data processing
    data.forEach(function(d) {
        d.hourofday = +d.hourofday;
        d.HeroinCrimes = +d.HeroinCrimes;
        d.WeedCrimes = +d.WeedCrimes;
        d.angle = +d.angle;
    });

    // Put data in right form
    var morning = [];
    var afternoon = [];

    for (var i = 0; i < data.length; i++) {
        if (i < data.length/2) { morning.push(data[i]) }
        else { afternoon.push(data[i]) }
    }

    // Sanity check
    console.log("morning");
    console.log(morning);
    console.log("afternoon");
    console.log(afternoon);

    // instantiate charts
    clockChartMorning = new Clockchart("#clock-chart-morning", morning);
    clockChartAfternoon = new Clockchart("#clock-chart-afternoon", afternoon)

    // update charts
    d3.select("#var").on("change", updateClockChart);

});

function updateClockChart(category) {

    // Grab user input and save it to measure attribute
    clockChartMorning.measure = category;
    clockChartAfternoon.measure = category;

    // update visual
    clockChartMorning.wrangleData();
    clockChartAfternoon.wrangleData();


};
