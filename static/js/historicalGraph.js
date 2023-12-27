
// Declare the data variable
let data;


// Get the canvas element
let ctx = document.getElementById('myChart').getContext('2d');

// Create the initial bar chart
let myChart = new Chart(ctx, {
    type: 'bar',
    data: {},  
    options: {
        scales: {
            x: {
                stacked: false,
            },
            y: {
                stacked: false,
            },
        },
    },
});


// Function to update the chart based on selected city
function updateChart() {
    let selectedCity = document.getElementById('citySelect').value;
    let uniqueDates = [...new Set(data.map((item) => item.date))];
  
    console.log('updateChart: selectedCity:', selectedCity);
    console.log('updateChart: uniqueDates:', uniqueDates);
  
    // Extract unique groups
    let uniqueGroups = [
      'zeroBedroom',
      'oneBedroom',
      'twoBedroom',
      'threeBedroom',
      'fourBedroom',
      'fiveBedroom',
      'moreThanFiveBedroom',
      'twentyFive',
      'fifty',
      'seventyFive',
      'hundred',
      'hundredFifty',
      'twoHundred',
      'moreThanTwoHundred',
    ];
  
    console.log('updateChart: uniqueGroups:', uniqueGroups);
  
    // Define custom background colors for each date
    let backgroundColors = ['#FF5733', '#33FF57', '#5733FF', '#FFFF33', '#33FFFF'];
  
    // Prepare data for Chart.js
    let chartData = {
      labels: uniqueGroups,
      datasets: uniqueDates.map((date, index) => ({
        label: date,
        data: uniqueGroups.map((group) => {
          
          let groupData = data.filter((entry) => entry.group === group && entry.city === selectedCity);
          let cityData = groupData.filter(
            (entry) => new Date(entry.date).getTime() === new Date(date).getTime()
          );
          
          let sum = cityData.reduce((accumulator, entry) => accumulator + entry.value, 0);
          return sum;
        }),
        backgroundColor: backgroundColors[index % backgroundColors.length],
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1,
      })),
    };
  
    // Update the existing chart data
    myChart.data = chartData;
  
    console.log('updateChart: chartData:', chartData);
  
    // Update the chart
    myChart.update();
  }


// Function to fetch data from the server and create the graphs
function historicalGraph() {
    fetch('/historicalPurchaseData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            // Assign the retrieved data to the data variable
            data = [];

            console.log('historicalGraph: responseData:', responseData);

            responseData.forEach((entry) => {
                const city = entry.city;
                const date = new Date(entry.date).toISOString().split('T')[0];
              
                Object.keys(entry).forEach((key) => {
                  if (key !== 'attribute' && key !== 'city' && key !== 'date') {
                    const group = key;
                    const value = entry[key];
              
                    data.push({
                      city: city,
                      group: group,
                      date: date,
                      value: value,
                    });
                  }
                });
              });
            
            console.log('historicalGraph: data:', data);

            // Call the updateChart function with the fetched data
            updateChart();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

historicalGraph();