// pull the url for dataset
// git bash from the folder your files are in and run: python -m http.server and go to localhost:8000 

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

function ddMenu(){
    //dropdown menu initialize:
    var dropdownMenu = d3.select("#selDataset");
  
    // Fetch the JSON data and console log it
    d3.json('samples.json').then((dataset) =>{
        console.log(dataset)
        let names = dataset.names;
        //check to make sure data is being retrieved
        console.log(names);
    
        //running each sample id through the dropdown menu:
        names.forEach((name) => {
            // console.log(name);
            dropdownMenu.append('option').text(name).property('value',name);
        });
        
        
        //data for intial bar chart
        let samples = dataset.samples
        var defaultSample = Object.values(samples[0].sample_values.slice(0,10))
        console.log(defaultSample)
        var defaultLabels = Object.values(samples[0].otu_ids.slice(0,10))
        // console.log(defaultLabels)
        var defaultText = Object.values(samples[0].otu_labels.slice(0,10))
        console.log(defaultText)

        //trace for the bar chart
        let traceData = {
            x: defaultSample,
            type: 'bar',
            orientation: 'h',
            text: defaultText
        };
        //data trace array
        let trace1 = [traceData]
        
        var yticks = defaultLabels.map(id => "OTU " + id)
        console.log(yticks)
        // Apply the group barmode to the layout
        let layout = {
            title: "Top 10 OTUs",
            yaxis: {
                tickmode: 'array',
                tickvals: [0,1,2,3,4,5,6,7,8,9],
                ticktext: yticks}
          };
         // Render the plot to the div tag with id "plot"
        Plotly.newPlot('bar', trace1, layout)
    }); 
}



function demographicInfo(sample){
    let demoInfo = d3.select("#sample-metadata")


    d3.json('samples.json').then(function(dataset) {
        let metadata = dataset.metadata
        let singleData = metadata.filter(mdata => mdata.id == sample);
        console.log(singleData)
        let result=singleData[0];

        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        Object.entries(result).forEach(([key, value])=> PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`));
        })}
  


  //initalize the ddMenu
  ddMenu();