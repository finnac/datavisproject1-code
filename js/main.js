// Import necessary functions from chloropleth.js
import { renderChloropleth } from './chloropleth.js';
// // Import necessary functions from scatterplot.js
// import { renderScatterplot } from './scatterplot.js';
// // Import necessary functions from histogram.js
// import { renderHistogram } from './histogram.js';

let loadedData; // Define a variable to store the loaded and processed data

d3.csv('data/national_health_data.csv')
  .then(data => {
    console.log('Data loading complete.');
    //uncomment below line if you want it to log the data
    // console.log(data);

    //'urban_rural_status' is treated as a string field,
    //same with display_name


    // Process the data
    data.forEach(d => {
      // Convert relevant fields to the appropriate data types
      // d.cnty_fips = +d.cnty_fips may need this not here because I think topojson doesn't want it typed as a number
      d.poverty_perc = +d.poverty_perc;
      d.median_household_income = +d.median_household_income;
      d.education_less_than_high_school_percent = +d.education_less_than_high_school_percent;
      d.air_quality = +d.air_quality;
      d.park_access = +d.park_access;
      d.percent_inactive = +d.percent_inactive;
      d.percent_smoking = +d.percent_smoking;
      d.elderly_percentage = +d.elderly_percentage;
      d.number_of_hospitals = +d.number_of_hospitals;
      d.number_of_primary_care_physicians = +d.number_of_primary_care_physicians;
      d.percent_no_heath_insurance = +d.percent_no_heath_insurance;
      d.percent_high_blood_pressure = +d.percent_high_blood_pressure;
      d.percent_coronary_heart_disease = +d.percent_coronary_heart_disease;
      d.percent_stroke = +d.percent_stroke;
      d.percent_high_cholesterol = +d.percent_high_cholesterol;
    });

    loadedData = data; // Store the processed data in the variable

    // Populate dropdown menus with data categories
    const categoryDropdowns = document.querySelectorAll('#category1, #category2');
    Object.keys(data[0]).forEach(category => {
        if (category !== 'cnty_fips' && category !== 'display_name') {
            categoryDropdowns.forEach(dropdown => {
                const option = document.createElement('option');
                option.text = getCategoryLabel(category); // Get the user-friendly label
                option.value = category; // Set the actual category name as the value so we can use it later when actually processing data for vis
                dropdown.add(option);
            });
        }
    });

    // Set the default label for Category 2 (since pov % and this are going to be my baselines for testing)
    document.getElementById('category2').value = 'education_less_than_high_school_percent';

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
    // Function to update visualization based on user selection
    function updateVisualization(category1, category2, vizType) {
      // Check the selected visualization type and call the respective rendering function
      switch (vizType) {
          case 'scatterplot':
              // renderScatterplot(loadedData, category1, category2);
              break;
          case 'chloropleth':
              renderChloropleth(loadedData, category1, category2);
              break;
          case 'histogram':
              // renderHistogram(loadedData, category1, category2);
              break;
          default:
              console.log('Invalid visualization type selected.');
              break;
      }
    }

    // Event listeners for dropdown menus
    document.getElementById('category1').addEventListener('change', function() {
        let category1 = this.value;
        let category2 = document.getElementById('category2').value;
        let vizType = document.getElementById('vizType').value;
        updateVisualization(category1, category2, vizType);
    });

    document.getElementById('category2').addEventListener('change', function() {
        let category1 = document.getElementById('category1').value;
        let category2 = this.value;
        let vizType = document.getElementById('vizType').value;
        updateVisualization(category1, category2, vizType);
    });

    // Event listener for visualization type dropdown
    document.getElementById('vizType').addEventListener('change', function() {
        let vizType = this.value;
        console.log(`Selected Visualization Type: ${vizType}`);
        
        // Call the respective function based on the selected visualization type
        switch (vizType) {
            case 'scatterplot':
                // Call function to render scatterplot
                // renderScatterplot();
                break;
            case 'chloropleth':
                // Call function to render chloropleth
                renderChloropleth(loadedData, category1, category2); // Pass loaded and processed data to the rendering function
                break;
            case 'histogram':
                // Call function to render histogram
                // renderHistogram();
                break;
            default:
                console.log('Invalid visualization type selected.');
                break;
        }
    });
  })
  .catch(error => {
    console.error('Error loading the data');
  });


// Plot.plot({
//   width: 975,
//   height: 610,
//   projection: "identity",
//   color: {
//     type: "quantize",
//     n: 9,
//     domain: [1, 10],
//     scheme: "blues",
//     label: "Unemployment rate (%)",
//     legend: true
//   },
//   marks: [
//     Plot.geo(counties, Plot.centroid({
//       fill: d => unemployment.get(d.id),
//       tip: true,
//       channels: {
//         County: d => d.properties.name,
//         State: d => statemap.get(d.id.slice(0,2)).properties.name
//       }
//     })),
//     Plot.geo(states, {stroke: "white"})
//   ]
// })

