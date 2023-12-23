// Define variables
let purchasePrice;
let loanToValue;
let annualInterestRate;
let loanTermInYears;
let monthlyRent;
let rentTax;
let maintenanceCost;
let initialInvestment;
let cumulativeRentData = [];
let cumulativeInterestData = [];
let cumulativePrincipalData = [];
let returnData = [];
let propertyValueData = [];
let OutstandingMortgageData = [];


// Calculate Cumulative Rent Earned up to specified years

function calculateCumulativeRent(monthlyRent, years) {
    const monthsInYear = 12;
    let cumulativeRent = 0;

    for (let year = 1; year <= years; year++) {
        cumulativeRent += monthlyRent * monthsInYear;
    }

    return cumulativeRent;
}


// Calculate monthly mortgage payment

function calculateMortgagePayment(loanAmount, annualInterestRate, loanTermInYears) {
    const monthlyInterestRate = (annualInterestRate / 12) / 100;
    const totalPayments = loanTermInYears * 12;

    const monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));

    return monthlyPayment;
}


// Calculate amortization schedule

function generateAmortizationSchedule(loanAmount, annualInterestRate, loanTermInYears) {
    const monthlyInterestRate = (annualInterestRate / 12) / 100;
    const totalPayments = loanTermInYears * 12;

    const monthlyPayment = calculateMortgagePayment(loanAmount, annualInterestRate, loanTermInYears);

    let remainingLoanBalance = loanAmount;
    const amortizationSchedule = [];

    for (let month = 1; month <= totalPayments; month++) {
        const interestPayment = remainingLoanBalance * monthlyInterestRate;
        const principalPayment = monthlyPayment - interestPayment;

        remainingLoanBalance -= principalPayment;

        amortizationSchedule.push({
            month,
            payment: monthlyPayment.toFixed(2),
            principal: principalPayment.toFixed(2),
            interest: interestPayment.toFixed(2),
            balance: remainingLoanBalance.toFixed(2)
        });
    }

    return amortizationSchedule;
}


// Calculate cumulative interest up to specified years

function getCumulativeInterestPayment(schedule, years) {
    const interestByYear = {};
    let totalInterest = 0;

    for (let i = 0; i < schedule.length; i++) {
        const year = Math.ceil(schedule[i].month / 12);

        if (year > years) {
            break;
        }

        totalInterest += parseFloat(schedule[i].interest);

        interestByYear[year] = {
            cumulativeInterest: totalInterest.toFixed(2),
        };
    }

    return interestByYear;
}


// Calculate cumulative principal up to specified years

function getCumulativePrincipalPayment(schedule, years) {
    const principalByYear = {};
    let totalPrincipal = 0;

    for (let i = 0; i < schedule.length; i++) {
        const year = Math.ceil(schedule[i].month / 12);

        if (year > years) {
            break;
        }

        totalPrincipal += parseFloat(schedule[i].principal);

        principalByYear[year] = {
            cumulativePrincipal: totalPrincipal.toFixed(2)
        };
    }

    return principalByYear;
}


// Calculate remaining loan balance

function getRemainingLoanBalance(schedule, years) {
    let remainingBalance = 0;

    for (let i = 0; i < schedule.length; i++) {
        const year = Math.ceil(schedule[i].month / 12);

        if (year >= years) {
            remainingBalance = parseFloat(schedule[i].balance);
            break;
        }
    }

    return remainingBalance;
}


// Set up Return Chart

