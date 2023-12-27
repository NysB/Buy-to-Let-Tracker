
// Sample data
const data = [
    {
        "attribute": "Purchase Price",
        "city": "Cádiz",
    },

];

// Initialize chart with default city
updateChart();

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