class Histogram {
    constructor(parentElement, category, data, config) {
        this.parentElement = parentElement;
        this.data = data;
        this.config = config;
        this.category = category; // Store the category for labeling

        // Log data for debugging purposes
        console.log('Data fed into histogram:', data);

        // Initialize visualization
        this.initVis();
    }

    initVis() {
        let vis = this;
    
        // Define visualization dimensions
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
    
        // Create SVG container for the histogram
        vis.svg = d3.select(vis.parentElement)
            .append('svg')
            .attr('class', 'center-container')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
        
        // Render the histogram
        vis.renderGroupedBars(vis.groupData(vis.data, 'percentage'));
    }
    
    // Helper function to group counties by the category data
    groupData(data, dataType) {
        // Define a function to create bins for the histogram
        const createBins = (data, dataType) => {
            const values = data.map(d => d.categoryData);

            // Calculate the minimum and maximum values
            const minValue = Math.min(...values);
            const maxValue = Math.max(...values);

            // Determine the number of bins based on data type
            let numberOfBins;
            if (dataType === 'percentage') {
                numberOfBins = 10; // You can adjust this value based on your preference
            } else {
                numberOfBins = 20; // Or adjust as needed
            }

            // Calculate bin width
            const binWidth = (maxValue - minValue) / numberOfBins;

            // Create bins
            const bins = Array.from({ length: numberOfBins }, (_, index) => {
                const start = minValue + index * binWidth;
                const end = start + binWidth;
                return {
                    start,
                    end,
                    count: 0
                };
            });

            // Count data points in each bin
            data.forEach(datum => {
                const value = datum.categoryData;
                const bin = bins.find(bin => value >= bin.start && value < bin.end);
                if (bin) {
                    bin.count++;
                }
            });

            return bins;
        };

        // Create bins based on the data and data type
        const bins = createBins(data, dataType);
        return bins;
    }

    renderGroupedBars(groupedData) {
        let vis = this;

        // Define x scale
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(groupedData, d => d.count)])
            .range([0, vis.width]);

        // Define y scale
        const yScale = d3.scaleBand()
            .domain(groupedData.map(d => `${d.start.toFixed(2)} - ${d.end.toFixed(2)}`))
            .range([vis.height, 0]) // Reversed range to start from the top
            .padding(0.1);

    // Add x-axis
    const xAxis = d3.axisBottom(xScale);
    vis.svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(${vis.config.margin.left + 30}, ${vis.config.margin.top + vis.height})`) // Adjusted margin for x-axis
        .call(xAxis)
        .append('text')
        .attr('x', vis.width / 2)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text('Count');

    // Add y-axis
    const yAxis = d3.axisLeft(yScale);
    vis.svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${vis.config.margin.left + 30}, ${vis.config.margin.top})`)
        .call(yAxis)
        .selectAll('text')
        .style('font-size', '10px') // Reduce font size
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

    // Create SVG group element for bars
    const bars = vis.svg.append('g')
        .attr('class', 'bars')
        .attr('transform', `translate(${vis.config.margin.left + 30}, ${vis.config.margin.top})`);

    // Create and append bars
    bars.selectAll('rect')
    .data(groupedData)
    .enter().append('rect')
    .attr('x', 0) // Align with the y-axis
    .attr('y', d => yScale(`${d.start.toFixed(2)} - ${d.end.toFixed(2)}`)) // Position rectangles directly above the x-axis
    .attr('width', d => xScale(d.count))
    .attr('height', yScale.bandwidth()) // Set the height to bandwidth to cover the full range of the y-axis
    .attr('fill', 'steelblue');


    
        


    }
}
