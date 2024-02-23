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

  // Function to check if the category represents a percentage
function isPercentageCategory(category) {
    switch (category) {
        case 'poverty_perc':
        case 'education_less_than_high_school_percent':
        case 'percent_inactive':
        case 'percent_smoking':
        case 'elderly_percentage':
        case 'percent_no_heath_insurance':
        case 'percent_high_blood_pressure':
        case 'percent_coronary_heart_disease':
        case 'percent_stroke':
        case 'percent_high_cholesterol':
            return true;
        default:
            return false;
    }
}

// Function to check if the category represents numbers
function isNumberCategory(category) {
    switch (category) {
        case 'number_of_hospitals':
        case 'number_of_primary_care_physicians':
            return true;
        case 'park_access':
            return true;
        case 'air_quality':
            return true;
        default:
            return false;
    }
}

// Function to check if the category is categorical
function isCategoricalCategory(category) {
    switch (category) {
        case 'urban_rural_status':
            return true;
        default:
            return false;
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
    
        // Define scales for x and y axes
        vis.xScale = d3.scaleBand()
            .domain([]) // Placeholder domain, will be updated dynamically
            .range([0, vis.width])
            .padding(0.1);
    
        vis.yScale = d3.scaleLinear()
            .domain([0, 1]) // Placeholder domain, will be updated dynamically
            .range([vis.height, 0]); // Inverted range for y-axis
    
        // Create x-axis
        vis.xAxis = d3.axisBottom(vis.xScale);
    
        // Append x-axis to SVG
        vis.svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.height + vis.config.margin.top - 20})`)
            .call(vis.xAxis)
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .attr('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em');
    
        // Create y-axis
        vis.yAxis = d3.axisLeft(vis.yScale);
    
        // Append y-axis to SVG
        vis.svg.append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`)
            .call(vis.yAxis);
    
        // Log successful initialization
        console.log('Histogram initialized successfully.');
    
        // Render the bars
        vis.renderBars();
    }
    
    
    renderBars() {
        let vis = this;

        // Filter the data with valid values and missing values
        let validData = vis.data.filter(d => d.categoryData !== -1);
        let missingData = vis.data.filter(d => d.categoryData === -1);

        // Determine the data type based on the category
        let dataType;
        if (isPercentageCategory(vis.category)) {
            dataType = 'percentage';
        } else if (isNumberCategory(vis.category)) {
            dataType = 'number';
        } else if (isCategoricalCategory(vis.category)) {
            dataType = 'categorical';
        }

        // Group the counties with similar values
        let groupedData = vis.groupData(validData, dataType);

        // Render bars for grouped data
        vis.renderGroupedBars(groupedData);
    }

    // Helper function to group counties with similar values
    groupData(data, dataType) {
        let groupedData = {};

        data.forEach(d => {
            let value = d.categoryData;

            // Round the value for percentage and number types
            if (dataType === 'percentage' || dataType === 'number') {
                value = Math.round(value);
            }

            if (!groupedData[value]) {
                groupedData[value] = [];
            }

            groupedData[value].push(d);
        });

        return groupedData;
    }

    renderGroupedBars(groupedData) {
        let vis = this;
    
        // Determine the maximum count for scaling the y-axis
        let maxCount = d3.max(Object.values(groupedData), d => d.length);
    
        // Update the yScale domain based on the maximum count
        vis.yScale.domain([0, maxCount]);
    
        // Collect categories after grouping the data
        let categories = Object.keys(groupedData);
    
        // Calculate the width of each bar based on the number of groups and available space
        let numGroups = categories.length;
        let barWidth = vis.width / numGroups;
    
        // Render bars for each group
        categories.forEach((value, index) => {
            let data = groupedData[value];
    
            // Calculate x position for the group
            let xPosition = index * barWidth;
    
            // Render a single bar for the group
            vis.barGroup.append('rect')
                .attr('class', 'bar')
                .attr('x', vis.config.margin.left + xPosition) // Adjust the x-coordinate
                .attr('y', vis.yScale(data.length) + vis.config.margin.top) // Adjust the y-coordinate
                .attr('width', barWidth)
                .attr('height', vis.height - vis.yScale(data.length))
                .attr('fill', 'steelblue');
        });
    
        // Update x-axis labels based on categories
        vis.xScale = d3.scaleBand()
            .domain(categories)
            .range([0, vis.width])
            .padding(0.1);
    
        // Update x-axis
        vis.svg.select('.x-axis')
            .transition()
            .duration(500)
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.height + vis.config.margin.top})`) // Adjust x-axis translation
            .call(d3.axisBottom(vis.xScale).tickFormat((d, i) => categories[i]))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .attr('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em');
        
        // Update the y-axis based on the new domain
        vis.svg.select('.y-axis')
            .transition()
            .duration(500)
            .call(d3.axisLeft(vis.yScale));
    }
    
    

}