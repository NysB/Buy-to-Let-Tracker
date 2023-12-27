// Sample data
const data = [
    { group: 'Group A', date: '2023-01-01', value: 10 },
    { group: 'Group A', date: '2023-01-02', value: 15 },
    { group: 'Group A', date: '2023-01-03', value: 20 },
    { group: 'Group A', date: '2023-01-04', value: 25 },
    { group: 'Group A', date: '2023-01-05', value: 30 },
    { group: 'Group B', date: '2023-01-01', value: 8 },
    { group: 'Group B', date: '2023-01-02', value: 12 },
    { group: 'Group B', date: '2023-01-03', value: 18 },
    { group: 'Group B', date: '2023-01-04', value: 22 },
    { group: 'Group B', date: '2023-01-05', value: 28 },
];

// Extract unique dates and groups
const uniqueDates = [...new Set(data.map(item => item.date))];
const uniqueGroups = [...new Set(data.map(item => item.group))];

// Define custom background colors for each date
const backgroundColors = ['#FF5733', '#33FF57', '#5733FF', '#FFFF33', '#33FFFF'];

// Prepare data for Chart.js
const chartData = {
    labels: uniqueGroups, // Reverse the order to show groups on X-axis
    datasets: uniqueDates.map((date, index) => ({
        label: date,
        data: uniqueGroups.map(group => {
            const item = data.find(entry => entry.group === group && entry.date === date);
            return item ? item.value : 0;
        }),
        backgroundColor: backgroundColors[index], // Use custom background color
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1,
    })),
};

// Get the canvas element
const ctx = document.getElementById('myChart').getContext('2d');

// Create the bar chart
const myChart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
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