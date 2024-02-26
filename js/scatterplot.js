let category2DataCopy;
// Function to get the user-friendly label for each category
function getCategoryLabel(category) {
    switch (category) {
        case 'poverty_perc':
            return 'Poverty Percentage';
        case 'median_household_income':
            return 'Median Household Income';
        case 'education_less_than_high_school_percent':
            return 'Education Less Than High School Percentage';
        case 'air_quality':
            return 'Air Quality';
        case 'park_access':
            return 'Park Access';
        case 'percent_inactive':
            return 'Percent Inactive';
        case 'percent_smoking':
            return 'Percent Smoking';
        case 'urban_rural_status':
            return 'Urban/Rural Status';
        case 'elderly_percentage':
            return 'Elderly Percentage';
        case 'number_of_hospitals':
            return 'Number of Hospitals';
        case 'number_of_primary_care_physicians':
            return 'Number of Primary Care Physicians';
        case 'percent_no_heath_insurance':
            return 'Percent No Health Insurance';
        case 'percent_high_blood_pressure':
            return 'Percent High Blood Pressure';
        case 'percent_coronary_heart_disease':
            return 'Percent Coronary Heart Disease';
        case 'percent_stroke':
            return 'Percent Stroke';
        case 'percent_high_cholesterol':
            return 'Percent High Cholesterol';
        default:
            return category; // Use the category name as the label by default
    }
  }

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
    
        // Define visualization dimensions
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
    
        // Create SVG container for the scatterplot
        vis.svg = d3.select(vis.parentElement)
            .append('svg')
            .attr('class', 'center-container')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
    
        // Append a group element for the main content, leaving space for axes
        vis.mainGroup = vis.svg.append('g')
            .attr('class', 'main-group')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.bottom})`);
    
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
    
        // Add x-axis
        vis.mainGroup.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${vis.height})`)
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("class", "axis-label")
            .attr("x", vis.width / 2)
            .attr("y", 40)
            .style("text-anchor", "middle")
            .text(getCategoryLabel(vis.category1));
    
        // Add y-axis
        vis.mainGroup.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(yScale))
            .append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -vis.height / 2)
            .attr("y", -40)
            .style("text-anchor", "middle")
            .text(getCategoryLabel(vis.category2));
            
           // Add data points
            vis.mainGroup.selectAll('.circle')
            .data(vis.category1Data)
            .enter()
            .append('circle')
            .attr('class', 'circle')
            .attr('cx', d => {
                if (d.categoryData === -1) {
                    return 0; // Display on the x-axis if categoryData is -1
                }
                return xScale(d.categoryData);
            })
            .attr('cy', (d, i) => {
                if (vis.category2Data[i].categoryData === -1) {
                    return vis.height; // Display on the y-axis if category2Data is -1
                }
                return yScale(vis.category2Data[i].categoryData);
            })
            .attr('r', 5)
            .attr('fill', 'steelblue')
            .on('mouseover', function (event, d, i) {
                const category1Datum = d;

                const category2Datum = category2DataCopy.find(item => item.countyName === d.countyName);
                
                // Check if category data is -1, if so, display "no data"
                const category1Value = d.categoryData === -1 ? "No data" : d.categoryData;
                const category2Value = category2Datum.categoryData === -1 ? "No data" : category2Datum.categoryData;

                const tooltipContent = `
                    <div class="tooltip-title">${d.countyName}</div>
                    <div><strong>County Name:</strong>  ${d.countyName}</div>
                    <div><strong>County FIPS:</strong> ${d.countyFIPS}</div>
                    <div><strong>${getCategoryLabel(vis.category2)}:</strong> ${category2Value}</div>
                    <div><strong>${getCategoryLabel(vis.category1)}:</strong> ${category1Value}</div>
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