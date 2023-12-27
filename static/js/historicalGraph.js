
// Declare the data variable
let data;

// Get the canvas element
const ctx = document.getElementById('myChart').getContext('2d');

// Create the initial bar chart
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {},  // Set initial data as an empty object
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
    // Move this line inside the function
    const uniqueDates = [...new Set(data.map(item => item.date))];

    console.log('updateChart: uniqueDates:', uniqueDates);

    // Extract unique groups and cities
    const uniqueGroups = ['zeroBedroom', 'oneBedroom', 'twoBedroom', 'threeBedroom', 'fourBedroom', 'fiveBedroom', 'moreThanFiveBedroom', 'twentyFive', 'fifty', 'seventyFive', 'hundred', 'hundredFifty', 'twoHundred', 'moreThanTwoHundred'];
    const uniqueCities = [...new Set(data.map(item => item.city))];

    console.log('updateChart: uniqueGroups:', uniqueGroups);
    console.log('updateChart: uniqueCities:', uniqueCities);

    // Define custom background colors for each date
    const backgroundColors = ['#FF5733', '#33FF57', '#5733FF', '#FFFF33', '#33FFFF'];

    // Prepare data for Chart.js
    const chartData = {
        labels: uniqueGroups,
        datasets: uniqueDates.map((date, index) => ({
            label: date,
            data: uniqueGroups.map(group => {
                // Filter data for the specific group, city, and date
                const groupData = data.filter(entry => entry.city === group);
                const cityData = groupData.filter(entry => new Date(entry.date).getTime() === new Date(date).getTime());
                // Assuming you want to sum the values for the specified city and group on that date
                const sum = cityData.reduce((accumulator, entry) => accumulator + entry.value, 0);
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
    fetch('/historicalRentData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            // Assign the retrieved data to the data variable
            data = responseData;

            // Call the updateChart function with the fetched data
            updateChart();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

historicalGraph();
