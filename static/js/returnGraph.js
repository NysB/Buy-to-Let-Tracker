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
let propertyValueIncreaseInput;
let initialInvestment;
let cumulativeRentData = [];
let cumulativeInterestData = [];
let cumulativePrincipalData = [];
let returnData = [];
let propertyValueData = [];
let outstandingMortgageData = []; // changed to camelCase for consistency


// Calculate monthly mortgage payment
function calculateMortgagePayment(loanAmount, annualInterestRate, loanTermInYears) {
    let monthlyInterestRate = (annualInterestRate / 12) / 100;
    let totalPayments = loanTermInYears * 12;

    let monthlyPayment = (monthlyInterestRate * loanAmount * Math.pow(1 + monthlyInterestRate, totalPayments)) / (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

    return monthlyPayment;
}

// Calculate amortization schedule
function generateAmortizationSchedule(purchasePrice, propertyTax, loanToValue, annualInterestRate, loanTermInYears, monthlyIncomeInput, incomeTax, maintenanceCost, propertyValueIncreaseInput) {
    let loanAmount = purchasePrice * loanToValue;
    let monthlyInterestRate = (annualInterestRate / 12) / 100;
    let totalPayments = loanTermInYears * 12;

    let monthlyPayment = calculateMortgagePayment(loanAmount, annualInterestRate, loanTermInYears);

    let remainingLoanBalance = loanAmount;
    let amortizationSchedule = [];

    amortizationSchedule.push({
        month: 0,
        propertyValue: purchasePrice,
        equity: purchasePrice * (1 - loanToValue),
        payment: 0,
        principal: 0,
        interest: 0,
        balance: remainingLoanBalance.toFixed(2),
        monthlyIncome: 0,
        monthlyNetIncome: 0,
        cashPosition: -purchasePrice * (1 - loanToValue) - purchasePrice * (propertyTax / 100),
        returnSinceInception: 0
    });

    for (let month = 1; month <= totalPayments; month++) {
        let interestPayment = remainingLoanBalance * monthlyInterestRate;
        let principalPayment = monthlyPayment - interestPayment;

        remainingLoanBalance -= principalPayment;

        let monthlyNetIncome = monthlyIncomeInput * (1 - (maintenanceCost / 100)) * (1 - (incomeTax / 100)) - monthlyPayment;
        let currentPropertyValue = purchasePrice * Math.pow(1 + (propertyValueIncreaseInput / 12) / 100, month);
        let currentEquity = currentPropertyValue - remainingLoanBalance;
        let initialEquity = purchasePrice * (1 - loanToValue);
        let initialCashPosition = -purchasePrice * (1 - loanToValue) - purchasePrice * (propertyTax / 100)
        let previousCashPosition = amortizationSchedule[month - 1].cashPosition;
        let currentCashPosition = previousCashPosition + monthlyNetIncome;
        let currentReturnSinceInception = (currentEquity - initialEquity + currentCashPosition - initialCashPosition) / (-initialCashPosition)

        amortizationSchedule.push({
            month,
            propertyValue: currentPropertyValue,
            equity: currentEquity,
            payment: monthlyPayment.toFixed(2),
            principal: principalPayment.toFixed(2),
            interest: interestPayment.toFixed(2),
            balance: remainingLoanBalance.toFixed(2),
            monthlyIncome: monthlyIncomeInput,
            monthlyNetIncome: monthlyNetIncome,
            cashPosition: currentCashPosition,
            returnSinceInception: currentReturnSinceInception * 100
        });
    }

    console.log('generateAmortizationSchedule: propertyValueIncrease:', propertyValueIncreaseInput);
    return amortizationSchedule;
}


// Calculate Cumulative Monthly Income

function getCumulativeRent(amortizationSchedule, month) {
    let cumulativeRent = 0;

    for (let period = 0; period <= month && amortizationSchedule[period]; period++) {
        cumulativeRent += parseFloat(amortizationSchedule[period].monthlyIncome);
    }

    return cumulativeRent;
}

// Calculate cumulative interest

function getCumulativeInterestPayment(amortizationSchedule, month) {
    let cumulativeInterest = 0;

    for (let period = 0; period <= month; period++) {
        cumulativeInterest += parseFloat(amortizationSchedule[period].interest);
    }

    return cumulativeInterest;
}


// Calculate cumulative principal

function getCumulativePrincipalPayment(amortizationSchedule, month) {
    let cumulativePrincipal = 0;

    for (let period = 0; period <= month; period++) {
        cumulativePrincipal += parseFloat(amortizationSchedule[period].principal);
    }

    return cumulativePrincipal;
}


// Calculate remaining loan balance

function getRemainingLoanBalance(amortizationSchedule, month) {
    let remainingBalance = 0;
    remainingBalance = parseFloat(amortizationSchedule[month].balance)

    return remainingBalance;
}


// Calculate property value

function getPropertyValue(amortizationSchedule, month) {
    let propertyValue = 0;
    propertyValue = parseFloat(amortizationSchedule[month].propertyValue)

    return propertyValue;
}


// Calculate return

function getReturnValue(amortizationSchedule, month) {
    let returnValue = 0;
    returnValue = parseFloat(amortizationSchedule[month].returnSinceInception)

    return returnValue;
}


// Set up Return Chart
const returnCtx = document.getElementById('returnChart').getContext('2d');
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
                data: outstandingMortgageData,
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


// Function to create and display table

function createTable(data, page = 1, rowsPerPage = 12) {
    const tableContainer = document.getElementById('amortizationTableContainer');
    const table = document.createElement('table');
    table.classList.add('table');

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;


    // Create table header

    const headerRow = document.createElement('tr');
    Object.keys(data[0]).forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);


    // Create table rows

    const currentPageData = data.slice(startIndex, endIndex);
    currentPageData.forEach(rowData => {
        const row = document.createElement('tr');
        Object.values(rowData).forEach(columnText => {
            const td = document.createElement('td');
            td.textContent = Number(columnText).toLocaleString(undefined, { maximumFractionDigits: 2 });
            row.appendChild(td);
        });
        table.appendChild(row);
    });


    // Clear previous content and append the table

    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);


    // Add navigation buttons

    const navigationContainer = document.createElement('div');
    navigationContainer.classList.add('pagination');


    // First button

    const firstButton = document.createElement('button');
    firstButton.textContent = 'First';
    firstButton.addEventListener('click', () => {
        createTable(data, 1, rowsPerPage);
    });
    navigationContainer.appendChild(firstButton);


    // Previous button

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.addEventListener('click', () => {
        if (page > 1) {
            createTable(data, page - 1, rowsPerPage);
        }
    });
    navigationContainer.appendChild(prevButton);


    // Next button

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
        if (endIndex < data.length) {
            createTable(data, page + 1, rowsPerPage);
        }
    });
    navigationContainer.appendChild(nextButton);

    tableContainer.appendChild(navigationContainer);
}


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
            monthlyIncomeInput = data.monthlyIncome;
            incomeTax = data.incomeTax;
            maintenanceCost = data.maintenanceCost;
            propertyValueIncreaseInput = data.propertyValueIncrease;


            // Generate cumulative data
            
            updateGraph();


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
        monthlyIncomeInput = data.monthlyIncome;
        incomeTax = data.incomeTax;
        maintenanceCost = data.maintenanceCost;
        propertyValueIncreaseInput = data.propertyValueIncrease;

        console.log('filterAndRefreshGraph: propertyValueIncreaseInput:', propertyValueIncreaseInput);


        // Generate cumulative data

        updateGraph();
        

        // Log arrays after the updateGraph function

        console.log('filterAndRefreshGraph: cumulativeRentData:', cumulativeRentData);
        console.log('filterAndRefreshGraph: cumulativeInterestData:', cumulativeInterestData);
        console.log('filterAndRefreshGraph: cumulativePrincipalData:', cumulativePrincipalData);
        console.log('filterAndRefreshGraph: returnData:', returnData);
        console.log('filterAndRefreshGraph: propertyValueData:', propertyValueData);
        console.log('filterAndRefreshGraph: outstandingMortgageData:', outstandingMortgageData);
        

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


