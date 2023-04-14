'use strict';

// DROPDOWN NAVIGATION MENU
const navigationEl = document.querySelector('.nav');
const hamburgerMenuEl = document.querySelector('.hamburger-menu');

const navigationLinkEl = document.querySelectorAll(
  '.header__content__main__top-nav__navigation__links--link a'
);

const openMenu = function () {
  navigationEl.classList.toggle('active');
  hamburgerMenuEl.classList.toggle('active');

  navigationLinkEl.forEach(link => {
    link.addEventListener('click', () => {
      navigationEl.classList.toggle('active');
      hamburgerMenuEl.classList.toggle('active');
    });
  });
};

hamburgerMenuEl.addEventListener('click', openMenu);
