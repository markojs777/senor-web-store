'use strict';

const slidesEl = document.querySelector('.header__carousel__slides');
const allSlidesEl = document.querySelectorAll('.header__carousel__slides img');

const bothBtns = document.querySelectorAll('.header__content__btn button');
const prevBtn = document.querySelector('.header__content__btn--prev');
const nextBtn = document.querySelector('.header__content__btn--next');

const indicatorsEl = document.querySelector(
  '.header__content__main__indicators'
);

const heroContentEl = document.querySelector(
  '.header__content__main__title--title'
);

const mainEl = document.querySelector('.header__content__main');

const heroContent = [
  {
    h1: "Equipment for man's care",
    text: "Buy a man's care equipment from us today and receive our high quality products.",
    link: 'products.html',
    discount: 'discount'
  },
  {
    h1: 'Parfumes for gentleman',
    text: 'Get the best perfumes for men online. Get wide selection of top brands in town.',
    link: 'products.html',
    discount: 'no-discount'
  },
  {
    h1: 'High quality cosmetics',
    text: 'Our collection of cosmetics for men is perfect for the modern man who wants to take care of himself.',
    link: 'products.html',
    discount: 'no-discount'
  }
];

let currSlide = 1;
const SLIDER_DELAY = 5000;
let startX, endX;
const allSlidesLength = allSlidesEl.length;

allSlidesEl.forEach((slide, i) => (slide.style.left = `${i * 100}%`));
// Go to Slide
const goToSlide = function (s) {
  allSlidesEl.forEach(
    slide => (slide.style.transform = `translateX(-${s * 100}%)`)
  );
};

// First Slide
goToSlide(currSlide);

// Script to Toggle BTN Opacity when user mouse hovering
bothBtns.forEach(btn => {
  const changeOpacity = function (el) {
    const currBtn = el.currentTarget;
    let opacity = getComputedStyle(currBtn).opacity;
    opacity === '0.2' ? (opacity = '1') : (opacity = '0.2');
    currBtn.style.opacity = opacity;
  };

  btn.addEventListener('mouseenter', changeOpacity);
  btn.addEventListener('mouseleave', changeOpacity);
});

const updateHeroText = function (slide) {
  slide--;

  if (slide > 2) {
    slide = 0;
  }

  if (slide < 0) {
    slide = 2;
  }

  heroContentEl.innerHTML = `
          <div class="header__content__main__title--title">
              <span class="overline ${heroContent[slide].discount}">Discount -20%</span>
              <h1>${heroContent[slide].h1}</h1>
              <p>${heroContent[slide].text}</p>
              <a href="${heroContent[slide].link}" class="header__content__main__title--cta main-button">Shop now</a>
          </div>
  `;
};

const updateSlider = function () {
  goToSlide(currSlide);
  goToIndicator(currSlide);
  updateHeroText(currSlide);
  allSlidesEl.forEach(slide => (slide.style.transition = `all 400ms ease-out`));
};

// Next Slide
const nextSlide = function () {
  if (currSlide < allSlidesLength - 1) {
    currSlide++;
    updateSlider();
    resetAutoSlideTime();
  }
};

// Previous Slide
const prevSlide = function () {
  if (currSlide > 0) {
    currSlide--;
    updateSlider();
    resetAutoSlideTime();
  }
};

// Create Infinite Slider Functionality
const infiniteSlider = function () {
  if (currSlide >= allSlidesLength - 1) {
    allSlidesEl.forEach(slide => (slide.style.transition = 'none'));

    currSlide = 1;

    goToSlide(currSlide);
    goToIndicator(currSlide);
  }

  if (currSlide < 1) {
    allSlidesEl.forEach(slide => (slide.style.transition = 'none'));
    currSlide = allSlidesLength - 2;

    goToSlide(currSlide);
    goToIndicator(currSlide);
  }
};

// Create Indicators
const createIndicators = function (indicators, slidesNum) {
  for (let i = 0; i < slidesNum; i++) {
    indicators.innerHTML += `<div data-id="${i}" class="header__content__main__indicators__indicator"></div>`;
  }
};
createIndicators(indicatorsEl, allSlidesLength);
const allIndicatorsEl = document.querySelectorAll(
  '.header__content__main__indicators__indicator'
);

const activeIndicatorLoader = function () {
  const activeDiv = document.createElement('div');
  activeDiv.classList.add(
    'header__content__main__indicators__indicator--active'
  );
  return activeDiv;
};

const goToIndicator = function (active) {
  allIndicatorsEl.forEach(a => (a.innerHTML = ''));
  allIndicatorsEl[0].style.visibility = 'hidden';
  allIndicatorsEl[allSlidesLength - 1].style.visibility = 'hidden';

  allIndicatorsEl[active].appendChild(activeIndicatorLoader());
};

goToIndicator(currSlide);

allIndicatorsEl.forEach(indicator => {
  indicator.addEventListener('click', el => {
    const activeIndicator = el.currentTarget;
    const activeIndicatorId = activeIndicator.dataset.id;

    currSlide = activeIndicatorId;

    updateSlider();
    resetAutoSlideTime();
  });
});

// On Swipe
const touchStart = function (e) {
  startX = e.touches[0].clientX;
};

const touchEnd = function (e) {
  endX = e.changedTouches[0].clientX;

  if (startX > endX) {
    nextSlide();
  }

  if (startX < endX) {
    prevSlide();
  }
};

// Slider Controls
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);
slidesEl.addEventListener('transitionend', infiniteSlider);
mainEl.addEventListener('touchstart', touchStart);
mainEl.addEventListener('touchend', touchEnd);
let autoSlide = setInterval(nextSlide, SLIDER_DELAY);

const resetAutoSlideTime = function () {
  clearInterval(autoSlide);
  autoSlide = setInterval(nextSlide, SLIDER_DELAY);
};
