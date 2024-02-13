// Function to get the user-friendly label for each category
function getCategoryLabel(category) {
    switch (category) {
        // Cases omitted for brevity
        default:
            return category; // Use the category name as the label by default
    }
}

// Function to create a categorical legend
function createCategoricalLegend(selection, categories, colors, title, width, height) {
    const legend = selection.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(20,20)");

    const legendTitle = legend.append("text")
        .attr("class", "legend-title")
        .attr("x", 0)
        .attr("y", -5)
        .text(title);

    const legendItems = legend.selectAll(".legend-item")
        .data(categories)
        .enter().append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(${i * width / categories.length},0)`);

    legendItems.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width / categories.length)
        .attr("height", height)
        .attr("fill", (d, i) => colors[i]);

    legendItems.append("text")
        .attr("x", width / categories.length / 2)
        .attr("y", height + 10)
        .text(d => d)
        .attr("text-anchor", "middle");

    return legend;
}

export function renderChloropleth(categoryData, category1, category2) {
    // Load the TopoJSON file containing the geographical data
    d3.json('data/counties-10m.json').then(jsonData => {
        
        // Convert TopoJSON to GeoJSON
        const usGeoJSON = topojson.feature(jsonData, jsonData.objects.counties);

        // Define the color scales for the chloropleth maps
        const colorSchemes = {
            // Definition omitted for brevity
        };

        // Extract data for category 1, category 2, and urban rural status
        const category1DataMap = new Map(categoryData.map(d => [d.cnty_fips, d[category1]]));
        const category2DataMap = new Map(categoryData.map(d => [d.cnty_fips, d[category2]]));
        // Urban rural status data is not included in categoryData, so I've omitted it

        // Create the SVG container
        const svg = d3.create("svg")
            .attr("width", 975)
            .attr("height", 610)
            .attr("viewBox", [0, 0, 975, 610])
            .attr("style", "max-width: 100%; height: auto;");

        // Append legend for category 1
        createCategoricalLegend(svg, ["Urban", "Rural", "Other"], ["#f00", "#0f0", "#00f"], "Urban/Rural Status", 260, 20);

        // Create paths for counties for category 1
        svg.append("g")
            .attr("transform", "translate(300,0)")
            .selectAll("path")
            .data(usGeoJSON.features)
            .join("path")
            .attr("fill", d => {
                const value = category1DataMap.get(d.id);
                // Coloring logic omitted for brevity
            })
            .attr("d", d3.geoPath())
            .append("title")
            .text(d => `${getCategoryLabel(category1)} - ${d.properties.name}\n${category1DataMap.get(d.id)}%`);

        // Append legend for category 2
        svg.append("g")
            .attr("transform", "translate(610,20)")
            .call(createCategoricalLegend, ["Urban", "Rural", "Other"], ["#f00", "#0f0", "#00f"], "Urban/Rural Status", 260, 20);

        // Create paths for counties for category 2
        svg.append("g")
            .attr("transform", "translate(930,0)")
            .selectAll("path")
            .data(usGeoJSON.features)
            .join("path")
            .attr("fill", d => {
                const value = category2DataMap.get(d.id);
                // Coloring logic omitted for brevity
            })
            .attr("d", d3.geoPath())
            .append("title")
            .text(d => `${getCategoryLabel(category2)} - ${d.properties.name}\n${category2DataMap.get(d.id)}%`);

        // Add state boundaries
        svg.append("path")
            .datum(topojson.mesh(jsonData, jsonData.objects.states, (a, b) => a !== b))
            .attr("transform", "translate(300,0)")
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-linejoin", "round")
            .attr("d", d3.geoPath());

        // Append the SVG node to the DOM
        document.body.appendChild(svg.node());
    });
}
