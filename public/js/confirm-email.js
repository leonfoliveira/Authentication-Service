const wrapper = document.getElementById('wrapper');

function showSuccess() {
  const element = '<p id="message">Email confirmed successfully</p>';
  wrapper.innerHTML = element;
}

function showAlreadyConfirmed() {
  const element = '<p id="message">Email already confirmed</p>';
  wrapper.innerHTML = element;
}

function showInvalidLink() {
  const element = '<p id="message">Invalid link</p>';
  wrapper.innerHTML = element;
}

function showUnexpectedError() {
  const element = '<p id="message">An unexpected error has occured. Please try again.</p>';
  wrapper.innerHTML = element;
}

function confirmEmail() {
  const xhttp = new XMLHttpRequest();
  const token = document.getElementById('token').textContent;

  xhttp.onreadystatechange = function () {
    if (this.status === 204) {
      showSuccess();
    } else if (this.status === 400) {
      showAlreadyConfirmed();
    } else if (this.status === 404) {
      showInvalidLink();
    } else {
      showUnexpectedError();
    }
  };

  xhttp.open('GET', `http://localhost:4000/api/confirm/${token}`, true);
  xhttp.send();
}

window.addEventListener('load', confirmEmail);
