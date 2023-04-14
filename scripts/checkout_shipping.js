'use strict';

// Shipping Inputs
const clientName = document.querySelector('input[id="name"]');
const clientEmail = document.querySelector('input[id="email"]');
const clientPhone = document.querySelector('input[id="phone"]');
const clientState = document.querySelector(
  '.shipping--state .select-state select'
);
const clientCity = document.querySelector('input[id="city"]');
const clientStreet = document.querySelector('input[id="street"]');
const clientZIP = document.querySelector('input[id="zip"]');

const clientMnthSelect = document.querySelector('.mtd-y .mth select');
const clientYrSelect = document.querySelector(
  '.payment__exp-date-cvv--year .yr select'
);

// Payment Inputs
const cardHolder = document.querySelector('input[id="card-name"]');
const cardNum = document.querySelector('input[id="card-number"]');
const cardMth = document.querySelector('.mth select');
const cardYr = document.querySelector('.yr select');
const cardCVV = document.querySelector('input[id="cvv"]');

// Steps
const shippingEl = document.querySelector('.shipping');
const paymentEl = document.querySelector('.payment');
const summaryEl = document.querySelector('.summary');

// Steps Indicators
const stepLoadingEl = document.querySelector(
  '.checkout__info__steps__cnt--loader--active'
);
const stepOneEl = document.querySelector('.step-1');
const stepTwoEl = document.querySelector('.step-2');
const stepThreeEl = document.querySelector('.step-3');

// Display Summary Informations
const onCardNumEl = document.querySelector('.on-card-number');
const onCardHolderEl = document.querySelector('.on-card-holder');
const onCardExpDateEl = document.querySelector('.on-card-exp-date');
const displayCityandState = document.querySelector('.dsp-state-city');
const displayStreet = document.querySelector('.dsp-street');
const displayZIP = document.querySelector('.dsp-zip');
const summaryTotalPrice = document.querySelector('.summary-total');

// Buttons
const goToPaymentBtnEl = document.querySelector('.shipping-btn');
const goToSummaryBtnEl = document.querySelector('.payment-btn');
const backtoShippingBtnEl = document.querySelector('.back-to-shipping');
const backtopaymentBtnEl = document.querySelector('.back-to-payment');

// Errors
const allShippingErrEl = document.querySelectorAll('.shipping-el .error');
const allpaymentErrEl = document.querySelectorAll('.payment-el .error');

// Stored User Data
const userData = {
  currName: '',
  currEmail: '',
  currPhone: '',
  currState: '',
  currCity: '',
  currStreet: '',
  currZip: '',

  currCardHolder: '',
  currCardNum: '',
  currExpMnth: '',
  currExpYr: '',
  currCVV: ''
};

// NAVIGATION BTW STEPS
//
// Go to Payment Step
goToPaymentBtnEl.addEventListener('click', () => {
  validateShipping();

  if (noError(allShippingErrEl)) goToPaymentStep();
});

// Go to Summary Step
goToSummaryBtnEl.addEventListener('click', () => {
  validatePayment();

  if (noError(allpaymentErrEl)) goToSummaryStep();
});

// Get Back to Shipping Step
backtoShippingBtnEl.addEventListener('click', goToShipping);

// Go Back to Payment Step
backtopaymentBtnEl.addEventListener('click', goToPaymentStep);

// Set Error
const setError = function (el, msg) {
  const inputControl = el.parentElement;
  const displayError = inputControl.querySelector('.error');
  displayError.innerHTML = `<li>${msg}</li>`;
  el.style.borderBottom = '1px solid #ECEDED';
};

// Set Success
const setSuccess = function (el) {
  const inputControl = el.parentElement;
  const displayError = inputControl.querySelector('.error');
  displayError.innerHTML = '';
  el.style.borderBottom = '1px solid #c29117';
};

// Check if any Invalid Form Inputs
const noError = function (arrOfErrs) {
  return Array.from(arrOfErrs).every(err => !err.hasChildNodes());
};

