// Style map
const map = L.map('map').setView([36, -5], 9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialize properties as an empty array
let properties = [];

// Variable to store the selected property
let selectedProperty = null;

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

// Function to fetch filtered data from the server and update the map with it
function filterAndRefreshMap() {
  const minPrice = document.getElementById('min-price').value;
  const maxPrice = document.getElementById('max-price').value;
  const municipality = document.getElementById('municipality').value;

  fetch('/filter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `min-price=${minPrice}&max-price=${maxPrice}&municipality=${municipality}`,
  })
    .then(response => response.json())
    .then(filteredData => {
      properties = filteredData;
      updateMap(properties);
    })
    .catch(error => {
      console.error('Error fetching filtered data:', error);
    });
}

// Attach the filterAndRefreshMap function to the Filter button click event
document.getElementById('filter-button').addEventListener('click', filterAndRefreshMap);

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

    // Function to update the selected property when a marker is clicked
    function updateSelectedProperty() {
      selectedProperty = property;
    }

    const image = property.image;
    marker.bindPopup(`
      <strong>${property.propertyType}</strong><br>
      <img src="${image}" alt="Property Image" width="150"><br>
      Price: €${property.purchasePrice}
    `).openPopup();

    marker.on('click', () => {
      updateSelectedProperty();
      
      document.getElementById('selected-property-info').innerHTML = `
        <h3>Economics</h3>
        <div class="horizontal-container">
          <div class="horizontal-property-info-block">
            <p id="price">Price: € ${property.purchasePrice}</p>
          </div>
          <div class="horizontal-property-info-block">
            <p id="predicted-rent">Predicted Monthly Rent (LT): € ${property.predictedMonthlyRent}</p>
          </div>
        </div>
        <h3>Description</h3>
          <div class="horizontal-container">
            <p id="description">${property.description}</p>
          </div>
          <div class="horizontal-container">
            <div class="horizontal-property-info-block">
              <p id="property-type">Property Type: ${property.propertyType}</p>
            </div>
            <div class="horizontal-property-info-block">
              <p id="size">Size: ${property.size}m2</p>
            </div>
          </div>  
          <div class="horizontal-container">
            <div class="horizontal-property-info-block">
              <p id="bathrooms">Bedrooms: ${property.bedrooms}</p>
            </div>
            <div class="horizontal-property-info-block">
              <p id="bathrooms">Bathrooms: ${property.bathrooms}</p>
            </div>
          </div>
          <div class="horizontal-container">
            <div class="horizontal-property-info-block">
              <p id="status">Status: ${property.status}</p>
            </div>
            <div class="horizontal-property-info-block">
              <p id="new-development">New Development: ${property.newDevelopment}</p>
            </div>
          </div>   
          <div class="horizontal-container">
            <div class="horizontal-property-info-block">
              <p id="floor">Floor: ${property.floor}</p>
            </div>
            <div class="horizontal-property-info-block">
              <p id="has-lift">Has Lift: ${property.hasLift}</p>
            </div>
          </div>   
          <div class="horizontal-container">
            <div class="horizontal-property-info-block">
              <p id="property-url">URL: <a href="${property.URL}" target="_blank">${property.URL}</a></p>
            </div>
          </div>        
      `;
    });
  });
}
