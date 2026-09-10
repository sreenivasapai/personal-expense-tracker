// PERSONAL EXPENSE TRACKER
// 1. GLOBAL DATA

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
// 2. INITIALIZE APPLICATION

document.addEventListener("DOMContentLoaded", function () {

    // Set today's date as the default date
    document.getElementById("date").value =
        new Date().toISOString().split("T")[0];

    displayExpenses();

    updateDashboard();

});


// 3. ADD / UPDATE EXPENSE

document.getElementById("expenseForm").addEventListener("submit", function (event) {

    // Prevent page refresh
    event.preventDefault();


    // Get form values
    const id = document.getElementById("expenseId").value;

    const description =
        document.getElementById("description").value.trim();

    const amount =
        parseFloat(document.getElementById("amount").value);

    const category =
        document.getElementById("category").value;

    const date =
        document.getElementById("date").value;

    const payment =
        document.getElementById("payment").value;

    const notes =
        document.getElementById("notes").value.trim();


    // =================================================
    // VALIDATION
    // =================================================

    if (description === "") {
        alert("Please enter a description.");
        return;
    }


    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount greater than 0.");
        return;
    }


    if (category === "") {
        alert("Please select a category.");
        return;
    }


    if (date === "") {
        alert("Please select a date.");
        return;
    }


    if (payment === "") {
        alert("Please select a payment method.");
        return;
    }


    // Prevent future dates

    const selectedDate = new Date(date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
        alert("Expense date cannot be in the future.");
        return;
    }


    // UPDATE EXISTING EXPENSE

    if (id !== "") {

        const index = expenses.findIndex(
            expense => expense.id === Number(id)
        );


        if (index !== -1) {

            expenses[index] = {

                id: Number(id),

                description: description,

                amount: amount,

                category: category,

                date: date,

                payment: payment,

                notes: notes

            };

        }

    }


    // ADD NEW EXPENSE

    else {

        const newExpense = {

            id: Date.now(),

            description: description,

            amount: amount,

            category: category,

            date: date,

            payment: payment,

            notes: notes

        };


        expenses.push(newExpense);

    }


    // Save data
    saveToLocalStorage();


    // Update interface
    displayExpenses();

    updateDashboard();


    // Reset form
    resetForm();

});


// 4. SAVE TO LOCAL STORAGE

function saveToLocalStorage() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

}


// 5. DISPLAY EXPENSES

function displayExpenses() {

    const tableBody =
        document.getElementById("expenseTableBody");


    const searchText =
        document.getElementById("searchInput").value
            .toLowerCase();


    const categoryFilter =
        document.getElementById("categoryFilter").value;


    const paymentFilter =
        document.getElementById("paymentFilter").value;


    const sortFilter =
        document.getElementById("sortFilter").value;


    // FILTER

    let filteredExpenses = expenses.filter(function (expense) {

        const matchesSearch =
            expense.description
                .toLowerCase()
                .includes(searchText);


        const matchesCategory =
            categoryFilter === "All" ||
            expense.category === categoryFilter;


        const matchesPayment =
            paymentFilter === "All" ||
            expense.payment === paymentFilter;


        return (
            matchesSearch &&
            matchesCategory &&
            matchesPayment
        );

    });


    // SORT

    if (sortFilter === "newest") {

        filteredExpenses.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

    }


    else if (sortFilter === "oldest") {

        filteredExpenses.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );

    }


    else if (sortFilter === "high") {

        filteredExpenses.sort(
            (a, b) => b.amount - a.amount
        );

    }


    else if (sortFilter === "low") {

        filteredExpenses.sort(
            (a, b) => a.amount - b.amount
        );

    }


    // CLEAR TABLE

    tableBody.innerHTML = "";


    // EMPTY RESULT

    if (filteredExpenses.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="6" class="empty-message">

                    No expenses found.

                </td>

            </tr>

        `;

    }


    // CREATE TABLE ROWS

    filteredExpenses.forEach(function (expense) {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>
                ${formatDate(expense.date)}
            </td>

            <td>
                <strong>${escapeHTML(expense.description)}</strong>
            </td>

            <td>
                <span class="badge bg-secondary">
                    ${escapeHTML(expense.category)}
                </span>
            </td>

            <td>
                ${escapeHTML(expense.payment)}
            </td>

            <td>
                <strong>₹${expense.amount.toFixed(2)}</strong>
            </td>

            <td>

                <div class="action-buttons">

                    <button
                        class="btn btn-sm btn-info"
                        onclick="viewExpense(${expense.id})">

                        View

                    </button>

                    <button
                        class="btn btn-sm btn-warning"
                        onclick="editExpense(${expense.id})">

                        Edit

                    </button>

                    <button
                        class="btn btn-sm btn-danger"
                        onclick="deleteExpense(${expense.id})">

                        Delete

                    </button>

                </div>

            </td>

        `;


        tableBody.appendChild(row);

    });


    // Update record count

    document.getElementById("resultCount").textContent =
        `${filteredExpenses.length} Records`;

}


