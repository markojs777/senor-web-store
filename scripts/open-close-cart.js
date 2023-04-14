'use strict';

const openCartEl = document.querySelector('.open-cart');
const cartOverlayEl = document.querySelector('.cart-overlay');
const closeCartEl = document.querySelector(
  '.cart-overlay__cart__my-cart--close'
);
const bluredBackgroundEl = document.querySelector('.cart-overlay--blured-bg');
const cartRightEl = document.querySelector('.cart-overlay__cart');

openCartEl.addEventListener('click', () => {
  cartOverlayEl.classList.remove('closed');
  document.querySelector('body').style.overflow = 'hidden';

  window.setTimeout(() => {
    cartRightEl.classList.add('opened');
  }, 100);

  closeCartEl.addEventListener('click', closeCart);
  bluredBackgroundEl.addEventListener('click', closeCart);
});

const closeCart = function () {
  window.setTimeout(() => {
    cartOverlayEl.classList.add('closed');
  }, 400);

  cartRightEl.classList.remove('opened');

  document.querySelector('body').style.overflow = 'auto';
};