const returnCtx = document.getElementById('returnChart').getContext('2d');
console.log('returnCtx:', returnCtx);
const returnChart = new Chart(returnCtx, {
    type: 'bar',
    data: {
        labels: ["Year 0", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 10", "Maturity"],
        datasets: [
            {
                label: 'Initial Investment',
                backgroundColor: 'rgba(9, 91, 255, 1)',
                borderColor: 'rgba(127, 127, 127, 1)',
                borderWidth: 1,
                data: initialInvestment,
            },
            {
                label: 'Cumulative Rent Earned',
                backgroundColor: 'rgba(157, 195, 230, 1)',
                borderColor: 'rgba(0, 32, 96, 1)',
                borderWidth: 1,
                data: cumulativeRentData,
            },
            {
                label: 'Cumulative Interest Paid',
                backgroundColor: 'rgba(255, 91, 91, 1)',
                borderColor: 'rgba(158, 0, 0, 1)',
                borderWidth: 1,
                data: cumulativeInterestData,
            },
            {
                label: 'Cumulative Principal Paid',
                backgroundColor: 'rgba(244, 177, 131, 1)',
                borderColor: 'rgba(237, 125, 49, 1)',
                borderWidth: 1,
                data: cumulativePrincipalData,
            },
            {
                label: 'Expected return',
                type: 'line',
                fill: false,
                backgroundColor: 'rgba(0, 176, 80, 1)',
                borderColor: 'rgba(0, 176, 80, 1)',
                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 6,
                data: returnData,
                yAxisID: 'logarithmic-axis',
            },
        ],
    },
    options: {
        scales: {
            y: {
                display: false,
            },
            logarithmic: {
                type: 'logarithmic', 
                position: 'right', 
                id: 'logarithmic-axis', 
                display: false,
            },
            x: {
                display: true,
            },
        },
    },
});

// Set up Balance Sheet Chart

const balanceSheetCtx = document.getElementById('balanceSheetChart').getContext('2d');
console.log('balanceSheetCtx:', balanceSheetCtx);
const balanceSheetChart = new Chart(balanceSheetCtx, {
    type: 'bar',
    data: {
        labels: ["Year 0", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 10", "Maturity"],
        datasets: [
            {
                label: 'Property Value',
                backgroundColor: 'rgba(197, 224, 180, 1)',
                borderColor: 'rgba(56, 87, 35, 1)',
                borderWidth: 1,
                data: propertyValueData,
            },
            {
                label: 'Outstanding Mortgage',
                backgroundColor: 'rgba(244, 177, 131, 1)',
                borderColor: 'rgba(132, 60, 12, 1)',
                borderWidth: 1,
                data: OutstandingMortgageData,
            },
        ],
    },
    options: {
        scales: {
            y: {
                id: 'bar-axis',
                type: 'linear',
                position: 'left',
                scaleLabel: {
                    display: true,
                    labelString: 'Amount (Bar Axis)',
                },
            },
        },
    },
});


// Function to fetch data from the server and initialize the graphs
function initializeGraph() {
    fetch('/startGraph')
      .then(response => response.json())
      .then(data => {
        
        // Assign values from the fetched data
        purchasePrice = data.purchasePrice;
        loanToValue = data.loanToValue;
        annualInterestRate = data.annualInterestRate;
        loanTermInYears = data.loanTermInYears;
        monthlyRent = data.monthlyRent;
        rentTax = data.rentTax;
        maintenanceCost = data.maintenanceCost;
        
        // Generate cumulative data
        updateGraph();

        // Log arrays after the updateGraph function
        console.log('initializeGraph: cumulativeRentData:', cumulativeRentData);
        console.log('initializeGraph: cumulativeInterestData:', cumulativeInterestData);
        console.log('initializeGraph: cumulativePrincipalData:', cumulativePrincipalData);
        console.log('initializeGraph: returnData:', returnData);
        console.log('initializeGraph: propertyValueData:', propertyValueData);
        console.log('initializeGraph: OutstandingMortgageData:', OutstandingMortgageData);
        
        // update Charts
        returnChart.update();
        balanceSheetChart.update();
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }


initializeGraph();


// Function to fetch filtered data from the server and update the map with it
function filterAndRefreshGraph() {
    const ltv = document.getElementById('ltv').value;
    const mortgageRate = document.getElementById('mortgage-rate').value;
    const mortgageTenor = document.getElementById('mortgage-tenor').value;
    const taxes = document.getElementById('taxes').value;
    const maintenance = document.getElementById('maintenance').value;

    fetch('/updateGraph', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `ltv=${ltv}&mortgage-rate=${mortgageRate}&mortgage-tenor=${mortgageTenor}&taxes=${taxes}&maintenance=${maintenance}`,
    })
      .then(response => response.json())
      .then(data => {
        
        // Assign values from the fetched data
        purchasePrice = data.purchasePrice;
        loanToValue = data.loanToValue;
        annualInterestRate = data.annualInterestRate;
        loanTermInYears = data.loanTermInYears;
        monthlyRent = data.monthlyRent;
        rentTax = data.rentTax;
        maintenanceCost = data.maintenanceCost;
        
        // Generate cumulative data
        updateGraph();

        // Log arrays after the updateGraph function
        console.log('filterAndRefreshGraph: cumulativeRentData:', cumulativeRentData);
        console.log('filterAndRefreshGraph: cumulativeInterestData:', cumulativeInterestData);
        console.log('filterAndRefreshGraph: cumulativePrincipalData:', cumulativePrincipalData);
        console.log('filterAndRefreshGraph: returnData:', returnData);
        console.log('filterAndRefreshGraph: propertyValueData:', propertyValueData);
        console.log('filterAndRefreshGraph: OutstandingMortgageData:', OutstandingMortgageData);
        
        // update Charts
        returnChart.update();
        balanceSheetChart.update();
      })
      .catch(error => {
        console.error('Error fetching filtered data:', error);
      });
  }

// Attach the filterAndRefreshMap function to the Filter button click event
document.getElementById('update-button').addEventListener('click', filterAndRefreshGraph);


function updateGraph(){
    // Calculations
    const loanAmount = purchasePrice * loanToValue;
    const specificYears = [0, 1, 2, 3, 4, 5, 10, 15, 20, loanTermInYears];
    const amortizationSchedule = generateAmortizationSchedule(loanAmount, annualInterestRate, loanTermInYears);

    cumulativePrincipalData = [0];
    for (let i = 1; i <= loanTermInYears; i++) {
        if (specificYears.includes(i)) {
            const cumulativePrincipal = getCumulativePrincipalPayment(amortizationSchedule, i);
            cumulativePrincipalData.push(parseFloat(cumulativePrincipal[i]?.cumulativePrincipal || 0));
        }
    }

    cumulativeInterestData = [0];
    for (let i = 1; i <= loanTermInYears; i++) {
        if (specificYears.includes(i)) {
            const cumulativeInterest = getCumulativeInterestPayment(amortizationSchedule, i);
            cumulativeInterestData.push(parseFloat(cumulativeInterest[i]?.cumulativeInterest || 0));
        }
    }

    cumulativeRentData = [0];
    for (let i = 1; i <= loanTermInYears; i++) {
        if (specificYears.includes(i)) {
            cumulativeRentData.push(calculateCumulativeRent(monthlyRent, i));
        }
    }

    propertyValueData = [purchasePrice];
    for (let i = 2; i <= loanTermInYears; i++) {
        propertyValueData.push(purchasePrice);
    }

    OutstandingMortgageData = [loanAmount];
    for (let i = 2; i <= loanTermInYears; i++) {
        if (specificYears.includes(i)) {
            const remainingBalance = getRemainingLoanBalance(amortizationSchedule, i);
            OutstandingMortgageData.push(parseFloat(remainingBalance || 0));
        }
    }

    returnData = [0]; 
    for (let i = 1; i <= loanTermInYears; i++) {
        if (specificYears.includes(i)) {
            const cumulativePrincipal = getCumulativePrincipalPayment(amortizationSchedule, i);
            const cumulativeInterest = getCumulativeInterestPayment(amortizationSchedule, i);
            const cumulativeRent = calculateCumulativeRent(monthlyRent, i);

            // Calculate the current value (property value + cumulative rent)
            const currentValue = parseFloat(cumulativePrincipal[i]?.cumulativePrincipal || 0) + ((cumulativeRent * (1-maintenanceCost)) * (1-rentTax)) - parseFloat(cumulativeInterest[i]?.cumulativeInterest || 0);

            // Calculate the return on investment (ROI)
            const initialInvestment = purchasePrice * (1-loanToValue);
            const returnOnInvestment = (currentValue / initialInvestment) * 100;

            returnData.push(returnOnInvestment.toFixed(2));
        }
    }

    initialInvestment = [purchasePrice * (1-loanToValue)];

    // Add console logs to check array values
    console.log('UpdateGraph: InvestmentAmount:', initialInvestment);
    console.log('UpdateGraph: cumulativeRentData:', cumulativeRentData);
    console.log('UpdateGraph: cumulativeInterestData:', cumulativeInterestData);
    console.log('UpdateGraph: cumulativePrincipalData:', cumulativePrincipalData);
    console.log('UpdateGraph: returnData:', returnData);
    console.log('UpdateGraph: propertyValueData:', propertyValueData);
    console.log('UpdateGraph: OutstandingMortgageData:', OutstandingMortgageData);

    // Update the charts here
    returnChart.data.datasets[0].data = initialInvestment;
    returnChart.data.datasets[1].data = cumulativeRentData;
    returnChart.data.datasets[2].data = cumulativeInterestData;
    returnChart.data.datasets[3].data = cumulativePrincipalData;
    returnChart.data.datasets[4].data = returnData;
    returnChart.update();

    balanceSheetChart.data.datasets[0].data = propertyValueData;
    balanceSheetChart.data.datasets[1].data = OutstandingMortgageData;
    balanceSheetChart.update();
}
