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
  
class ChoroplethMap {
  constructor(parentElement, category, data, config) {
      this.parentElement = parentElement;
      this.category = category;
      this.data = data;

      this.config = {
          containerWidth: config.containerWidth || 600,
          containerHeight: config.containerHeight || 600,
          margin: config.margin || {top: 10, right: 10, bottom: 10, left: 10},
          tooltipPadding: config.tooltipPadding || 10,
          legendBottom: config.legendBottom || 50,
          legendLeft: config.legendLeft || 50,
          legendRectHeight: config.legendRectHeight || 12,
          legendRectWidth: config.legendRectWidth || 150
      };

      this.us = this.data;

      this.initVis();
  }

  initVis() {
      let vis = this;

      console.log('Initializing visualization...');
      console.log('Parent element:', vis.parentElement);

      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

      vis.svg = d3.select(vis.parentElement).append('svg')
          .attr('class', 'center-container')
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);

      console.log('Visualization initialized successfully.');

      vis.svg.append('rect')
          .attr('class', 'background center-container')
          .attr('height', vis.config.containerWidth)
          .attr('width', vis.config.containerHeight)
          .on('click', vis.clicked);

      vis.projection = d3.geoAlbersUsa()
          .translate([vis.width /2 , vis.height / 2])
          .scale(vis.width);

      vis.colorScale = d3.scaleLinear()
          .domain(d3.extent(vis.data.objects.counties.geometries, d => d.properties[vis.category]))
          .range(['#cfe2f2', '#0d306b'])
          .interpolate(d3.interpolateHcl);

      vis.path = d3.geoPath()
          .projection(vis.projection);

      vis.g = vis.svg.append("g")
          .attr('class', 'center-container center-items us-state')
          .attr('transform', 'translate('+vis.config.margin.left+','+vis.config.margin.top+')')
          .attr('width', vis.width + vis.config.margin.left + vis.config.margin.right)
          .attr('height', vis.height + vis.config.margin.top + vis.config.margin.bottom);

      vis.counties = vis.g.append("g")
          .attr("id", "counties")
          .selectAll("path")
          .data(topojson.feature(vis.us, vis.us.objects.counties).features)
          .enter().append("path")
          .attr("d", vis.path)
          .attr('fill', d => {
              // Handle missing or categorical values
              if (d.properties[vis.category] === -1 || isNaN(d.properties[vis.category])) {
                  return 'url(#lightstripe)';
              } else {
                  return vis.colorScale(d.properties[vis.category]);
              }
          });

          vis.counties
          .on('mousemove', (d, event) => {
            console.log('Data object:', d); // Log the data object
            console.log('Category:', vis.category); // Log the category being accessed
        
            // Check if properties and name exist before accessing
            const categoryValue = d.properties && d.properties[vis.category] !== undefined && d.properties[vis.category] !== -1
                ? `<strong>${d.properties[vis.category]}</strong>`
                : 'No data available';
        
            const tooltipContent = `
                <div class="tooltip-title">${getCategoryLabel(vis.category)}</div>
                <div><strong>County:</strong> ${d.properties && d.properties.display_name ? d.properties.display_name : 'Unknown'}</div>
                <div><strong>${getCategoryLabel(vis.category)}:</strong> ${categoryValue}</div>
            `;
        
            const tooltip = document.getElementById('tooltip');
            tooltip.innerHTML = tooltipContent;
            tooltip.style.display = 'block';
            tooltip.style.left = (event.pageX + vis.config.tooltipPadding) + 'px';
            tooltip.style.top = (event.pageY + vis.config.tooltipPadding) + 'px';
        })

      vis.g.append("path")
          .datum(topojson.mesh(vis.us, vis.us.objects.states, function(a, b) { return a !== b; }))
          .attr("id", "state-borders")
          .attr("d", vis.path);
  }
}