// =====================================================
// 6. VIEW EXPENSE
// =====================================================

function viewExpense(id) {

    const expense =
        expenses.find(expense => expense.id === id);


    if (!expense) {
        return;
    }


    document.getElementById("viewDescription").textContent =
        expense.description;


    document.getElementById("viewAmount").textContent =
        expense.amount.toFixed(2);


    document.getElementById("viewCategory").textContent =
        expense.category;


    document.getElementById("viewDate").textContent =
        formatDate(expense.date);


    document.getElementById("viewPayment").textContent =
        expense.payment;


    document.getElementById("viewNotes").textContent =
        expense.notes || "No notes";


    // Open Bootstrap modal

    const modal =
        new bootstrap.Modal(
            document.getElementById("viewExpenseModal")
        );


    modal.show();

}


// =====================================================
// 7. EDIT EXPENSE
// =====================================================

function editExpense(id) {

    const expense =
        expenses.find(expense => expense.id === id);


    if (!expense) {
        return;
    }


    document.getElementById("expenseId").value =
        expense.id;


    document.getElementById("description").value =
        expense.description;


    document.getElementById("amount").value =
        expense.amount;


    document.getElementById("category").value =
        expense.category;


    document.getElementById("date").value =
        expense.date;


    document.getElementById("payment").value =
        expense.payment;


    document.getElementById("notes").value =
        expense.notes;


    // Change form title

    document.getElementById("formTitle").textContent =
        "Edit Expense";


    document.getElementById("saveButton").textContent =
        "Update Expense";


    // Scroll to form

    document.getElementById("expenseFormCard")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// 8. DELETE EXPENSE

function deleteExpense(id) {

    const expense =
        expenses.find(expense => expense.id === id);


    if (!expense) {
        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to delete "${expense.description}"?`
        );


    if (!confirmed) {
        return;
    }


    expenses =
        expenses.filter(
            expense => expense.id !== id
        );


    saveToLocalStorage();

    displayExpenses();

    updateDashboard();

}


// 9. RESET FORM

function resetForm() {

    document.getElementById("expenseForm").reset();


    document.getElementById("expenseId").value = "";


    document.getElementById("formTitle").textContent =
        "Add New Expense";


    document.getElementById("saveButton").textContent =
        "Save Expense";


    // Set today's date again

    document.getElementById("date").value =
        new Date().toISOString().split("T")[0];

}


// 10. SHOW ADD FORM

function showAddForm() {

    resetForm();


    document.getElementById("expenseFormCard")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// 11. UPDATE DASHBOARD

function updateDashboard() {

    // Total expense

    const total =
        expenses.reduce(
            (sum, expense) => sum + expense.amount,
            0
        );


    // Transaction count

    const count =
        expenses.length;


    // Highest expense

    const highest =
        expenses.length > 0
            ? Math.max(...expenses.map(expense => expense.amount))
            : 0;


    // Current month

    const now = new Date();

    const currentMonth =
        now.getMonth();

    const currentYear =
        now.getFullYear();


    const monthlyTotal =
        expenses
            .filter(function (expense) {

                const expenseDate =
                    new Date(expense.date);

                return (
                    expenseDate.getMonth() === currentMonth &&
                    expenseDate.getFullYear() === currentYear
                );

            })
            .reduce(
                (sum, expense) => sum + expense.amount,
                0
            );


    // Update HTML

    document.getElementById("totalExpenses").textContent =
        `₹${total.toFixed(2)}`;


    document.getElementById("transactionCount").textContent =
        count;


    document.getElementById("highestExpense").textContent =
        `₹${highest.toFixed(2)}`;


    document.getElementById("monthlyExpense").textContent =
        `₹${monthlyTotal.toFixed(2)}`;

}


// 12. FORMAT DATE

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString("en-IN", {

        day: "2-digit",

        month: "2-digit",

        year: "numeric"

    });

}


// 13. HTML SECURITY

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;

}