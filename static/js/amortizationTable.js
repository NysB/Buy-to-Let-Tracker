// Set loan parameters

let purchasePrice;
let propertyTax;
let loanToValue;
let annualInterestRate;
let loanTermInYears;
let monthlyIncome;
let incomeTax;
let maintenanceCost;
let propertyValueIncrease;


// Function to calculate monthly mortgage payment

function calculateMortgagePayment(purchasePrice, loanToValue, annualInterestRate, loanTermInYears) {
    let loanAmount = (purchasePrice * loanToValue);
    let monthlyInterestRate = (annualInterestRate / 12) / 100;
    let totalPayments = loanTermInYears * 12;

    let monthlyPayment = (monthlyInterestRate * loanAmount * Math.pow(1 + monthlyInterestRate, totalPayments)) / (Math.pow(1 + monthlyInterestRate, totalPayments)-1);

    console.log('calculateMortgagePayment: Loan Amount', loanAmount);
    console.log('calculateMortgagePayment: Monthly Interest Rate', monthlyInterestRate);
    console.log('calculateMortgagePayment: Total Payments', totalPayments);
    console.log('calculateMortgagePayment: Monthly Payment', monthlyPayment);

    return monthlyPayment;
}


// Function to calculate amortization schedule

function generateAmortizationSchedule(purchasePrice, propertyTax, loanToValue, annualInterestRate, loanTermInYears, monthlyIncome, incomeTax, maintenanceCost, propertyValueIncrease) {
    let loanAmount = purchasePrice * loanToValue;
    let monthlyInterestRate = (annualInterestRate / 12) / 100;
    let totalPayments = loanTermInYears * 12;

    let monthlyPayment = calculateMortgagePayment(purchasePrice, loanToValue, annualInterestRate, loanTermInYears);

    let remainingLoanBalance = loanAmount;
    let amortizationSchedule = [];

    amortizationSchedule.push({
        month: 0,
        propertyValue: purchasePrice,
        equity: purchasePrice*(1-loanToValue),
        payment: 0,
        principal: 0,
        interest: 0,
        balance: remainingLoanBalance.toFixed(2),
        monthlyIncome: 0,
        monthlyNetIncome: 0,
        cashPosition: -purchasePrice*(1-loanToValue) - purchasePrice*(propertyTax/100),
        returnSinceInception: 0
    });

    for (let month = 1; month <= totalPayments; month++) {
        let interestPayment = remainingLoanBalance * monthlyInterestRate;
        let principalPayment = monthlyPayment - interestPayment;

        remainingLoanBalance -= principalPayment;

        let monthlyNetIncome = monthlyIncome * (1 - (maintenanceCost / 100)) * (1 - (incomeTax / 100)) - monthlyPayment;
        let currentPropertyValue = purchasePrice*(1+((propertyValueIncrease/12)/100))^month;
        let currentEquity = currentPropertyValue - remainingLoanBalance;
        let initialEquity = purchasePrice*(1-loanToValue);
        let initialCashPosition = -purchasePrice*(1-loanToValue) - purchasePrice*(propertyTax/100)
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
            monthlyIncome: monthlyIncome,
            monthlyNetIncome: monthlyNetIncome,
            cashPosition: currentCashPosition,
            returnSinceInception: currentReturnSinceInception * 100
        });
    }

    return amortizationSchedule;
}


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


// Function to fetch data from the server and initialize the table

function initializeTable() {
    fetch('/updateGraph', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        // Use the updated data if available
        console.log('Updated Data from /updateGraph:', data);
        processGraphData(data);
    })
    .catch(error => {
        // If /updateGraph data is not available, fetch data from /startGraph
        console.error('Error fetching updated data from /updateGraph:', error);
        fetch('/startGraph')
            .then(response => response.json())
            .then(data => {
                console.log('Data from /startGraph:', data);
                processGraphData(data);
            })
            .catch(startGraphError => {
                console.error('Error fetching data from /startGraph:', startGraphError);
            });
    });
}


// Function to process the fetched data

function processGraphData(data) {
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

    let amortizationSchedule = generateAmortizationSchedule(
        purchasePrice,
        propertyTax,
        loanToValue,
        annualInterestRate,
        loanTermInYears,
        monthlyIncome,
        incomeTax,
        maintenanceCost,
        propertyValueIncrease
    );


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


    // Call the function to create and display the table with data
    
    createTable(monthlyData, 1, 12);
}


// Call the initializeTable function to fetch and process the data

initializeTable();
