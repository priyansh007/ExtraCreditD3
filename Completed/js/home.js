// Hint: This is a good place to declare your global variables

const width = 1000,
    height = 1000,
    innerCircle = 100,
    outerCircle = Math.min(width, height) / 2;


// This function is called once the HTML page is fully loaded by the browser
document.addEventListener("DOMContentLoaded", function () {
  // Hint: create or set your svg element inside this function

  // This will load your CSV files and store them into array.
  Promise.all([
    d3.csv("Data/population-since-1800.csv"),
    d3.csv("Data/gdp-per-capita-worldbank.csv")
  ]).then(function (values) {
    var population = values[0];
    var gdp = values[1];
    console.log(population)
    total_count = population.length
    final_population_dataset = []
    final_gdp_dataset = []
    c = 0
    for (var i = 0; i < total_count; i++) {
      if(population[i]['Year']=="2020"){
        final_population_dataset[c] = {
          countryName: population[i]['Entity'],
          population: parseInt(population[i]['Population (historical estimates)'])
        }
        c+=1
      }
    };
    console.log(final_population_dataset)
    final_population_dataset = final_population_dataset.slice().sort((a, b) => d3.descending(a.population, b.population))
    final_population_dataset = final_population_dataset.slice(1,70)
    c = 0
    for(var i=0; i<gdp.length; i++){
      if(gdp[i]["Year"]=="2020"){
        final_gdp_dataset[c] = {
          countryName: gdp[i]['Entity'],
          gdpPerCapita: parseInt(gdp[i]['GDP per capita, PPP (constant 2017 international $)'])
        } 
        c+=1
      }
    }
    final_data_set = []
    c = 0
    for(var i=0; i<final_population_dataset.length; i++){
      pop = final_population_dataset[i]
      for(var j=0; j<final_gdp_dataset.length; j++){
        if(final_gdp_dataset[j].countryName == pop.countryName){
          final_data_set[c] = {
            countryName: pop.countryName,
            gdpPerCapita: final_gdp_dataset[j].gdpPerCapita,
            population: pop.population
          }
          c+=1
        }

      }
    }
    console.log(final_data_set.slice(0,50))
    drawGraph(final_data_set.slice(0,50))
  })


})

function drawGraph(data){
  const svg = d3.select("#graph1")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width/2+100}, ${height/2+(75)})`);

  const xScale = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .align(0)
    .domain(data.map(d => d.countryName))

  
  const y = d3.scaleRadial()
      .range([innerCircle, outerCircle])
      .domain([0, 1424929792])

  const ySecond = d3.scaleRadial()
      .range([innerCircle, 4])
      .domain([0, 70000]);


  
  svg.append("g")
    .selectAll("path")
    .data(data)
    .join("path")
      .attr("fill", "#69b3a2")
      .attr("class", "yo")
      .attr("d", d3.arc()
          .innerRadius(innerCircle)
          .outerRadius(d => y(d.population))
          .startAngle(d => xScale(d.countryName))
          .endAngle(d => xScale(d.countryName) + xScale.bandwidth())
          .padAngle(0.02)
          .padRadius(innerCircle))

  
  svg.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
        .attr("text-anchor", function(d) { return (xScale(d.countryName) + xScale.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((xScale(d.countryName) + xScale.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d.population)+10) + ",0)"; })
      .append("text")
        .text(d => d.countryName)
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle")
        .attr("transform", function(d) { return (xScale(d.countryName) + xScale.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        

  svg.append("g")
    .selectAll("path")
    .data(data)
    .join("path")
      .attr("fill", "red")
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius( d => ySecond(0))
          .outerRadius( d => ySecond(d.gdpPerCapita))
          .startAngle(d => xScale(d.countryName))
          .endAngle(d => xScale(d.countryName) + xScale.bandwidth())
          .padAngle(0.03)
          .padRadius(innerCircle))
  var legend = svg.append("g")
    .selectAll("g")
    .data(["Population"])
    .enter().append("g")
    .attr("transform",`translate(-190, -300)`)

  legend.append("rect")
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", "#69b3a2");

  legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text(d => d);

  var legend2 = svg.append("g")
    .selectAll("g")
    .data(["GDP per capita"])
    .enter().append("g")
    .attr("transform",`translate(-190, -330)`)

  legend2.append("rect")
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", "red");

  legend2.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text(d => d);         
                  

}



