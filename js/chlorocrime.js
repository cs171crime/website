
var margin = {

    top: 40,
    right: 160,
    bottom: 40,
    left: 160
};
var colorscale = d3.scale.quantize();
var width = 650;
var height = 580;
var inputValue = null;
var total = {};
var svg = d3.select( "#chart-area")
    .append( "svg" )
    .attr( "width", width )
    .attr( "height", height );

var g = svg.append( "g" );

var albersProjection = d3.geoAlbers()
    .scale( 190000 )
    .rotate( [71.057,0] )
    .center( [0, 42.313] )
    .translate( [width/2,height/2] );

var geoPath = d3.geoPath()
    .projection( albersProjection );


// set up d3 tooltip
var tip = d3.tip()
    .attr('class', 'd3-tip');
g.call(tip);


var colorlist = {};

var country_data, ID_data = {};

var rawcountry_data, ID_data = {};


queue()
    .defer(d3.json, "data/boston.geojson")
    .defer(d3.csv, "data/hoods.csv")
    .await(function(error, mapTopJson, rawcountry_data) {


        rawcountry_data.forEach(function(d) {
            d.Heroin= d.Heroin;
            d.Marijuana=d.Marijuana;
            d.Heroin = parseFloat(d.Heroin);
            d.Marijuana = parseFloat(d.Marijuana);
            d.index = parseFloat(d.index);
        });

        country_data = rawcountry_data.filter(function (d) {
            return d.index < 100;});


        country_data.forEach(function(d) {
            ID_data[d.neighborhood] = d;

        });
        var geoJSON_africa = mapTopJson.features;

        g.selectAll( "path" )
            .data( geoJSON_africa )
            .enter()
            .append( "path" )
            .attr("class", "map")
            .attr( "d", geoPath );

        updateChoropleth();

    });
function updateChoropleth() {


    var data_ = d3.select("#selector")
        .node()
        .value;

    var data_Values = country_data.map(function(d) {
        return d[data_];
    });


    var colorlist =  color_by_type(data_);


    colorscale
        .domain(d3.extent(data_Values))
        .range(colorlist);



    svg.selectAll(".map")
        .attr("fill", function(d) {

            return calculateFill(d, data_); })
        .on('mouseover', function(d) {
            var countryData = getit(d);
            if (countryData) {
                tip.show(d);
            }
        })
        .on('mouseout', tip.hide);



    var legend = svg.selectAll('g.legry')
        .data(colorscale.range(), function(d) {

            return d;
        });


    var legend_ = legend.enter()
        .append('g')
        .attr('class', 'legry');



    legend_
        .append('rect')
        .attr("x", width - 270)
        .attr("y", function(d, i) {
            return i * 20 +460;
        })
        .attr("width", 20)
        .attr("height", 20)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill", function(d){
            return d;
        });


    legend_
        .append('text')
        .attr("x", width-245 )
        .attr("y", function(d, i) {
            return i * 20 +475;
        })
        .style("stroke", "white")
        .style("stroke-width", 1);


    legend_.selectAll('text')
        .text(function(d, i) {
            var extent = colorscale.invertExtent(d);
            format = d3.format(".2s");

            boundary = format(+extent[0]);
            boundary2 = format(+extent[1]);
            var total = boundary+ " - " + boundary2 + grouptext(data_) ;


            return total;
        });

    legend.exit().remove();


    tip.html(function(d) {
        return d.properties.name;;
    });

}



function grouptext(data_) {
    if (data_ === "Heroin" ) {
        return " Heroin reports"
    } else {
        return " Marijuana reports";
    };
}


function calculateFill(d, data_) {
    var countryData = getit(d);

    if (countryData !== null) {
        var metricValue = countryData[data_];
        if (isNaN(metricValue)) {

            return "white" ;
        } else {

            return colorscale(metricValue);
        }
    } else {

        return "white";
    }
}

function getit(d) {
    return ID_data[d.properties.name] || 0;

}

function color_by_type(data_) {

    if (data_ == "Heroin" ) {
        return [


            '#fcbba1',
            '#fb6a4a',
            '#cb181d',
            '#67000d'

        ];
    }
    else if (data_ == "Marijuana" ) {
        return  [


            '#d9f0a3',
            '#78c679',
            '#238443',
            '#004529'

        ];
    }
    else {
        return [

            '#ffffff',
            '#ffffff',
            '#ffffff',
            '#ffffff'

        ];
    };
}

