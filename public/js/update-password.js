const wrapper = document.getElementById('wrapper');

function showSuccess() {
  wrapper.innerHTML = '<p id="message">Password updated successfully</p>';
}

function showInvalidLink() {
  wrapper.innerHTML = '<p id="message">Invalid link</p>';
}

function showUnexpectedError() {
  wrapper.innerHTML = '<p id="message">An unexpected error has occured. Please try again.</p>';
}

function submitForm(e) {
  e.preventDefault();

  const error = document.getElementById('error');
  const button = document.getElementById('button');

  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!password || !confirmPassword) {
    error.textContent = 'Fill the inputs';
    return;
  }

  if (password.length < 8) {
    error.textContent = 'Password must have at least 8 characters.';
    return;
  }

  if (password !== confirmPassword) {
    error.textContent = 'Inputs must match';
    return;
  }

  const xhttp = new XMLHttpRequest();
  const token = document.getElementById('token').textContent;

  xhttp.onreadystatechange = function () {
    error.textContent = '';
    button.disabled = false;
    if (this.status === 204) {
      showSuccess();
    } else if (this.status === 404) {
      showInvalidLink();
    } else {
      console.log(this);
      showUnexpectedError();
    }
  };

  button.disabled = true;
  xhttp.open('PATCH', `http://localhost:4000/api/password/${token}`, true);
  xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhttp.send(
    JSON.stringify({
      password,
    }),
  );
}

const form = document.getElementById('form');

form.addEventListener('submit', submitForm);
