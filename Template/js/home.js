// Hint: This is a good place to declare your global variables

const margin = {top: 0, right: 0, bottom: 0, left: 150},
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom,
    innerRadius = 100,
    outerRadius = Math.min(width, height) / 2;


// This function is called once the HTML page is fully loaded by the browser
document.addEventListener("DOMContentLoaded", function () {
  // Hint: create or set your svg element inside this function

  // This will load your CSV files and store them into array.
  Promise.all([
    d3.csv("Data/population-since-1800.csv"),
    d3.csv("Data/gdp-per-capita-worldbank.csv")
  ]).then(function (values) {
    //Dataset creation and preprocessing part
    drawGraph()
  })


})

function drawGraph(data){
//Use this function to draw a final graph                

}