// Go to Shipping Step
function goToPaymentStep() {
  shippingEl.classList.remove('active');
  paymentEl.classList.add('active');
  summaryEl.classList.remove('active');
  stepLoadingEl.style.width = '50%';
  stepOneEl.innerHTML = '';
  stepOneEl.innerHTML =
    '<img src="imgs/icons/checked-step.svg" alt="finished step" />';
  stepTwoEl.innerHTML = '<p>2</p>';
  stepTwoEl.style.backgroundColor = '#c29117';
  stepThreeEl.style.backgroundColor = '#2d3037';
}

// Go to Summary Step
const goToSummaryStep = function () {
  shippingEl.classList.remove('active');
  paymentEl.classList.remove('active');
  summaryEl.classList.add('active');
  stepLoadingEl.style.width = '100%';
  stepOneEl.innerHTML = '';
  stepOneEl.innerHTML =
    '<img src="imgs/icons/checked-step.svg" alt="finished step" />';
  stepTwoEl.style.backgroundColor = '#c29117';

  stepTwoEl.innerHTML = '';
  stepTwoEl.innerHTML =
    '<img src="imgs/icons/checked-step.svg" alt="finished step" />';
  stepTwoEl.style.backgroundColor = '#c29117';
  stepThreeEl.style.backgroundColor = '#c29117';

  displayDataAtSummary();
};

// Go Back to Shipping Functionality
function goToShipping() {
  shippingEl.classList.add('active');
  paymentEl.classList.remove('active');
  summaryEl.classList.remove('active');
  stepLoadingEl.style.width = '0%';
  stepOneEl.innerHTML = '';
  stepOneEl.innerHTML = '<p>1</p>';
  stepTwoEl.innerHTML = '<p>2</p>';
  stepTwoEl.style.backgroundColor = '#2d3037';
  stepThreeEl.style.backgroundColor = '#2d3037';
}

// Validate Shipping
const validateShipping = function () {
  const clientNameVal = clientName.value.trim();
  const clientEmailVal = clientEmail.value.trim();
  const clientPhoneVal = clientPhone.value.trim();
  const clientCityVal = clientCity.value.trim();
  const clientStreetVal = clientStreet.value.trim();
  const clientZIPVal = clientZIP.value.trim();

  // Check Name
  if (clientNameVal == '') {
    setError(clientName, 'This field cannot be empty');
  } else if (clientNameVal.length < 3) {
    setError(clientName, 'The name must be at least 3 character long');
  } else {
    setSuccess(clientName);
    userData.currName = clientNameVal;
  }

  // Check Email
  if (clientEmailVal == '') {
    setError(clientEmail, 'This field cannot be empty');
  } else if (!validateEmail(clientEmailVal)) {
    setError(clientEmail, 'Insert correct email format "ex@mail.com"');
  } else {
    setSuccess(clientEmail);
    userData.currEmail = clientEmailVal;
  }

  // Check Phone Number
  if (clientPhoneVal == '') {
    setError(clientPhone, 'This field cannot be empty');
  } else if (!validatePhone(clientPhoneVal)) {
    setError(clientPhone, 'Incorect phone number format "+1 800 555 1234"');
  } else {
    setSuccess(clientPhone);
    userData.currPhone = clientPhoneVal;
  }

  //   Save State
  const selectedState = clientState.options[clientState.selectedIndex];
  userData.currState = selectedState.value;

  //  Check City
  if (clientCityVal == '') {
    setError(clientCity, 'This field cannot be empty');
  } else if (clientCityVal.length < 3) {
    setError(clientCity, 'The city must have at least 3 characters');
  } else {
    setSuccess(clientCity);
    userData.currCity = clientCityVal;
  }

  //  Check Street Address
  if (clientStreetVal == '') {
    setError(clientStreet, 'This field cannot be empty');
  } else if (clientStreetVal.length < 3) {
    setError(clientStreet, 'Street must have at least 3 characters');
  } else {
    setSuccess(clientStreet);
    userData.currStreet = clientStreetVal;
  }

  //  Check ZIP
  if (clientZIPVal == '') {
    setError(clientZIP, 'This field cannot be empty');
  } else if (!validateZIP(clientZIPVal)) {
    setError(clientZIP, 'Incorrect ZIP');
  } else {
    setSuccess(clientZIP);
    userData.currZip = clientZIPVal;
  }
};

