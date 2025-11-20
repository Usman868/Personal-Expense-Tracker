/* All JS uses only var and normal functions */
var state = {
    transactions: []
};
var saved = localStorage.getItem("history");
if (saved) state = JSON.parse(saved);


var isUpdate = false;
var tid = null;

var formEl = document.getElementById('transactionForm');
var listEl = document.getElementById('transactionsList');
var netEl = document.getElementById('netAmount');
var earningEl = document.getElementById('earning');
var expenseEl = document.getElementById('expense');
var countsEl = document.getElementById('counts');

function save() { localStorage.setItem("history", JSON.stringify(state)); }

function renderTransactions() {
    listEl.innerHTML = '';
    var earnings = 0;
    var expenses = 0;

    for (var i = 0; i < state.transactions.length; i++) {
        var t = state.transactions[i];
        var isCredit;
        if (t.type === 'credit') {
            isCredit = true;
        } else {
            isCredit = false
        }

        var item = document.createElement('div');
        item.className = 'transaction';
        item.id = 'tx-' + t.id;

        // top area (click toggles actions)
        var top = document.createElement('div');
        top.className = 'tx-top';
        top.onclick = (function (id) {
            return function () {
                toggleActions(id);
            };
        })(t.id);

        var meta = document.createElement('div');
        meta.className = 'tx-meta';

        var desc = document.createElement('div');
        desc.className = 'tx-desc';
        desc.textContent = t.text;

        var amt = document.createElement('div');
        amt.className = 'tx-amt';
        amt.textContent = (isCredit ? '+ ' : '- ') + 'PKR ' + t.amount;
        if (isCredit) {
            amt.textContent = '+ ' + 'PKR ' + t.amount;
        } else {
            amt.textContent = '- ' + 'PKR ' + t.amount;
        }

        meta.appendChild(desc);
        meta.appendChild(amt);

        var badge = document.createElement('div');
        if (isCredit) {
            badge.className = 'tx-badge ' + 'tx-credit';
        } else {
            badge.className = 'tx-badge ' + 'tx-debit';
        }
        if (isCredit) {
            badge.textContent = 'IN';
        } else {
            badge.textContent = 'OUT';
        }

        top.appendChild(meta);
        top.appendChild(badge);

        // actions row
        var actions = document.createElement('div');
        actions.className = 'tx-actions';
        actions.id = 'actions-' + t.id;

        var editBtn = document.createElement('button');
        editBtn.className = 'action-btn';
        editBtn.textContent = 'Edit';
        // stop propagation so top's onclick doesn't fire when pressing action
        editBtn.onclick = (function (evt, id) {
            return function (e) {
                e.stopPropagation();
                beginEdit(id);
            };
        })(null, t.id);

        var delBtn = document.createElement('button');
        delBtn.className = 'action-btn';
        delBtn.textContent = 'Delete';
        delBtn.onclick = (function (evt, id) {
            return function (e) {
                e.stopPropagation();
                deleteTransaction(id);
            };
        })(null, t.id);

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);

        item.appendChild(top);
        item.appendChild(actions);

        listEl.appendChild(item);

        if (isCredit) earnings += Number(t.amount);
        else expenses += Number(t.amount);
    }

    var net = earnings - expenses;
    netEl.textContent = 'PKR ' + net;
    earningEl.textContent = 'PKR ' + earnings;
    expenseEl.textContent = 'PKR ' + expenses;
    if (state.transactions.length === 1) {
        countsEl.textContent = state.transactions.length + ' item'
    }
    else {
        countsEl.textContent = state.transactions.length + ' item' + "s"
    }

    if (listEl.firstChild) {
        listEl.firstChild.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    //  save dtat on localstorage
    save()
}

function toggleActions(id) {
    var el = document.getElementById('actions-' + id);
    if (!el) { return };

    if (el.classList.contains('show')) { el.classList.remove('show') }
    else { el.classList.add('show') };
}

function beginEdit(id) {
    // prefill form and mark update mode
    for (var i = 0; i < state.transactions.length; i++) {
        if (state.transactions[i].id === id) {
            document.getElementById('text').value = state.transactions[i].text;
            document.getElementById('amount').value = state.transactions[i].amount;
            isUpdate = true;
            tid = id;
            // focus text
            document.getElementById('text').focus();
            break;
        }
    }
}

function deleteTransaction(id) {
    var newArr = [];
    for (var i = 0; i < state.transactions.length; i++) {
        if (state.transactions[i].id !== id) { newArr.push(state.transactions[i]) };
    }
    state.transactions = newArr;
    renderTransactions();
}

function handleSubmit(e) {
    e.preventDefault();
    // use to chexck which submit button was clicked
    var isEarn = false;
    if (e.submitter) {
        if (e.submitter.id === 'earnBtn') {
            isEarn = true;
        } else {
            isEarn = false;
        }
    } else {
        isEarn = false;
    }

    var text = document.getElementById('text').value.trim();
    var amountVal = document.getElementById('amount').value;
    if (!text || amountVal === '') { return };

    var amount = Number(amountVal);
    if (isNaN(amount) || amount <= 0) { return };

    //  check that user updating the existing transaction or new
    var id;
    if (isUpdate) {
        id = tid;
    } else {
        id = Math.floor(Math.random() * 1000000);
    }

    //  check that user add earning or expense
    var type;
    if (isEarn) {
        type = 'credit';
    } else {
        type = 'debit';
    }
    // making unique objects for every transction
    var transaction = {
        id: id,
        text: text,
        amount: amount,
        type: type
    };

    if (isUpdate) {
        for (var i = 0; i < state.transactions.length; i++) {
            if (state.transactions[i].id === tid) {
                state.transactions[i] = transaction;
                break;
            }
        }
        isUpdate = false;
        tid = null;
    } else {
        // push new transaction to start so it show on toop
        state.transactions.unshift(transaction);
    }

    // reset form
    formEl.reset();
    document.getElementById('text').focus();
    renderTransactions();
}

// initialize
renderTransactions();
formEl.addEventListener('submit', handleSubmit);

