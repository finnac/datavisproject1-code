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
      d.cnty_fips = +d.cnty_fips
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

    // Extract all data categories except 'cnty_fips' and 'display_name', since we don't want those selectable
    const categories = Object.keys(data[0]).filter(key => key !== 'cnty_fips' && key !== 'display_name');

    // Populate dropdown menus with data categories
    const categoryDropdowns = document.querySelectorAll('#category1, #category2');
    categories.forEach(category => {
        categoryDropdowns.forEach(dropdown => {
            const option = document.createElement('option');
            option.text = category;
            option.value = category;
            dropdown.add(option);
        });
    });

    // Function to update visualization based on user selection
    function updateVisualization(category1, category2) {
      data.forEach(d => {
        console.log(`County FIPS: ${d.cnty_fips}, Display Name: ${d.display_name}, Urban/Rural Status: ${d.urban_rural_status}, ${category1}: ${d[category1]}, ${category2}: ${d[category2]}`);
        // You can perform further visualization logic here
      });
    }

    // Event listeners for dropdown menus
    document.getElementById('category1').addEventListener('change', function() {
        let category1 = this.value;
        let category2 = document.getElementById('category2').value;
        updateVisualization(category1, category2);
    });

    document.getElementById('category2').addEventListener('change', function() {
        let category1 = document.getElementById('category1').value;
        let category2 = this.value;
        updateVisualization(category1, category2);
    });

    // Event listener for visualization type dropdown
    document.getElementById('vizType').addEventListener('change', function() {
        let vizType = this.value;
        console.log(`Selected Visualization Type: ${vizType}`);
        // Call the respective function based on the selected visualization type
        // Example: if (vizType === 'chloropleth') renderChloropleth();
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

