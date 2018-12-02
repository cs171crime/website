# Boston's Drug Use and Abuse

This repository contains the source code for our final website for CS171. In our project, we look at drug use and abuse in Boston between 2015 and 2018. Specifically, we look at trends in publicly available data about heroin and marijuana usage from the [City of Boston](https://data.boston.gov/). We use their [crime](https://data.boston.gov/dataset/crime-incident-reports-august-2015-to-date-source-new-system) and [311](https://data.boston.gov/dataset/311-service-requests) data.

Our group members are:
* Anthony Rentsch
* Vojta Drmota
* Kimia Mavon
* Faisal Younus

## Project Deliverables

* [Website]()
* [Project screencast]()

## Code

### Javascript
*Libraries*
* `D3` - For visualizations
* `d3-tip` - For tooltips
* `jQuery` - For easier DOM traversal and event handling 
* `Queue` - For loading mutliple data sources at once
* `TopoJSON` - For loading spatial data
* `Bootstrap` - For website design
* `Popper` - For website design
* `wow` - For website design
* `Modernizr` - For website design

*Our code*
* `main.js` - Loads navbar and scrolling; instantiates visualization objects for line chart, tree map, and clock chart
* `chlorocrime.js` - Creates choropleth map
* `barchart.js` - Creates bar chart
* `line-chart.js` - Creates line chart object
* `treemap.js` - Creates tree map object for calendar visualization
* `clock.js` - Creates pie chart object for clock visualization

### Data
* `boston.geojson` - Spatial reference data for the City of Boston
* `crime_calendar.csv` - Data for tree map/calendar visualization
* `DrugsByhour.csv` - Number of incidents per hour, for clock visualization
* `hoods.csv` - Number of incidents per neighborhood
* `lineChartData.csv` - Data for line chart
* `cleaning/CrimeCleaning.ipynb` - Python script used to clean and aggregate data
* `cleaning/CrimeCleaning_additional_data.ipynb` - Python script used to clean and aggregate data

### Img
* `header-bg.jpg` - Background image for website
* `purple.jpg` - Background image for website (removed)
* `red.jpg` - Background image for website


### CSS
*Libraries*
* `Animate`
* `Bootstrap`
* `Font Awesome`

*Our code*
* `style.css`


### HTML
* `index.html` 