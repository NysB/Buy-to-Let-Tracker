// Style map
const map = L.map('map').setView([36, -5], 9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialize properties as an empty array
let properties = [];

// Function to fetch data from the server and initialize the map with it
function initializeMap() {
  fetch('/start')
    .then(response => response.json())
    .then(data => {
      properties = data;
      updateMap(properties);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

// Call the initializeMap function to fetch and display the data
initializeMap();

// Function to update the map with markers
function updateMap(data) {
  // Clear existing markers
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Add new markers
  data.forEach(property => {
    const marker = L.marker([property.lat, property.lon]).addTo(map);
    const image = property.image;
    marker.bindPopup(`
      <strong>${property.propertyType}</strong><br>
      <img src="${image}" alt="Property Image" width="150"><br>
      Price: $${property.price}
    `).openPopup();

    marker.on('click', () => {
      document.getElementById('selected-property-info').innerHTML = `
        <h3>Economics</h3>
        <p id="price">Price: €${property.price}</p>
        <p id="predicted-rent">Predicted Monthly Rent (LT): €${property.predictedRentPrice}</p>
        <h3>Description</h3>
        <p id="property-type">Property Type: ${property.propertyType}</p>
        <p id="bedrooms">Bedrooms: ${property.bedrooms}</p>
        <p id="bathrooms">Bathrooms: ${property.bathrooms}</p>
        <p id="size">Size: ${property.size}</p>
        <p id="status">Status: ${property.status}</p>
        <p id="floor">Floor: ${property.floor}</p>
        <p id="has-lift">Has Lift: ${property.hasLift}</p>
        <p id="new-development">New Development: ${property.newDevelopment}</p>
        <p id="property-size">Size: ${property.size}m2</p>
        <p id="property-url">URL: <a href="${property.URL}" target="_blank">${property.URL}</a></p>
        <div id="roi-chart-container">
          <canvas id="roi-chart" width="400" height="400"></canvas>
        </div>
      `;

      // Calculate and display ROI
      calculateAndDisplayROI(property);
    });
  });
}

// Function to calculate Return on Investment (ROI)
function calculateROI(ltv, mortgageRate, mortgageTenor) {
  // You can add your ROI calculation logic here
  const investment = 100000; // Replace with your actual investment amount
  const rentIncome = 12000; // Replace with your annual rent income

  const mortgageAmount = investment * (ltv / 100);
  const interestExpense = (mortgageAmount * mortgageRate) / 100;
  const totalExpenses = interestExpense;
  const netIncome = rentIncome - totalExpenses;

  const roi = (netIncome / investment) * 100;

  return roi.toFixed(2);
}

// Function to display ROI in a chart
function displayROIChart(ltv, mortgageRate, mortgageTenor) {
  const roi = calculateROI(ltv, mortgageRate, mortgageTenor);

  const roiChartCanvas = document.getElementById('roi-chart');
  const roiChart = new Chart(roiChartCanvas, {
    type: 'bar',
    data: {
      labels: ['Return on Investment (%)'],
      datasets: [
        {
          label: 'ROI',
          data: [roi],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Add an event listener to the form to handle ROI calculation
document.querySelector('#filter-form').addEventListener('submit', function (e) {
  e.preventDefault();

  // Get the form input values inside the event handler
  const ltv = parseFloat(document.querySelector('#ltv').value);
  const mortgageRate = parseFloat(document.querySelector('#mortgage-rate').value);
  const mortgageTenor = parseInt(document.querySelector('#mortgage-tenor').value);

  // Fetch filtered data from the server
  fetch('/filter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `ltv=${ltv}&mortgage-rate=${mortgageRate}&mortgage-tenor=${mortgageTenor}`,
  })
    .then(response => response.json())
    .then(data => {
      updateMap(data); // Update the map with filtered data
      displayROIChart(ltv, mortgageRate, mortgageTenor);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});
