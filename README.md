🏦 My Personal Bank — Expense Tracker

A sleek, minimalistic expense tracker built with vanilla JavaScript, HTML, and CSS.
It allows you to track income and expenses, calculate net balance, and persist data using localStorage. The design features a dark theme with black & gold styling.

💻 Features

Add income and expenses with description and amount

Edit and delete transactions

View net balance, total earnings, and total expenses

Real-time transaction list with smooth scrolling

Responsive design for mobile and desktop

Data is saved in localStorage — transactions persist after page reload

Interactive transaction badges:

Gold for income

Red for expense

Expandable actions for each transaction (Edit/Delete)

📦 Technologies Used

HTML5

CSS3 (Flexbox, gradients, smooth scroll, custom scrollbar)

JavaScript (ES5, closures, DOM manipulation)

localStorage for data persistence

🚀 Usage

Clone the repository:

git clone https://github.com/YOUR_USERNAME/expense-tracker.git


Open index.html in your browser.

Add income or expense using the form at the bottom.

Edit or delete transactions using the buttons next to each transaction.

The balance, earnings, and expenses update automatically.

All data is stored locally in your browser.

⚡ Code Highlights

Transactions are stored in a state object:

var state = { transactions: [] };


Each transaction object has:

{
  id: 123456,
  text: "Salary",
  amount: 50000,
  type: "credit" // or "debit"
}


Buttons use closures to target the correct transaction:

delBtn.onclick = (function(id) {
    return function(e) {
        e.stopPropagation();
        deleteTransaction(id);
    };
})(t.id);


Net balance is calculated in real-time:

var net = earnings - expenses;
netEl.textContent = 'PKR ' + net;


Transaction counts update dynamically:

if (state.transactions.length === 1) {
    countsEl.textContent = state.transactions.length + ' item';
} else {
    countsEl.textContent = state.transactions.length + ' items';
}


Transactions are rendered with badges for income/outflow:

badge.className = 'tx-badge ' + (isCredit ? 'tx-credit' : 'tx-debit');
badge.textContent = isCredit ? 'IN' : 'OUT';

🎨 Styling

Dark theme with black background

Gold highlights for income

Red highlights for expenses

Smooth hover animations on transactions

Scrollable transaction panel with custom scrollbar

📌 Future Improvements

Add categories for transactions

Export/Import data as JSON/CSV

Add charts for income vs. expenses

User authentication for multi-device syncing

Dark/light theme toggle
