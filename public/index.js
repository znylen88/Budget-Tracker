let transactions = [];
let myChart;

fetch("/api/transaction")
    .then(response => response.json())
    .then(data => {
        // Save the Database
        transactions = data;
        renderTotal();
        renderTable();
    });

function renderTotal() {
    // Creates budget total
    let total = transactions.reduce((total, t) => {
        return total + parseInt(t.value);
    }, 0);

    let transactionsTotal = document.querySelector("#total");
    transactionsTotal.textContent = total;

    // Current budget total
    console.log(total)
}

function renderTable() {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = "";

    transactions.forEach(transaction => {
        // Create table row (name and amount) 
        const transactionColumn = document.createElement("tr");
        transactionColumn.innerHTML = `
            <td>${transaction.name}</td>
            <td>${transaction.value}</td>
        `;
        tbody.appendChild(transactionColumn);
        console.log("Created New Transaction! Name: " + transaction.name + " | " + "Amount: " + transaction.value)
    });
}

function createTransaction(addingFunds) {
    const transactionName = document.querySelector("#t-name");
    const transactionAmount = document.querySelector("#t-amount");

    // Creates the record
    const transaction = {
        name: transactionName.value,
        value: transactionAmount.value,
        date: new Date().toISOString()
    };

    // If subtracting, convert value to negative number
    if (!addingFunds) {
        transaction.value *= -1;
    }

    // Add to beginning of array
    transactions.unshift(transaction);

    // Re-call functions to update newly created data
    renderTable();
    renderTotal();

    // Resend data to server
    fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(transaction),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
                // Clearing text inputs
                transactionName.value = "";
                transactionAmount.value = "";
            }
        )
        .catch(err => {
            // Save record to indexedDB
            saveRecord(transaction);

            // Clearing text inputs
            transactionName.value = "";
            transactionAmount.value = "";
        });
}

document.querySelector("#add-btn").addEventListener("click", function (event) {
    event.preventDefault();
    createTransaction(true);
});

document.querySelector("#sub-btn").addEventListener("click", function (event) {
    event.preventDefault();
    createTransaction(false);
});

// function renderChart() {
// NOT WORKING!