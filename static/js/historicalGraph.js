
// Declare the data variable

let purchaseData;
let rentData;


// Get the canvas element

let ctxPurchase = document.getElementById('myChartPurchase').getContext('2d');
let ctxRent = document.getElementById('myChartRent').getContext('2d');


// Create the bar charts

let myChartPurchase = new Chart(ctxPurchase, {
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

let myChartRent = new Chart(ctxRent, {
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


// Function to update the Purchase chart based on selected city

function updateChartPurchase() {
    let selectedCity = document.getElementById('citySelect').value;
    let uniqueDates = [...new Set(purchaseData.map((item) => item.date))];
  

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
  

    // Define custom background colors for each date
    
    let backgroundColors = ['#4472C4', '#ED7D31', '#A5A5A5', '#FFC000', '#5B9BD5', '#70AD47'];
  

    // Prepare data for Chart.js
    
    let chartDataPurchase = {
      labels: uniqueGroups,
      datasets: uniqueDates.map((date, index) => ({
        label: date,
        data: uniqueGroups.map((group) => {
          
          let groupData = purchaseData.filter((entry) => entry.group === group && entry.city === selectedCity);
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
    
    myChartPurchase.data = chartDataPurchase;
  

    // Update the chart
    
    myChartPurchase.update();
}


// Function to update the Rent chart based on selected city

function updateChartRent() {
    let selectedCity = document.getElementById('citySelect').value;
    let uniqueDates = [...new Set(rentData.map((item) => item.date))];
  

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
  

    // Define custom background colors for each date
    
    let backgroundColors = ['#4472C4', '#ED7D31', '#A5A5A5', '#FFC000', '#5B9BD5', '#70AD47'];
  

    // Prepare data for Chart.js
    
    let chartDataRent = {
      labels: uniqueGroups,
      datasets: uniqueDates.map((date, index) => ({
        label: date,
        data: uniqueGroups.map((group) => {
          
          let groupData = rentData.filter((entry) => entry.group === group && entry.city === selectedCity);
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
    
    myChartRent.data = chartDataRent;
  

    // Update the chart
    
    myChartRent.update();
}


// Function to fetch the Property data from the server

function historicalPropertyGraph() {
    fetch('/historicalPurchaseData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            purchaseData = [];

            responseData.forEach((entry) => {
                const city = entry.city;
                const date = new Date(entry.date).toISOString().split('T')[0];
              
                Object.keys(entry).forEach((key) => {
                  if (key !== 'attribute' && key !== 'city' && key !== 'date') {
                    const group = key;
                    const value = entry[key];
              
                    purchaseData.push({
                      city: city,
                      group: group,
                      date: date,
                      value: value,
                    });
                  }
                });
              });
            

            // Call the updateChart function with the fetched data
            
            updateChartPurchase();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


// Function to fetch the Rent data from the server

function historicalRentGraph() {
    fetch('/historicalRentData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            rentData = [];

            responseData.forEach((entry) => {
                const city = entry.city;
                const date = new Date(entry.date).toISOString().split('T')[0];
              
                Object.keys(entry).forEach((key) => {
                  if (key !== 'attribute' && key !== 'city' && key !== 'date') {
                    const group = key;
                    const value = entry[key];
              
                    rentData.push({
                      city: city,
                      group: group,
                      date: date,
                      value: value,
                    });
                  }
                });
              });
            

            // Call the updateChart function with the fetched data
            
            updateChartRent();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


historicalPropertyGraph();
historicalRentGraph();