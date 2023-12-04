// returnGraph.js

// Sample data for the chart (in percentage)
var rentData = [600, 600, 600, 600, 600];
var mortgageData = [500, 500, 500, 500, 500];
var returnData = [2, 2, 2, 2, 2];

// Set up the chart
var ctx = document.getElementById('returnChart').getContext('2d');
var returnChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: Array.from({ length: 5 }, (_, i) => i + 1), // Years 1 to 5
        datasets: [
            {
                label: 'Rent Earned',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                data: rentData,
            },
            {
                label: 'Mortgage Repaid',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                data: mortgageData,
            },
            {
                label: 'Return',
                type: 'line',
                fill: false,
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                data: returnData,
                yAxisID: 'return-axis',
            },
        ],
    },
    options: {
        scales: {
            yAxes: [
                {
                    id: 'bar-axis',
                    type: 'linear',
                    position: 'left',
                    scaleLabel: {
                        display: true,
                        labelString: 'Amount (Bar Axis)',
                    },
                },
                {
                    id: 'return-axis',
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        beginAtZero: true,
                        callback: function (value) {
                            return value + '%';
                        },
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Return (%)',
                    },
                },
            ],
        },
    },
});


