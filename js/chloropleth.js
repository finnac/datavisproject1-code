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

export function renderChloropleth(data, category1, category2) {
    // Define the color scales for the chloropleth maps
    const colorSchemes = {
        category1: d3.scaleQuantize().range(d3.schemeBlues[9]),
        category2: d3.scaleQuantize().range(d3.schemeGreens[9])
    };

    // Extract data for category 1 and category 2
    const category1DataMap = new Map(data.map(d => [d.cnty_fips, d[category1]]));
    const category2DataMap = new Map(data.map(d => [d.cnty_fips, d[category2]]));

    // Create the SVG container
    const svg = d3.create("svg")
        .attr("width", 975)
        .attr("height", 610)
        .attr("viewBox", [0, 0, 975, 610])
        .attr("style", "max-width: 100%; height: auto;");

    // Append legend for category 1
    svg.append("g")
        .attr("transform", "translate(20,20)")
        .append(() => Legend(colorSchemes.category1, { title: `${category1} (%)`, width: 260 }));

    // Create paths for counties for category 1
    svg.append("g")
        .attr("transform", "translate(300,0)")
        .selectAll("path")
        .data(topojson.feature(data.us, data.us.objects.counties).features)
        .join("path")
            .attr("fill", d => colorSchemes.category1(category1DataMap.get(d.id)))
            .attr("d", d3.geoPath())
        .append("title")
            .text(d => `${d.properties.name}, ${data.statemap.get(d.id.slice(0, 2)).properties.name}\n${category1DataMap.get(d.id)}%`);

    // Append legend for category 2
    svg.append("g")
        .attr("transform", "translate(610,20)")
        .append(() => Legend(colorSchemes.category2, { title: `${category2} (%)`, width: 260 }));

    // Create paths for counties for category 2
    svg.append("g")
        .attr("transform", "translate(930,0)")
        .selectAll("path")
        .data(topojson.feature(data.us, data.us.objects.counties).features)
        .join("path")
            .attr("fill", d => colorSchemes.category2(category2DataMap.get(d.id)))
            .attr("d", d3.geoPath())
        .append("title")
            .text(d => `${d.properties.name}, ${data.statemap.get(d.id.slice(0, 2)).properties.name}\n${category2DataMap.get(d.id)}%`);

    // Add state boundaries
    svg.append("path")
        .datum(topojson.mesh(data.us, data.us.objects.states, (a, b) => a !== b))
        .attr("transform", "translate(300,0)")
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", d3.geoPath());

    // Return the SVG node
    return svg.node();
}