'use strict';

// Open and close filters on mobile view
document
  .querySelector('.products__open-filter')
  .addEventListener('click', () => {
    document.querySelector('.products__filter').classList.toggle('opened');
  });

// Open single filter
const initialFilterStateEl = document.querySelectorAll(
  '.products__filter__container--initial-state'
);

initialFilterStateEl.forEach(filter => {
  filter.addEventListener('click', e => {
    const currFilter = e.currentTarget;
    const currFilterParent = currFilter.parentElement;
    const activateFilter = currFilterParent.querySelector(
      '.products__filter__container--expanded'
    );
    const arrowUp = currFilterParent.querySelector(
      '.products__filter__container--initial-state--dropdown-icon'
    );

    activateFilter.classList.toggle('opened');
    arrowUp.classList.toggle('active');
  });
});
