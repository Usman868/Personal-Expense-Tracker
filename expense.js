// multi-user state in localStorage:
// localStorage.state => { username: { email, password, transactions: [...] }, ... }
// localStorage.currentUser => username

// helpers
function getState() {
    return JSON.parse(localStorage.getItem('state'));
}
function saveState(state) {
    localStorage.setItem('state', JSON.stringify(state));
}
function getCurrentUser() {
    return sessionStorage.getItem('currentUser') || null;
}
function setCurrentUser(u) {
    sessionStorage.setItem('currentUser', u);
}
function clearCurrentUser() {
    sessionStorage.removeItem('currentUser');
}

// DOM
var transactionsListEl = document.getElementById('transactionsList');
var netEl = document.getElementById('netAmount');
var earningEl = document.getElementById('earning');
var countsEl = document.getElementById('counts');
var welcomeTextEl = document.getElementById('welcomeText');
var formEl = document.getElementById('transactionForm');

// redirect to login if not logged in
(function initAuth() {
    var user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    // show username
    welcomeTextEl.textContent = 'Hi, ' + user;
})();

// get user transactions
function getUserTransactions() {
    var state = getState();
    var user = getCurrentUser();
    if (!user || !state[user]) return [];
    return state[user].transactions;
}

function saveUserTransactions(transactions) {
    var state = getState();
    var user = getCurrentUser();
    if (!user) return;
    state[user].transactions = transactions;
    saveState(state);
}

// render list
function renderTransactions() {
    var txs = getUserTransactions();
    transactionsListEl.innerHTML = '';
    var earnings = 0;
    var expenses = 0;

    for (var i = 0; i < txs.length; i++) {
        (function (t) {
            var item = document.createElement('div');
            item.className = 'transaction';
            // left
            var left = document.createElement('div');
            left.className = 'left';
            var desc = document.createElement('div');
            desc.className = 'desc';
            desc.textContent = t.text + ' • ' + (t.category || '');
            var amtLine = document.createElement('div');
            amtLine.className = 'amt';
            amtLine.textContent = (t.type === 'credit' ? '+ ' : '- ') + 'PKR ' + t.amount;
            var dateLine = document.createElement('div');
            dateLine.className = 'date';
            dateLine.textContent = t.date || "";
            left.appendChild(desc);
            left.appendChild(amtLine);
            left.appendChild(dateLine);

            // badge
            var badge = document.createElement('div');
            badge.className = 'badge ' + (t.type === 'credit' ? 'credit' : 'debit');
            badge.textContent = (t.type === 'credit' ? 'IN' : 'OUT');

            // actions
            var actions = document.createElement('div');
            actions.className = 'actions';
            var editBtn = document.createElement('button');
            editBtn.className = 'btn edit';
            editBtn.textContent = 'Edit';
            editBtn.onclick = function (e) {
                beginEdit(t.id);
            };
            var delBtn = document.createElement('button');
            delBtn.className = 'btn del';
            delBtn.textContent = 'Delete';
            delBtn.onclick = function (e) {
                deleteTransaction(t.id);
            };
            actions.appendChild(editBtn);
            actions.appendChild(delBtn);

            item.appendChild(left);
            item.appendChild(badge);
            item.appendChild(actions);

            transactionsListEl.appendChild(item);

            if (t.type === 'credit') earnings += Number(t.amount);
            else expenses += Number(t.amount);
        })(txs[i]);
    }

    var net = earnings - expenses;
    netEl.textContent = 'PKR ' + net;
    earningEl.textContent = 'PKR ' + earnings;
    countsEl.textContent = txs.length + ' item' + (txs.length === 1 ? '' : 's');

    // scroll to top (latest visible)
    if (transactionsListEl.firstChild) {
        transactionsListEl.firstChild.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// add or update transaction
var isUpdate = false;
var editTid = null;

function beginEdit(id) {
    var txs = getUserTransactions();
    for (var i = 0; i < txs.length; i++) {
        if (txs[i].id === id) {
            document.getElementById('text').value = txs[i].text;
            document.getElementById('amount').value = txs[i].amount;
            document.getElementById('category').value = txs[i].category;
            isUpdate = true;
            editTid = id;
            // focus so user sees it's edit
            document.getElementById('text').focus();
            return;
        }
    }
}

function deleteTransaction(id) {
    var txs = getUserTransactions();
    var newArr = [];
    for (var i = 0; i < txs.length; i++) {
        if (txs[i].id !== id) newArr.push(txs[i]);
    }
    saveUserTransactions(newArr);
    renderTransactions();
}

// handle submit for both Add Income and Add Expense (we check submitter)
formEl.addEventListener('submit', function (e) {
    e.preventDefault();

    // validation
    if (!formEl.checkValidity()) {
        formEl.reportValidity();
        return;
    }

    // find which button triggered submit (earnBtn or expBtn)
    var isEarn = false;
    try { isEarn = e.submitter && e.submitter.id === 'earnBtn'; } catch (err) { isEarn = false; }

    var text = document.getElementById('text').value.trim();
    var amountVal = document.getElementById('amount').value;
    var category = document.getElementById('category').value;

    if (!text || amountVal === '') return;
    var amount = Number(amountVal);
    if (isNaN(amount) || amount <= 0) return;

    var tx = {
        id: isUpdate ? editTid : Math.floor(Math.random() * 1000000),
        text: text,
        amount: amount,
        category: category,
        type: isEarn ? 'credit' : 'debit',
        date: new Date().toLocaleString()
    };

    var txs = getUserTransactions();
    if (isUpdate) {
        for (var i = 0; i < txs.length; i++) {
            if (txs[i].id === editTid) {
                txs[i] = tx;
                break;
            }
        }
        isUpdate = false;
        editTid = null;
    } else {
        // newest first
        txs.unshift(tx);
    }

    saveUserTransactions(txs);
    formEl.reset();
    document.getElementById('text').focus();
    renderTransactions();
});

// logout
document.getElementById('logoutBtn').addEventListener('click', function () {
    clearCurrentUser();
    window.location.href = 'login.html';
});

// init render
renderTransactions();
