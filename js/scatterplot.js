let category2DataCopy;
class Scatterplot {
    constructor(parentElement, category1Data, category2Data, category1, category2, config) {
        this.parentElement = parentElement;
        this.category1Data = category1Data;
        this.category2Data = category2Data;
        this.category1 = category1;
        this.category2 = category2;
        this.config = {
            containerWidth: config.containerWidth || 600,
            containerHeight: config.containerHeight || 600,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
            tooltipPadding: config.tooltipPadding || 10,
            legendBottom: config.legendBottom || 50,
            legendLeft: config.legendLeft || 50,
            legendRectHeight: config.legendRectHeight || 12,
            legendRectWidth: config.legendRectWidth || 150
        };

        this.tooltip = d3.select(parentElement)
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        this.tooltip.append("div")
            .attr("class", "tooltip-label");

        // Initialize visualization
        this.initVis();
    }

    initVis() {
        let vis = this;
        category2DataCopy = this.category2Data;
        console.log("cat2datacopy:")
        console.log(category2DataCopy)

        console.log("Category1data:")
        console.log(this.category1Data)
        
        console.log("Category2data:")
        console.log(this.category2Data)

        // Define visualization dimensions
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // Create SVG container for the scatterplot
        vis.svg = d3.select(vis.parentElement)
            .append('svg')
            .attr('class', 'center-container')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // Render the scatterplot
        vis.renderScatterplot();
    }

    renderScatterplot() {
        let vis = this;

        // Define x scale
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(vis.category1Data.map(d => d.categoryData))])
            .range([0, vis.width]);

        // Define y scale
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(vis.category2Data.map(d => d.categoryData))])
            .range([vis.height, 0]);

        // Add data points
        vis.svg.selectAll('.circle')
            .data(vis.category1Data)
            .enter()
            .append('circle')
            .attr('class', 'circle')
            .attr('cx', d => xScale(d.categoryData))
            .attr('cy', (d, i) => yScale(vis.category2Data[i].categoryData))
            .attr('r', 5)
            .attr('fill', 'steelblue')
            .on('mouseover', function (event, d, i) {
                const category1Datum = d;
                console.log('category1data', d.categoryData);
                
             
                const category2Datum = category2DataCopy.find(item => item.countyName === d.countyName);

                console.log('Category2data:', category2Datum)
                const tooltipContent = `
                    <div class="tooltip-title">Tooltip Title</div>
                    <div>X Data: ${d.categoryData}</div>
                    <div>Y Data: ${category2Datum.categoryData}</div>
                `;

                const tooltip = document.getElementById('tooltip');
                tooltip.innerHTML = tooltipContent;
                tooltip.style.display = 'block';
                tooltip.style.left = (event.pageX + vis.config.tooltipPadding) + 'px';
                tooltip.style.top = (event.pageY + vis.config.tooltipPadding) + 'px';
            })
            .on('mouseout', function () {
                const tooltip = document.getElementById('tooltip');
                tooltip.style.display = 'none';
            });
    }
}