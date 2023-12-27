// Function to update the chart based on selected city
function updateChart() {
    const selectedCity = document.getElementById('citySelect').value;
    const cityData = data.filter(item => item.city === selectedCity);
  
    // Clear previous chart
    const chartContainer = document.getElementById('chart');
    chartContainer.innerHTML = '';
  
    // Create bars for each attribute
    cityData.forEach(item => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      // Adjust height as needed (dividing by 1000 might be too much, consider adjusting)
      bar.style.height = `${item.fifty / 1000}px`;
      bar.innerText = `${item.attribute} - ${item.fifty.toFixed(2)}`;
      chartContainer.appendChild(bar);
    });
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
      .then(data => {
        // Call the updateChart function with the fetched data
        updateChart(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  
  // Call the historicalGraph function
  historicalGraph();
  