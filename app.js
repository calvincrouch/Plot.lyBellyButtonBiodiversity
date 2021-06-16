console.log("app.js loaded");

function DrawBargraph(sampleId) {
    console.log(`Drawbargraph(${sampleId})`);

    d3.json("data/samples.json").then(data => {
        // console.log(data);

        var samples = data.samples;
        var resultArray = samples.filter(s => s.id == sampleId);
        var result = resultArray[0];
        
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        yticks = otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();

        var barData = {
            x: sample_values.slice(0,10).reverse(),
            y: yticks, 
            type: "bar",
            text: otu_labels.slice(0, 10).reverse(),
            orientation: "h"
        }

        var barArray = [barData];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        }

        Plotly.newPlot("bar", barArray, barLayout); 


    });
}

function DrawBubblechart(sampleId) {
    d3.json("data/samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(s => s.id == sampleId);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
      
      
        var bubbleLayout = {
            margin: { t: 0 },
            hovermode: "closests",
            xaxis: { title: "OTU ID"}
        }
  
        var bubbleData = [
        {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }
      ]

      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
    });

}

function ShowMetadata(sampleId) {
    d3.json("data/samples.json").then((data)=> {
        
        var metadata = data.metadata;

        console.log(metadata)

        var result = metadata.filter(meta => meta.id.toString() === sampleId)[0];

        var demographicInfo = d3.select("#sample-metadata");
        
        demographicInfo.html("");        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}


function optionChanged(newSampleId) {
    console.log(`User selected ${newSampleId}`);

    DrawBargraph(newSampleId);
    DrawBubblechart(newSampleId);
    ShowMetadata(newSampleId);

}



function InitDashboard() {
    console.log("InitDashboard()");
    var selector = d3.select("#selDataset");

    d3.json("data/samples.json").then(data => {
        var sampleNames = data.names;

        sampleNames.forEach(sampleId => {
            selector.append("option")
                .text(sampleId)
                .property("value", sampleId);
        });

        var id = sampleNames[0];
        DrawBargraph(id);
        DrawBubblechart(id);
        ShowMetadata(id);

    });
}

InitDashboard();