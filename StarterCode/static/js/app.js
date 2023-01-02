// pull the url for dataset
// git bash from the folder your files are in and run: python -m http.server and go to localhost:8000 

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it to ensure proper connection
d3.json(url).then(function(data) {
  console.log(data);
});


//function that creates the drop down menu attached to sample id names
function ddMenu(){
    //dropdown menu initialize:
    var dropdownMenu = d3.select("#selDataset");
  
    // Fetch the JSON data and console log it
    d3.json(url).then((dataset) =>{
        // console.log(dataset)
        let names = dataset.names;
        //check to make sure data is being retrieved
        // console.log(names);
    
        //running each sample id through the dropdown menu:
        names.forEach((name) => {
            // console.log(name);
            dropdownMenu.append('option').text(name).property('value',name);
        });
        //initialize default sample information
        var defaultSample = names[0]
        demographicInfo(defaultSample)
        makeChart(defaultSample)
    }); 
}

//function that fills in the information for the demographic information box
function demographicInfo(sample){

    //narrowing down results to match the id name selected in the function:
    d3.json(url).then(function(dataset) {
        var metadata = dataset.metadata
        var singleData = metadata.filter(mdata => mdata.id == sample);
        console.log(singleData)
        var result=singleData[0];

        //here is where the html and js link together to initialize the text from the json to the html page. A TA helped me write this particular phrase of code during office hours
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        Object.entries(result).forEach(([key, value])=> PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`));
    })
}

// function that makes our 2 graphs for each sample
function makeChart(sample) {
    // access the dataset and narrow down to make sure the sample id matches the selected sample id
    d3.json(url).then(function(dataset) {
        let samples = dataset.samples
        console.log(samples)
        var singleSample = samples.filter(sdata => sdata.id == sample)
        console.log(singleSample)

        //further going into the dataset to access the object contents and assigning it a variable name
        var defaultSample = singleSample[0]
        console.log(defaultSample)

        // assigning variable names to the chart components
        // sample values:
        var singleVals = defaultSample.sample_values
        // otu_ids for the y axis labels
        var singleOtuIds = defaultSample.otu_ids
        console.log(singleOtuIds)
        // the bacteria information for the hover effect on the graph
        var singleOtuLabels = defaultSample.otu_labels
        console.log(singleOtuLabels)

        //trace for the bar chart
        let traceData = {
            x: singleVals.slice(0,10),
            type: 'bar',
            orientation: 'h',
            text: singleOtuLabels.slice(0,10)
        };
        //data trace array
        let trace1 = [traceData]
        
        var yticks = singleOtuIds.slice(0,10).map(id => "OTU " + id)
        // console.log(yticks)
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

        //make bubble chart:
        var bubbleData = [{
            x: singleOtuIds,
            y: singleVals,
            text: singleOtuLabels,
            mode: 'markers',
            marker: {
                size: singleVals,
                color: singleOtuIds,
                colorscale: 'solar'
            }
        }];
        // console.log(bubbleData)

        var bubbleLayout = {
            title: "Otu Dispersion Found in Sample",
        };
        console.log(bubbleLayout)
        Plotly.newPlot('bubble', bubbleData, bubbleLayout)
    })
}


//initalize the ddMenu
ddMenu();

// function to change the page when a new drop down Id is chosen
document.getElementById("selDataset").onchange = function(){myFunction()};

function myFunction() {
    d3.json(url).then(function(data) {
        var x = document.getElementById("selDataset");
        var newID = x.value
        // console.log(newID)
        demographicInfo(newID);
        makeChart(newID);
      });    
}
