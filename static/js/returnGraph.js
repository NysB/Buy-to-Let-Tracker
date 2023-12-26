// Define variables
let purchasePrice;
let propertyTax;
let loanToValue;
let annualInterestRate;
let loanTermInYears;
let monthlyIncome;
let incomeTax;
let maintenanceCost;
let propertyValueIncrease;
let initialInvestment;
let cumulativeRentData = [];
let cumulativeInterestData = [];
let cumulativePrincipalData = [];
let returnData = [];
let propertyValueData = [];
let OutstandingMortgageData = [];


// Calculate Cumulative Rent Earned up to specified years

function calculateCumulativeRent(monthlyIncome, years) {
    let monthsInYear = 12;
    let cumulativeRent = 0;

    for (let year = 1; year <= years; year++) {
        cumulativeRent += monthlyIncome * monthsInYear;
    }

    return cumulativeRent;
}


// Calculate monthly mortgage payment

function calculateMortgagePayment(loanAmount, annualInterestRate, loanTermInYears) {
    let monthlyInterestRate = (annualInterestRate / 12) / 100;
    let totalPayments = loanTermInYears * 12;

    let monthlyPayment = (monthlyInterestRate * loanAmount * Math.pow(1 + monthlyInterestRate, totalPayments)) / (Math.pow(1 + monthlyInterestRate, totalPayments)-1);

    return monthlyPayment;
}


// Calculate amortization schedule

function generateAmortizationSchedule(loanAmount, annualInterestRate, loanTermInYears) {
    let monthlyInterestRate = (annualInterestRate / 12) / 100;
    let totalPayments = loanTermInYears * 12;

    let monthlyPayment = calculateMortgagePayment(loanAmount, annualInterestRate, loanTermInYears);

    let remainingLoanBalance = loanAmount;
    let amortizationSchedule = [];

    for (let month = 1; month <= totalPayments; month++) {
        let interestPayment = remainingLoanBalance * monthlyInterestRate;
        let principalPayment = monthlyPayment - interestPayment;

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
    let interestByYear = {};
    let totalInterest = 0;

    for (let i = 0; i < schedule.length; i++) {
        let year = Math.ceil(schedule[i].month / 12);

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
    let principalByYear = {};
    let totalPrincipal = 0;

    for (let i = 0; i < schedule.length; i++) {
        let year = Math.ceil(schedule[i].month / 12);

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
        let year = Math.ceil(schedule[i].month / 12);

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
        propertyTax = data.propertyTax;
        loanToValue = data.loanToValue;
        annualInterestRate = data.annualInterestRate;
        loanTermInYears = data.loanTermInYears;
        monthlyIncome = data.monthlyIncome;
        incomeTax = data.incomeTax;
        maintenanceCost = data.maintenanceCost;
        propertyValueIncrease = data.propertyValueIncrease;
        
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
    let paidPurchasePrice = document.getElementById('paid-purchase-price').value;
    let propertyTax = document.getElementById('property-tax').value;
    let ltv = document.getElementById('ltv').value;
    let mortgageRate = document.getElementById('mortgage-rate').value;
    let mortgageTenor = document.getElementById('mortgage-tenor').value;
    let incomeTax = document.getElementById('income-taxes').value;
    let monthlyIncome = document.getElementById('monthly-income').value;
    let maintenance = document.getElementById('maintenance').value;
    let propertyValueIncrease = document.getElementById('property-value-increase').value;

    fetch('/updateGraph', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `paid-purchase-price=${paidPurchasePrice}&property-tax=${propertyTax}&ltv=${ltv}&mortgage-rate=${mortgageRate}&mortgage-tenor=${mortgageTenor}&monthly-income=${monthlyIncome}&income-tax=${incomeTax}&maintenance=${maintenance}&property-value-increase=${propertyValueIncrease}`,
    })
      .then(response => response.json())
      .then(data => {
        
        // Assign values from the fetched data
        purchasePrice = data.purchasePrice;
        propertyTax = data.propertyTax;
        loanToValue = data.loanToValue;
        annualInterestRate = data.annualInterestRate;
        loanTermInYears = data.loanTermInYears;
        monthlyIncome = data.monthlyIncome;
        incomeTax = data.incomeTax;
        maintenanceCost = data.maintenanceCost;
        propertyValueIncrease = data.propertyValueIncrease;
        
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
    let loanAmount = purchasePrice * loanToValue;
    let specificYears = [0, 1, 2, 3, 4, 5, 10, 15, 20, loanTermInYears];
    let amortizationSchedule = generateAmortizationSchedule(loanAmount, annualInterestRate, loanTermInYears);

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
            cumulativeRentData.push(calculateCumulativeRent(monthlyIncome, i));
        }
    }

    propertyValueData = [purchasePrice];
    for (let i = 2; i <= loanTermInYears; i++) {
        propertyValueData.push(purchasePrice*(1+(propertyValueIncrease/100))^i);
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
            let cumulativePrincipal = getCumulativePrincipalPayment(amortizationSchedule, i);
            let cumulativeInterest = getCumulativeInterestPayment(amortizationSchedule, i);
            let cumulativeRent = calculateCumulativeRent(monthlyIncome, i);

            // Calculate the current value (property value + cumulative rent)
            let currentValue = parseFloat(cumulativePrincipal[i]?.cumulativePrincipal || 0) + ((cumulativeRent * (1-(maintenanceCost/100))) * (1-(incomeTax/100))) - parseFloat(cumulativeInterest[i]?.cumulativeInterest || 0);

            // Calculate the return on investment (ROI)
            let initialInvestment = purchasePrice * (1-loanToValue) + purchasePrice * (propertyTax/100);
            let returnOnInvestment = (currentValue / initialInvestment) * 100;

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
