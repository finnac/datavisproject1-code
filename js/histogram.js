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

        // Log initialization
        console.log('Initializing histogram...');
        console.log('Parent element:', vis.parentElement);

        // Define visualization dimensions
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // Create SVG container for the histogram
        vis.svg = d3.select(vis.parentElement)
            .append('svg')
            .attr('class', 'center-container')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

         // Create a group for the bars
         vis.barGroup = vis.svg.append('g')
         .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        // Define scales based on data types
        if (vis.data.every(d => typeof d.categoryData === 'number')) {
            // For numerical data
            vis.xScale = d3.scaleLinear()
                .domain([0, d3.max(vis.data, d => d.categoryData)])
                .range([0, vis.width]);
        } else {
            // For categorical data
            vis.xScale = d3.scaleBand()
                .domain(vis.data.map(d => d.countyName))
                .range([0, vis.width])
                .padding(0.1);
        }

        // Calculate the width of the bars
        vis.barWidth = vis.xScale.bandwidth ? vis.xScale.bandwidth() : vis.width / vis.data.length;


        // Create x-axis
        vis.xAxis = d3.axisBottom(vis.xScale);

     // Append x-axis to SVG
        vis.svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(${vis.config.margin.left}, ${vis.height + vis.config.margin.top - 20})`)
        .call(vis.xAxis);
                

        // Label the x-axis
        vis.svg.append('text')
            .attr('class', 'x-axis-label')
            .attr('transform', `translate(${vis.width / 2},${vis.height + vis.config.margin.top + 30})`)
            .style('text-anchor', 'middle')
            .text(vis.category); // Use the category for labeling

        // Log successful initialization
        console.log('Histogram initialized successfully.');

        // Render the bars
        vis.renderBars();
    }

    renderBars() {
        let vis = this;

        // Render bars based on data
        vis.barGroup.selectAll('.bar')
            .data(vis.data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', (d, i) => vis.xScale(d.countyName))
            .attr('y', d => vis.height - vis.config.margin.bottom - vis.config.margin.top)
            .attr('width', vis.barWidth)
            .attr('height', 0)
            .transition()
            .duration(1000)
            .attr('y', d => vis.height - vis.config.margin.bottom - vis.config.margin.top - (d.categoryData * vis.height))
            .attr('height', d => d.categoryData * vis.height)
            .attr('fill', 'steelblue');
    }
}