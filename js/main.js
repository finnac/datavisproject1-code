
// import { renderChloropleth } from './chloropleth.js';
// // Import necessary functions from scatterplot.js
// import { renderScatterplot } from './scatterplot.js';
// // Import necessary functions from histogram.js
// import { renderHistogram } from './histogram.js';

import * as topojson from "./topojson-client.min.js";

let loadedData; // Define a variable to store the loaded and processed data
let usData; // Define a variable to store the US object data
let chloropleth1Data;
let chloropleth2Data;
let histogram1Data;
let histogram2Data;
let scatterplot1Data;
let scatterplot2Data;
let combinedScatterplotData;

let category1 = 'poverty_perc'; // Default value for category1
let category2 = 'education_less_than_high_school_percent'; // Default value for category2

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

    function processDataForChoropleth(category) {
        return Promise.all([
            d3.json('data/counties-10m.json'),
            d3.csv('data/national_health_data.csv')
        ]).then(data => {
            const geoData = data[0];
            const healthData = data[1];
    
            // Combine both datasets by adding the category's data to the GeoJSON file
            geoData.objects.counties.geometries.forEach(d => {
                // Find the corresponding entry in the health data
                const healthEntry = healthData.find(entry => entry.cnty_fips === d.id);
    
                // If a matching entry is found, add the category's data along with cnty_fips and display_name
                if (healthEntry) {
                    // Convert relevant fields to the appropriate data types based on the category
                    switch (category) {
                        case 'poverty_perc':
                        case 'median_household_income':
                        case 'education_less_than_high_school_percent':
                        case 'air_quality':
                        case 'park_access':
                        case 'percent_inactive':
                        case 'percent_smoking':
                        case 'elderly_percentage':
                        case 'number_of_hospitals':
                        case 'number_of_primary_care_physicians':
                        case 'percent_no_heath_insurance':
                        case 'percent_high_blood_pressure':
                        case 'percent_coronary_heart_disease':
                        case 'percent_stroke':
                        case 'percent_high_cholesterol':
                            // Convert numerical fields to numbers
                            d.properties[category] = +healthEntry[category];
                            break;
                        default:
                            // For categorical fields, keep them as strings
                            // Add any additional processing logic as needed
                            d.properties[category] = healthEntry[category];
                            break;
                    }
    
                    // Add cnty_fips and display_name to the GeoJSON properties
                    d.properties.cnty_fips = healthEntry.cnty_fips;
                    d.properties.display_name = healthEntry.display_name;
                    
                    // Store the category data under a key named categoryData
                    d.properties.categoryData = healthEntry[category];
                }
            });
    
            // Return the combined dataset
            return geoData;
        }).catch(error => {
            console.error('Error loading the data:', error);
        });
    }

function processDataForCharts(category) {
    return d3.csv('data/national_health_data.csv').then(data => {
        let histogramData = []; // Initialize an array to store processed data for the histogram
        
        // Process the data to extract relevant attributes for histograms
        data.forEach(d => {
            // Convert relevant fields to the appropriate data types based on the category
            switch (category) {
                case 'poverty_perc':
                case 'median_household_income':
                case 'education_less_than_high_school_percent':
                case 'air_quality':
                case 'park_access':
                case 'percent_inactive':
                case 'percent_smoking':
                case 'elderly_percentage':
                case 'number_of_hospitals':
                case 'number_of_primary_care_physicians':
                case 'percent_no_heath_insurance':
                case 'percent_high_blood_pressure':
                case 'percent_coronary_heart_disease':
                case 'percent_stroke':
                case 'percent_high_cholesterol':
                    // Convert numerical fields to numbers
                    d[category] = +d[category];
                    break;
                default:
                    // For categorical fields, keep them as strings
                    // Add any additional processing logic as needed
                    break;
            }

            // Create an object containing relevant data for the histogram
            let histogramDatum = {
                categoryData: d[category], // Store the category data
                countyName: d.display_name, // Store the county name
                countyFIPS: d.cnty_fips // Store the county FIPS code
            };

            // Push the processed data object to the array
            histogramData.push(histogramDatum);
        });

        return histogramData; // Return the processed data for the histogram
    });
}

    // Function to update visualization based on user selection
    function updateVisualization(category1, category2, vizType) {
      // Check the selected visualization type and call the respective rendering function
      switch (vizType) {
          case 'scatterplot':
              // Clear the parent elements first
              document.getElementById('map1').innerHTML = '';
              document.getElementById('map2').innerHTML = '';

              processDataForCharts(category1).then(scatterplot1Data => {
                // Process data for the second scatterplot category
                processDataForCharts(category2).then(scatterplot2Data => {
                    // Combine two dataset arrays
                    const Scatterplot1 = new Scatterplot('.map1', scatterplot1Data, scatterplot2Data, category1, category2, {
                        containerWidth: 650,
                        containerHeight: 650,
                        margin: {top: 10, right: 10, bottom: 10, left: 10}
                    });
                    
                    document.getElementById('map1-label').textContent = getCategoryLabel(category1);
                    document.getElementById('map2-label').textContent = getCategoryLabel(category2);
                });
            });
                
              
              break;
         case 'chloropleth':
            // Clear the parent elements first
            document.getElementById('map1').innerHTML = '';
            document.getElementById('map2').innerHTML = '';

            // Process data for the first choropleth
            processDataForChoropleth(category1).then(chloropleth1Data => {
                const choroplethMap1 = new ChoroplethMap('.map1', category1, chloropleth1Data, {
                    containerWidth: 650,
                    containerHeight: 650,
                    margin: {top: 10, right: 10, bottom: 10, left: 10}
                });
            });

            // Process data for the second choropleth
            processDataForChoropleth(category2).then(chloropleth2Data => {
                const choroplethMap2 = new ChoroplethMap('.map2', category2, chloropleth2Data, {
                    containerWidth: 650,
                    containerHeight: 650,
                    margin: {top: 10, right: 10, bottom: 10, left: 10}
                });
            });

            document.getElementById('map1-label').textContent = getCategoryLabel(category1);
            document.getElementById('map2-label').textContent = getCategoryLabel(category2);
            
            break;

            case 'histogram':
                // Clear the parent elements first
                document.getElementById('map1').innerHTML = '';
                document.getElementById('map2').innerHTML = '';
    
                // Process data for the first histogram
                processDataForCharts(category1).then(data => {
                    histogram1Data = data;
                    // Create an instance of Histogram for the first histogram
                    const histogram1 = new Histogram('.map1', category1, histogram1Data, {
                        containerWidth: 600,
                        containerHeight: 550,
                        margin: {top: 10, right: 10, bottom: 10, left: 10}
                    });
                });
    
                // Process data for the second histogram
                processDataForCharts(category2).then(data => {
                    histogram2Data = data;
                    // Create an instance of Histogram for the second histogram
                    const histogram2 = new Histogram('.map2', category2, histogram2Data, {
                        containerWidth: 600,
                        containerHeight: 550,
                        margin: {top: 10, right: 10, bottom: 10, left: 10}
                    });
                });
    
                document.getElementById('map1-label').textContent = getCategoryLabel(category1);
                document.getElementById('map2-label').textContent = getCategoryLabel(category2);
    
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
                updateVisualization(category1, category2, vizType);
                break;
            case 'chloropleth':
                // Call updatevizfunction to render chloropleth
                updateVisualization(category1, category2, vizType);
                break;
            case 'histogram':
                console.log('Category 1:', category1);
                console.log('Category 2:', category2);
                
                updateVisualization(category1, category2, vizType);

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


