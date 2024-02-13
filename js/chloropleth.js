export function renderChloropleth(width, height, counties, states, category1Data, category2Data, statemap) {
    // Define the color schemes for the chloropleth maps
    const colorSchemes = {
        category1: "blues",
        category2: "greens"
    };

    // Create the chloropleth maps for Category 1 and Category 2
    const chloropleth1 = Plot.plot({
        width: width / 2, // Half width for each map
        height: height,
        projection: "identity",
        color: {
            type: "quantize",
            n: 9,
            domain: [/* Define your domain for Category 1 data */],
            scheme: colorSchemes.category1, // Use the color scheme for Category 1
            label: "Category 1 Label",
            legend: true
        },
        marks: [
            Plot.geo(counties, Plot.centroid({
                fill: d => category1Data.get(d.id), // Map data for Category 1
                tip: true,
                channels: {
                    County: d => d.properties.name,
                    State: d => statemap.get(d.id.slice(0, 2)).properties.name
                }
            })),
            Plot.geo(states, { stroke: "white" })
        ]
    });

    const chloropleth2 = Plot.plot({
        width: width / 2, // Half width for each map
        height: height,
        projection: "identity",
        color: {
            type: "quantize",
            n: 9,
            domain: [/* Define your domain for Category 2 data */],
            scheme: colorSchemes.category2, // Use the color scheme for Category 2
            label: "Category 2 Label",
            legend: true
        },
        marks: [
            Plot.geo(counties, Plot.centroid({
                fill: d => category2Data.get(d.id), // Map data for Category 2
                tip: true,
                channels: {
                    County: d => d.properties.name,
                    State: d => statemap.get(d.id.slice(0, 2)).properties.name
                }
            })),
            Plot.geo(states, { stroke: "white" })
        ]
    });

    // Return the chloropleth maps
    return [chloropleth1, chloropleth2];
}
