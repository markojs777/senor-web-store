'use strict';

const openDropdownEl = document.querySelectorAll('.details__cnt--init');

openDropdownEl.forEach(dropdown => {
  dropdown.addEventListener('click', el => {
    const currEl = el.currentTarget;
    const currElParent = currEl.parentElement;
    const currExpandEl = currElParent.querySelector('.details__cnt--expand');
    const currExpandIndicatorEl = currElParent.querySelector(
      '.dropdown-indicator'
    );

    currExpandIndicatorEl.classList.toggle('opened');
    currExpandEl.classList.toggle('opened');
  });
});