// Function to update graph

function updateGraph(){
    
    // Calculations
    let loanAmount = purchasePrice * loanToValue;
    let specificYears = [0, 1, 2, 3, 4, 5, 10, loanTermInYears];
    let amortizationSchedule = generateAmortizationSchedule(
        purchasePrice,
        propertyTax,
        loanToValue,
        annualInterestRate,
        loanTermInYears,
        monthlyIncomeInput,
        incomeTax,
        maintenanceCost,
        propertyValueIncreaseInput
    );

    cumulativePrincipalData = [];
    for (let year of specificYears) {
        let month = year * 12;
    
        if (month >= 0 && month <= loanTermInYears * 12) {
            cumulativePrincipalData.push(getCumulativePrincipalPayment(amortizationSchedule, month));
        }
    }

    cumulativeInterestData = [];
    for (let year of specificYears) {
        let month = year * 12;
    
        if (month >= 0 && month <= loanTermInYears * 12) {
            cumulativeInterestData.push(getCumulativeInterestPayment(amortizationSchedule, month));
        }
    }

    cumulativeRentData = [];
    for (let year of specificYears) {
        let month = year * 12;
    
        if (month >= 0 && month <= loanTermInYears * 12) {
            cumulativeRentData.push(getCumulativeRent(amortizationSchedule, month));
        }
    }

    propertyValueData = [];
    for (let year of specificYears) {
        let month = year * 12;
    
        if (month >= 0 && month <= loanTermInYears * 12) {
            propertyValueData.push(getPropertyValue(amortizationSchedule, month));
        }
    }

    outstandingMortgageData = [];
    for (let year of specificYears) {
        let month = year * 12;
    
        if (month >= 0 && month <= loanTermInYears * 12) {
            outstandingMortgageData.push(getRemainingLoanBalance(amortizationSchedule, month));
        }
    }

    returnData = [];
    for (let year of specificYears) {
        let month = year * 12;
    
        if (month >= 0 && month <= loanTermInYears * 12) {
            returnData.push(getReturnValue(amortizationSchedule, month));
        }
    }

    initialInvestment = [purchasePrice * (1-loanToValue)];

    // Populate table dataset
    let monthlyData = amortizationSchedule.map((entry) => ({
        Month: entry.month,
        PropertyValue: parseFloat(entry.propertyValue),
        Equity: parseFloat(entry.equity),
        LoanAmount: parseFloat(entry.balance),
        MonthlyPayment: parseFloat(entry.payment),
        MonthlyInterestPayment: parseFloat(entry.interest),
        MonthlyPrincipalPayment: parseFloat(entry.principal),
        MonthlyIncome: parseFloat(entry.monthlyIncome),
        MonthlyNetIncome: parseFloat(entry.monthlyNetIncome),
        CashPosition: parseFloat(entry.cashPosition),
        ReturnSinceInception: parseFloat(entry.returnSinceInception)
    }));


    // Add console logs to check array values

    console.log('UpdateGraph: InvestmentAmount:', initialInvestment);
    console.log('UpdateGraph: cumulativeRentData:', cumulativeRentData);
    console.log('UpdateGraph: cumulativeInterestData:', cumulativeInterestData);
    console.log('UpdateGraph: cumulativePrincipalData:', cumulativePrincipalData);
    console.log('UpdateGraph: returnData:', returnData);
    console.log('UpdateGraph: propertyValueData:', propertyValueData);
    console.log('UpdateGraph: OutstandingMortgageData:', outstandingMortgageData);


    // Update the charts here

    returnChart.data.datasets[0].data = initialInvestment;
    returnChart.data.datasets[1].data = cumulativeRentData;
    returnChart.data.datasets[2].data = cumulativeInterestData;
    returnChart.data.datasets[3].data = cumulativePrincipalData;
    returnChart.data.datasets[4].data = returnData;
    returnChart.update();

    balanceSheetChart.data.datasets[0].data = propertyValueData;
    balanceSheetChart.data.datasets[1].data = outstandingMortgageData;
    balanceSheetChart.update();


    // Call the function to create and display the table with data

    createTable(monthlyData, 1, 12);
}
