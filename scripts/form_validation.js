'use strict';

const clientName = document.querySelector('input[name="user_name"]');
const clientEmail = document.querySelector('input[name="user_email"]');
const clientMessage = document.querySelector('textarea[name="user_message"]');

const form = document.querySelector('.get-in-touch__form');

form.addEventListener('submit', e => {
  e.preventDefault();

  validateInputs();
});

const setError = function (element, message) {
  const inputControl = element.parentElement;
  const displayError = inputControl.querySelector('.error');
  displayError.innerHTML = `<li>${message}</li>`;
};

const setSuccess = function (element) {
  const inputControl = element.parentElement;
  const displayError = inputControl.querySelector('.error');
  displayError.innerHTML = '';
  element.style.borderBottom = '1px solid #c29117';
};

const validateInputs = function () {
  const clientNameVal = clientName.value.trim();
  const clientEmailVal = clientEmail.value.trim();
  const clientMessageVal = clientMessage.value.trim();

  //   Check Name
  if (clientNameVal == '') {
    setError(clientName, 'This field must be filled!');
  } else {
    setSuccess(clientName);
  }

  //   Check Email
  if (clientEmailVal == '') {
    setError(clientEmail, 'This field must be filled!');
  } else if (!validateEmail(clientEmailVal)) {
    setError(
      clientEmail,
      'Please enter a valid email address “example@gmail.com”'
    );
  } else {
    setSuccess(clientEmail);
  }

  // Check Message
  if (clientMessageVal == '') {
    setError(clientMessage, 'This field must be filled!');
  } else if (clientMessageVal.length < 20) {
    setError(clientMessage, 'The message must have at least 20 characters!');
  } else {
    setSuccess(clientMessage);
  }
};

const validateEmail = email => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
