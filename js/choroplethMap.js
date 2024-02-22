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
                  <div class="tooltip-title">${d.properties && d.properties.name ? d.properties.name : 'Unknown'}</div>
                  <div>${categoryValue}</div>
              `;
      
              d3.select('#tooltip')
                  .style('display', 'block')
                  .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                  .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                  .html(tooltipContent);
          })
          .on('mouseleave', () => {
              d3.select('#tooltip').style('display', 'none');
          });

      vis.g.append("path")
          .datum(topojson.mesh(vis.us, vis.us.objects.states, function(a, b) { return a !== b; }))
          .attr("id", "state-borders")
          .attr("d", vis.path);
  }
}
