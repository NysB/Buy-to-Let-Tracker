
// Function to update the chart based on selected city
function updateChart() {
    const selectedCity = document.getElementById('citySelect').value;
    const cityData = data.filter(item => item.city === selectedCity);

    // Clear previous chart
    document.getElementById('chart').innerHTML = '';

    // Create bars for each attribute
    cityData.forEach(item => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.height = `${item.fifty / 1000}px`; // Adjust height as needed
      bar.innerText = `${item.attribute} - ${item.fifty.toFixed(2)}`;
      document.getElementById('chart').appendChild(bar);
    });
}


// Function to fetch data from the server and create the graphs

function historicalGraph() {
    fetch('/historicalPurchaseData')
        .then(response => response.json())
        .then(data => {


            // Generate cumulative data
            
            updateChart();


            // Log arrays after the updateGraph function

            console.log('initializeGraph: cumulativeRentData:', cumulativeRentData);
            console.log('initializeGraph: cumulativeInterestData:', cumulativeInterestData);
            console.log('initializeGraph: cumulativePrincipalData:', cumulativePrincipalData);
            console.log('initializeGraph: returnData:', returnData);
            console.log('initializeGraph: propertyValueData:', propertyValueData);
            console.log('initializeGraph: outstandingMortgageData:', outstandingMortgageData);


            // update Charts

            returnChart.update();
            balanceSheetChart.update();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

historicalGraph();