// Validate Payment
const validatePayment = function () {
  const cardHolderVal = cardHolder.value.trim();
  const cardNumVal = cardNum.value.trim();
  const cardCVVVal = cardCVV.value.trim();

  //   Check Card Holder
  if (cardHolderVal == '') {
    setError(cardHolder, 'This field cannot be empty');
  } else if (!validateCardHolder(cardHolderVal)) {
    setError(cardHolder, 'Enter First and Last Name!');
  } else {
    setSuccess(cardHolder);
    userData.currCardHolder = cardHolderVal;
  }

  //   Check Card Number
  if (cardNumVal == '') {
    setError(cardNum, 'Enter your credit card number!');
  } else if (!validateCardNum(cardNumVal)) {
    setError(cardNum, 'Incorrect Card Number!');
  } else {
    setSuccess(cardNum);
    userData.currCardNum = cardNumVal;
  }

  //   Expiring Month Data
  const selectedMonth =
    clientMnthSelect.options[clientMnthSelect.selectedIndex];
  userData.currExpMnth = selectedMonth.value;

  //   Expiring Year Data
  const selectedYear = clientYrSelect.options[clientYrSelect.selectedIndex];
  userData.currExpYr = selectedYear.value;

  //   Check CVV
  if (cardCVVVal == '') {
    setError(cardCVV, 'Enter CVV');
  } else if (!validateCVV(cardCVVVal)) {
    setError(cardCVV, 'Wrong CVV');
  } else {
    setSuccess(cardCVV);
    userData.currCVV = cardCVVVal;
  }
};

// Format Credit Card 16 Digit Number
document.getElementById('card-number').addEventListener('input', event => {
  const input = event.target.value;
  const formattedInput = input.replace(/\D/g, '').replace(/(.{4})/g, '$1 ');
  event.target.value = formattedInput.trim();
});

// Create Dynamic Expered Year
(function () {
  const yearSelectEl = document.querySelector('.yr select');
  const date = new Date();
  let currYear = date.getFullYear();

  for (let i = 0; i < 8; i++) {
    let yr = currYear++;
    yearSelectEl.innerHTML += `<option data-id='${i}' value="${yr}">${yr}</option>`;
  }
})();

const displayDataAtSummary = function () {
  onCardNumEl.textContent = userData.currCardNum;
  onCardHolderEl.textContent = userData.currCardHolder;

  onCardExpDateEl.textContent =
    userData.currExpMnth + ' / ' + userData.currExpYr.slice(2);

  displayCityandState.textContent =
    userData.currCity + ', ' + userData.currState;

  displayStreet.textContent = userData.currStreet;
  displayZIP.textContent = userData.currZip;
  summaryTotalPrice.textContent =
    document.querySelector('.total-price').textContent;
};

// RegEx Validate Email
const validateEmail = email => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// RegEx Validate Phone Number
const validatePhone = phone => {
  return String(phone)
    .toLowerCase()
    .match(
      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
    );
};

// RegEx Validate ZIP Code
const validateZIP = zip => {
  return String(zip)
    .toLowerCase()
    .match(/^\d{5}(?:[-\s]\d{4})?$/);
};

// RegEx Validate Card Holder
const validateCardHolder = holder => {
  return String(holder)
    .toLowerCase()
    .match(
      /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/
    );
};

// RegEx Validate Card Holder
const validateCVV = cvv => {
  return String(cvv)
    .toLowerCase()
    .match(/^\d{3,4}$/);
};

// RegEx Validate Card Number
const validateCardNum = num => {
  return String(num)
    .toLowerCase()
    .match(
      /(?<!\d)\d{16}(?!\d)|(?<!\d[ _-])(?<!\d)\d{4}(?:[_ -]\d{4}){3}(?![_ -]?\d)/
    );
};
