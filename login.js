       var form = document.getElementById('loginForm');

        function getState() {
            return JSON.parse(localStorage.getItem('state') || '{}');
        }

        function showAlert(msg) {
            alert(msg);
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // keep HTML validation working
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            var email = document.getElementById('email').value.trim();
            var password = document.getElementById('password').value;

            var state = getState();

            // find user with matching email & password
            var found = null;
            for (var username in state) {
                if (state.hasOwnProperty(username)) {
                    var u = state[username];
                    if (u.email === email && u.password === password) {
                        found = username;
                        break;
                    }
                }
            }

            if (found) {
                // set current user and redirect to expense page
                sessionStorage.setItem('currentUser', found);
                window.location.href = 'expense.html';
            } else {
                showAlert('Incorrect email or password.');
            }
        });
