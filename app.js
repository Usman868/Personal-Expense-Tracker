    // Signup logic (stores users in state object)
    var form = document.getElementById('signupForm');

    function getState() {
      return JSON.parse(localStorage.getItem('state') || '{}');
    }

    function saveState(s) {
      localStorage.setItem('state', JSON.stringify(s));
    }

    function showAlert(msg) {
      // simple non-blocking alert - you can replace with nicer UI
      alert(msg);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // run HTML validation manually (because we prevent default)
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var username = document.getElementById('username').value.trim();
      var email = document.getElementById('email').value.trim();
      var password = document.getElementById('password').value;

      // load state
      var state = getState();

      // ensure username uniqueness
      if (state[username]) {
        showAlert('Username already exists. Pick a different username.');
        return;
      }

      // ensure email uniqueness (no two accounts with same email)
      for (var key in state) {
        if (state[key] && state[key].email === email) {
          showAlert('An account with this email already exists. Use another email or login.');
          return;
        }
      }

      // create user object
      state[username] = {
        email: email,
        password: password,
        transactions: []
      };

      saveState(state);

      showAlert('Signup successful. You can now login.');
      // redirect to login page
      window.location.href = 'login.html';
    });


    


