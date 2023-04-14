'use strict';

const productsDataURL =
  'https://raw.githubusercontent.com/markojs777/productsapi/main/products.json';

const homepage = document.querySelector('.home-page');
const productsPage = document.querySelector('.products-page');
const checkoutPage = document.querySelector('.checkout-page');
const singleProductPage = document.querySelector('#single-product');

// Filter For Products Container
const filterEl = document.querySelector('.products__filter');

// Price Range Element
const priceRangeContainerEl = document.querySelector('.price-range');

// Displayed Products Container (PRODUCT PAGE)
const productsViewContainerEl = document.querySelector(
  '.products__exhibited .grid'
);

// Featured Products Container
const featuredProductsContainerEl = document.querySelector(
  '#featured .products .grid'
);

// Related Products Container
const relatedProductsContainerEl = document.querySelector(
  '#related-products .products .grid'
);
const relatedProductsEl = document.querySelector('#related-products');

const relatedFromHeadingEl = document.querySelector('.related--title h2');

// Featured Products Per View
const productsPerView = +getComputedStyle(
  document.documentElement
).getPropertyValue('--featured-products-per-view');

// Featured products Controls
const prevFeaturedProduct = document.querySelector(
  '.featured__title-and-controls__controls--prev'
);
const nextFeaturedProduct = document.querySelector(
  '.featured__title-and-controls__controls--next'
);

// Pagination for Products
const leftPaginationButtonEl = document.querySelector(
  '.products__exhibited__pagination--left'
);
const rightPaginationButtonEl = document.querySelector(
  '.products__exhibited__pagination--right'
);

// InCart Elements
const inCartItemsIndicatorEl = document.querySelector('.in-cart-items');
const inCartsumEl = document.querySelector('.in-cart-sum');
const inCartProductsEl = document.querySelector('.in-cart-products');
const inOpenedCartSumEl = document.querySelector('.in-opened-cart-sum');
const spendToShippingEl = document.querySelector('.free-shipping-left');
const freeShippingLoadingBgEl = document.querySelector(
  '.free-shipping-load-bg'
);
const freeShippingLoadingActiveEl = document.querySelector(
  '.free-shipping-load-active'
);
const freeShippingDscEl = document.querySelector('.free-shipping-dsc');

// InChecout Elements

const checkoutProductsContainerEL = document.querySelector(
  '.in-checkout-products'
);
const checkoutStepsCntEl = document.querySelector('.checkout__info');

const inCheckoutSum = document.querySelector('.in-checkout-sum');
const shippingStatus = document.querySelector('.shipping-status');
const totalPrice = document.querySelector('.total-price');

// Search Elements
const recommendedContainerEl = document.querySelector(
  '.search-overlay__main--recommended .scroll'
);
const leftRecommendedBtnEl = document.querySelector('.rec-btn-left');
const rightRecommendedBtnEl = document.querySelector('.rec-btn-right');
const searchInputEl = document.querySelector(
  '.search-overlay__main__search-bar--search input'
);
const productsSearchResultsEl = document.querySelector(
  '.search-overlay__results__list'
);
const openSearchEl = document.querySelector('.open-search');
const closeSearchEl = document.querySelector('.search-overlay__main--close');
const searchOverlayEL = document.querySelector('.search-overlay');

// DEFAULT VALUES
let currPage = 1;
const visibleProducts = 12;
const priceRangeGap = 50;
let filteredProducts;
let scrollP = 0;
const spendToShipping = 75;
const BTN_LOAD_TIME = 600;
let inCart = JSON.parse(localStorage.getItem('inCartProducts')) || [];

// Call JSON Data
fetch(productsDataURL).then(response => {
  if (!response.ok) return;

  const data = response.json();

  data.then(productsData => {
    // HOMEPAGE
    if (homepage) {
      const featuredProducts = productsData.filter(product => product.featured);
      const featuredLength = featuredProducts.length;

      displayFeaturedProducts(
        featuredProducts,
        featuredProductsContainerEl,
        featuredLength
      );

      const singleFeaturedProductEl = document.querySelector(
        '.products .products__product'
      );

      featuredProductsSlider(singleFeaturedProductEl, featuredLength);
    }

    // PRODUCTS PAGE
    if (productsPage) {
      const allProducts = productsData.slice();

      createCategoriesFilter(allProducts);

      // Render Products UI
      displayProductsIntoView(currPage, allProducts, visibleProducts);
      createPagination(currPage, allProducts, visibleProducts);
      createPriceRangeFilter(allProducts);
      priceRangeFunctionality(priceRangeGap);

      // Products Filters
      filterEl.addEventListener(
        'change',
        filterProducts.bind(null, allProducts)
      );

      // Pagination Controls
      filteredProducts = allProducts;
      rightPaginationButtonEl.addEventListener('click', nextPage);
      leftPaginationButtonEl.addEventListener('click', prevPage);
    }

    // PRODUCT DETAILS PAGE
    if (singleProductPage) {
      createRelatedProducts(productsData, relatedProductsContainerEl);
    }

    // Search
    createSearchRecommended(productsData, recommendedContainerEl);
    recommendedBtnsControl();
    displayResultsBasedOnName(productsData);
    displayResultsBasedOnRecommended(productsData);
  });
});

// Create Skeleton Loading Elements
const createLoadingSkeleton = function (displayedProducts, productsContainer) {
  productsContainer.innerHTML = '';

  for (let i = 0; i < displayedProducts; i++) {
    productsContainer.innerHTML += `
          <div class="products__exhibited__product">
          <figure class="products__exhibited__product--img loading"></figure>
          <div class="products__exhibited__product__info">
            <div class="products__exhibited__product__info__title-price">
              <p
                class="products__exhibited__product__info__title-price--title loading"
              ></p>
              <p
                class="products__exhibited__product__info__title-price--price loading"
              ></p>
            </div>
          </div>
        </div>
    `;
  }
};
if (productsPage) {
  createLoadingSkeleton(visibleProducts, productsViewContainerEl);
}

// Create a Dynamic ALT Attribute for an Images
const altForImage = function (currProduct, currIndex) {
  const fromLinkToTitle = currProduct[currIndex].imageUrl
    .split('.')
    .shift()
    .split('-');

  return fromLinkToTitle.map(el => el[0].toUpperCase() + el.slice(1)).join(' ');
};

// Display a Products into View
const displayProductsIntoView = function (page, products, displayedProducts) {
  page--;
  productsViewContainerEl.innerHTML = '';

  const firstProduct = page * displayedProducts;
  const lastProduct = firstProduct + displayedProducts;

  const excludeVisibleProducts = products.slice(firstProduct, lastProduct);
  const excludeVisibleProductsLength = excludeVisibleProducts.length;

  for (let i = 0; i < excludeVisibleProductsLength; i++) {
    productsViewContainerEl.innerHTML += `
      <div class="products__exhibited__product" data-product-id="${
        excludeVisibleProducts[i].id
      }">
        <figure class="products__exhibited__product--img">
           <img src="imgs/products/${
             excludeVisibleProducts[i].imageUrl
           }" alt="${altForImage(products, i)}" /> 
        </figure>
        <div class="products__exhibited__product__info">
          <div class="products__exhibited__product__info__title-price">
            <p
              class="products__exhibited__product__info__title-price--title product-name"
            >
            ${excludeVisibleProducts[i].name} 
            </p>
            <p
              class="products__exhibited__product__info__title-price--price product-price"
            >
            $${excludeVisibleProducts[i].price}
            </p>
          </div>
          <div
            class="products__exhibited__product__info__add-and-more d-flex h-flex"
          >
            <div
              class="products__exhibited__product__info__add-and-more--add add-to-cart" data-product-id="${
                excludeVisibleProducts[i].id
              }"
            >
              <img
                src="imgs/icons/addtocart.svg"
                alt="add to cart button"
                
              />
            </div>
            <a
              href="products/${excludeVisibleProducts[i].link}"
              class="products__exhibited__product__info__add-and-more--more product-link"
              >Details</a
            >
          </div>
        </div>
      </div>
    `;
  }

  const addToCartEl = document.querySelectorAll('.add-to-cart');
  addToCart(addToCartEl);
  isBought(addToCartEl);
};

// This Will Prevent from Clicking ADD to Cart button even after refreshing page
const isBought = function (addBtn) {
  if (inCart.length < 1) return;
  const inCartElIds = inCart.map(p => p.id);
  const idLength = inCartElIds.length;

  addBtn.forEach(btn => {
    for (let i = 0; i < idLength; i++) {
      if (btn.getAttribute('data-product-id') === inCartElIds[i]) {
        btn.innerHTML = `<img src="${
          singleProductPage ? '../../' : ''
        }imgs/icons/addtocartdone.svg" alt="add to cart button"/>`;
        btn.style.backgroundColor = '#2d3037';
        btn.style.pointerEvents = 'none';

        if (singleProductPage) {
          btn.style.textAlign = 'center';
        }
      }
    }
  });
};

// PAGINATION CONTROLS
//
// Create a Pagination
const createPagination = function (page, products, displayedProducts) {
  page--;
  const paginationEl = document.querySelector(
    '.products__exhibited__pagination'
  );

  if (products.length <= displayedProducts) paginationEl.style.display = 'none';
  if (products.length > displayedProducts) paginationEl.style.display = 'flex';

  const paginationPagesContainer = document.querySelector(
    '.products__exhibited__pagination__pages'
  );
  paginationPagesContainer.innerHTML = '';

  for (
    let i = 1;
    i < dividedArrayIntoPages(products, displayedProducts) + 1;
    i++
  ) {
    paginationPagesContainer.innerHTML += `
    <li class="products__exhibited__pagination__pages--page">${i}</li>
    `;
  }

  addOrRemoveButton(page, products, displayedProducts);
  createActivePage(products);
};

// Create an Active Page
const createActivePage = function (products) {
  const currActivePage = document.querySelectorAll(
    '.products__exhibited__pagination__pages--page'
  );

  currActivePage.forEach(p => {
    if (currPage === +p.innerText) p.classList.add('active');

    p.addEventListener('click', e => {
      const currPageEl = e.target;
      document
        .querySelectorAll(
          '.products__exhibited__pagination__pages--page.active'
        )
        .forEach(active => active.classList.remove('active'));

      currPageEl.classList.add('active');

      currPage = +currPageEl.innerText;

      displayProductsIntoView(+currPageEl.innerText, products, visibleProducts);
      addOrRemoveButton(+currPageEl.innerText - 1, products, visibleProducts);

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    });
  });
};

// Create Add and Remove Left and Right Button Feature
const addOrRemoveButton = function (page, products, visibleProducts) {
  page < 1
    ? (document.querySelector(
        '.products__exhibited__pagination--left'
      ).style.display = 'none')
    : (document.querySelector(
        '.products__exhibited__pagination--left'
      ).style.display = 'block');

  page >= dividedArrayIntoPages(products, visibleProducts) - 1
    ? (document.querySelector(
        '.products__exhibited__pagination--right'
      ).style.display = 'none')
    : (document.querySelector(
        '.products__exhibited__pagination--right'
      ).style.display = 'block');
};

// Next Page
const nextPage = function () {
  currPage++;

  // Render Products UI
  paginationBtnControl();
};

// Previous Page
const prevPage = function () {
  currPage--;

  // Render Products UI
  paginationBtnControl();
};

const paginationBtnControl = function () {
  displayProductsIntoView(currPage, filteredProducts, visibleProducts);
  createPagination(currPage, filteredProducts, visibleProducts);

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant'
  });
};

// Divided Array Into Pages Feature
const dividedArrayIntoPages = (products, displayedProducts) =>
  Math.ceil(products.length / displayedProducts);

// Create a Categories List Filter
const createCategoriesFilter = function (products) {
  const categoriesFilterEl = document.querySelector('.categories-filter');

  const filterOutCategories = products.map(
    productCategory => (productCategory = productCategory.category)
  );
  const allCategoriesFromAnArray = [...new Set(filterOutCategories)];

  const catAndAmount = allCategoriesFromAnArray.map(currCat => [
    currCat,
    filterOutCategories.filter(cat => cat === currCat).length
  ]);

  const categoryName = catAndAmount.map(cat => cat[0].replaceAll('-', ' '));
  const productsAmount = catAndAmount.map(cat => cat[1]);

  const categoriesLength = allCategoriesFromAnArray.length;
  for (let i = 0; i < categoriesLength; i++) {
    const createCategorySelectHtml = `
        <div class="select-category d-flex h-flex">
          <input type="checkbox" id="${catAndAmount[i][0]}" />
          <label for="${catAndAmount[i][0]}">${categoryName[i]} <span>(${productsAmount[i]})</span></label>
        </div>
    `;
    categoriesFilterEl.insertAdjacentHTML(
      'beforeend',
      createCategorySelectHtml
    );
  }
};

// Filter Products Functionality
const filterProducts = function (data) {
  const sortBy = document.querySelector('#sort-by').value;
  const category = [
    ...document.querySelectorAll('.select-category input:checked')
  ].map(product => product.id);

  const minPrice = +document.querySelector(
    '.price-range-container__min-max-price--min span'
  ).innerText;
  const maxPrice = +document.querySelector(
    '.price-range-container__min-max-price--max span'
  ).innerText;

  const sorted = function (a, b) {
    return a.price - b.price;
  };

  const sortDataCopy = data.slice();

  const defaultSort = function () {
    if (sortBy === 'default') {
      return sortDataCopy;
    }
  };

  const lowestPrice = function () {
    if (sortBy === 'lowest-price') {
      return sortDataCopy.sort(sorted);
    }
  };

  const highestPrice = function () {
    if (sortBy === 'highest-price') {
      return sortDataCopy.sort(sorted).reverse();
    }
  };

  defaultSort() || lowestPrice() || highestPrice();

  filteredProducts = sortDataCopy.filter(
    c =>
      (!category.length || category.includes(c.category)) &&
      (!minPrice || minPrice <= c.price) &&
      (!maxPrice || maxPrice >= c.price)
  );

  if (filteredProducts.length < 1) {
    document.querySelector('.outfiltered').classList.add('active');
    document
      .querySelector('.outfiltered p span')
      .addEventListener('click', () => {
        location.reload();
      });
  } else {
    document.querySelector('.outfiltered').classList.remove('active');
  }

  currPage = 1;

  // Render Products
  displayProductsIntoView(currPage, filteredProducts, visibleProducts);
  createPagination(currPage, filteredProducts, visibleProducts);
  checkboxStyle();
};

// Checkbox Style
const checkboxStyle = function () {
  const checkboxEl = document.querySelectorAll('.select-category input');
  checkboxEl.forEach(input => {
    input.checked
      ? (input.style.border = 'none')
      : (input.style.border = '1px solid #e4e5e6');
  });
};

// Create a Price Range Filter
const createPriceRangeFilter = function (products) {
  priceRangeContainerEl.innerHTML = '';

  const getAllPrices = products.map(product => product.price);
  let minPrice = Math.min(...getAllPrices);
  const maxPrice = Math.max(...getAllPrices);

  if (minPrice > 1) minPrice = 0;

  priceRangeContainerEl.innerHTML += `
      <div class="price-range-container">
        <div class="price-range-container__min-max-price d-flex h-flex">
          <p class="price-range-container__min-max-price--min">
            $<span>${minPrice}</span>
          </p>
          <p class="price-range-container__min-max-price--max">
            $<span>${maxPrice}</span>
          </p>
        </div>
        <div class="price-range-container__range-slider">
          <div
            class="price-range-container__range-slider--progress-bar"
          ></div>
          <div class="price-range-container__range-slider--range">
            <input
              type="range"
              class="range-min"
              min="${minPrice}"
              max="${maxPrice}"
              value="${minPrice}"
              step="0.01"
            />
            <input
              type="range"
              class="range-max"
              min="${minPrice}"
              max="${maxPrice}"
              value="${maxPrice}"
              step="0.01"
            />
          </div>
        </div>
      </div>
  `;
};

// Create price range functionality

const priceRangeFunctionality = function (gap) {
  const range = document.querySelectorAll(
    '.price-range-container__range-slider--range input'
  );
  const progressBar = document.querySelector(
    '.price-range-container__range-slider--progress-bar'
  );

  const minPriceValue = document.querySelector(
    '.price-range-container__min-max-price--min span'
  );

  const maxPriceValue = document.querySelector(
    '.price-range-container__min-max-price--max span'
  );

  range.forEach(btn => {
    btn.addEventListener('input', e => {
      let minRange = +range[0].value;
      let maxRange = +range[1].value;

      if (maxRange - minRange < gap) {
        if (e.target.className === 'range-min') {
          range[0].value = maxRange - gap;
        } else {
          range[1].value = minRange + gap;
        }
      } else {
        progressBar.style.left = (minRange / range[0].max) * 100 + '%';
        progressBar.style.right = 100 - (maxRange / range[1].max) * 100 + '%';
        minPriceValue.textContent = minRange;
        maxPriceValue.textContent = maxRange;
      }
    });
  });
};

// Homepage Featured Products Functionality

const createFeaturedProductsSkeleton = function (productsContainer) {
  productsContainer.innerHTML = '';

  for (let i = 0; i < productsPerView; i++) {
    productsContainer.innerHTML += `
    <div class="products__product">
    <figure class="products__product--img loading"></figure>
    <div class="product-name-price-add">
      <div class="product-name-price">
        <p class="products__product--title loading"></p>
        <p class="products__product--price loading"></p> 
    </div>
  </div>
    `;
  }
};
if (homepage) {
  createFeaturedProductsSkeleton(featuredProductsContainerEl);
}

// Load Products into View
const displayFeaturedProducts = function (
  products,
  productsContainer,
  numOfFeatured
) {
  productsContainer.innerHTML = '';

  for (let i = 0; i < numOfFeatured; i++) {
    productsContainer.innerHTML += `
    <div class="products__product" data-product-id="${products[i].id}">
    <figure class="products__product--img">
      <img
        src="imgs/products/${products[i].imageUrl}"
        alt="${altForImage(products, i)}"
      /> 
    </figure>

    <div class="product-name-price-add">
      <div class="product-name-price">
        <p class="products__product--title product-name">
        ${products[i].name}
        </p>
        <p class="products__product--price product-price">$${
          products[i].price
        }</p>
      </div>
       <div class="product-name-price-add-info d-flex h-flex">
        <div class="products__product--add add-to-cart" data-product-id="${
          products[i].id
        }">
          <img
            src="${singleProductPage ? '../../' : ''}imgs/icons/addtocart.svg"
            alt="add to cart button"
          />
        </div>
        <a class="product-link" href="products/${products[i].link}">Details</a>
      </div> 
    </div>
  </div>
    `;
  }

  const addToCartEl = document.querySelectorAll('.add-to-cart');
  addToCart(addToCartEl);
  isBought(addToCartEl);
};

// Featured Products Slider Functionality
const featuredProductsSlider = function (singleProductEl, numOfFeatured) {
  const updateSlider = function (s) {
    const widthOfProductEl = singleProductEl.clientWidth + 30;
    featuredProductsContainerEl.style.left = `-${s * widthOfProductEl}px`;
  };

  //  Next Slide
  const scrollNextProduct = function () {
    if (scrollP > numOfFeatured - productsPerView - 1) return;
    scrollP++;
    updateSlider(scrollP);
  };

  // Previous Slide
  const scrollPreviousProduct = function () {
    if (scrollP > 0) {
      scrollP--;
      updateSlider(scrollP);
    }
  };

  nextFeaturedProduct.addEventListener('click', scrollNextProduct);
  prevFeaturedProduct.addEventListener('click', scrollPreviousProduct);
};

const addToCart = function (addBtn) {
  // Add to Cart Functionality
  addBtn.forEach(add => {
    add.addEventListener('click', e => {
      const loadAnimation = e.currentTarget;
      loadAnimation.style.pointerEvents = 'none';

      loadAnimation.style.textAlign = 'center';

      const productId = add.dataset.productId;
      const currProduct =
        e.currentTarget.parentElement.parentElement.parentElement;

      const productImgLink = currProduct
        .querySelector('img')
        .src.split('/')
        .pop();

      const productImgAlt = currProduct.querySelector('img').alt;

      const productName = currProduct
        .querySelector('.product-name')
        .textContent.trim();

      const productPrice = +currProduct
        .querySelector('.product-price')
        .textContent.trim()
        .slice(1);

      // const productLink = currProduct
      //   .querySelector('.product-link')
      //   .getAttribute('href')
      //   .split('/')
      //   .slice(1)
      //   .join('/');

      const cartProductObj = {
        imageUrl: productImgLink,
        pName: productName,
        price: [productPrice],
        alt: productImgAlt,
        id: productId
        // link: productLink
      };

      inCart.push(cartProductObj);
      localStorage.setItem('inCartProducts', JSON.stringify(inCart));

      AddBtnAnimation(loadAnimation);
    });
  });
};

// Add to Cart Button Animation
const AddBtnAnimation = function (load) {
  load.innerHTML = `<img src="${
    singleProductPage ? '../../' : ''
  }imgs/icons/addtocartloading.svg" alt="add to cart button"/>`;
  load.style.backgroundColor = '#0d0f15';

  load.children[0].animate(
    [{ transform: 'rotate(0deg)' }, { transform: 'rotate(720deg)' }],
    {
      duration: BTN_LOAD_TIME,
      iterations: 1
    }
  );

  setTimeout(() => {
    load.innerHTML = `<img src="${
      singleProductPage ? '../../' : ''
    }imgs/icons/addtocartdone.svg" alt="add to cart button"/>`;
    load.style.backgroundColor = '#2d3037';

    createInCartProduct(inCart, inCartProductsEl);
    genIndicatorAndSum();
    removeInCartProduct();
    shippingLoading();
    changeQuantity();
  }, BTN_LOAD_TIME);
};

const createInCartProduct = function (fromStorage, inCartContainer) {
  inCartContainer.innerHTML = '';

  const productsLength = fromStorage.length;
  for (let i = 0; i < productsLength; i++) {
    inCartContainer.innerHTML += `
            <li class="product d-flex" data-product-id="${fromStorage[i].id}">
            <img
              class="product--picture"
              src="${singleProductPage ? '../../' : ''}imgs/products/${
      fromStorage[i].imageUrl
    }"
              alt="${altForImage(fromStorage, i)}"
            />
            <div class="product__dcs">
              <div class="product__dcs__top d-flex">
                <p class="product__dcs__top--title">${fromStorage[i].pName}</p>
                <div class="product__dcs__top--remove-product remove-product" data-product-id="${
                  fromStorage[i].id
                }">
                  <span></span>
                </div>
              </div>
              <div class="product__dcs__bottom multiply-qty d-flex h-flex" data-product-id="${
                fromStorage[i].id
              }">
                <div
                  class="product__dcs__bottom__quantity d-flex h-flex"
                >
                  <div class="product__dcs__bottom__quantity--decrease decrease-qty">
                    <span></span>
                  </div>
                  <div class="product__dcs__bottom__quantity--num num-qty">
                    1
                  </div>
                  <div class="product__dcs__bottom__quantity--increase increase-qty">
                    <span></span>
                  </div>
                </div>
                <p class="product__dcs__bottom--price">
                  <span class="multiply-by">1</span> x <span>$${
                    fromStorage[i].price[0]
                  }</span>
                </p>
              </div>
            </div>
          </li>
    `;
  }
};

// Display Products in Checkout Page
const createInCheckoutProduct = function (fromStorage, inCheckoutContainer) {
  inCheckoutContainer.innerHTML = '';
  const productsLength = fromStorage.length;

  if (productsLength < 1) checkoutStepsCntEl.style.display = 'none';

  console.log(fromStorage);

  for (let i = 0; i < productsLength; i++) {
    checkoutProductsContainerEL.innerHTML += `
      <li class="product">
          <div class="product__img-title d-flex h-flex">
            <img
              src="imgs/products/${fromStorage[i].imageUrl}"
              alt="${altForImage(fromStorage, i)}"
              class="product__img-title--img"
            />
            <p class="product__img-title--title">
            ${fromStorage[i].pName}
            </p>
          </div>
          <p class="product--qty">${fromStorage[i].price.length} x</p>
          <p class="product--price">$${fromStorage[i].price[0]}</p>
      </li>
    `;
  }
};

// Remove Product From the Cart
const removeInCartProduct = function () {
  document
    .querySelectorAll('.remove-product')
    .forEach(removeBtn => removeBtn.addEventListener('click', removeProduct));
};

const removeProduct = function (event) {
  const currBtn = event.currentTarget;
  const currInCartProduct = currBtn.closest('li');
  const inCartProductId = currInCartProduct.dataset.productId;

  currInCartProduct.remove();
  inCart = inCart.filter(product => product.id !== inCartProductId);
  localStorage.setItem('inCartProducts', JSON.stringify(inCart));

  genIndicatorAndSum();
  shippingLoading();

  isNotBought(inCartProductId);

  if (checkoutPage) {
    createInCheckoutProduct(inCart, checkoutProductsContainerEL);
    checkoutTotal();
  }
};

// Increase of Quantity for a Current Product
const changeQuantity = function () {
  const currQtyContainer = document.querySelectorAll('.multiply-qty');
  currQtyContainer.forEach((qty, i) => {
    const addUpToPriceEl = qty.querySelector('.increase-qty');
    const subFromPriceEl = qty.querySelector('.decrease-qty');
    const qtyNumEl = qty.querySelector('.num-qty');
    const multiplyByPriceEl = qty.querySelector('.multiply-by');

    let currQty = 1;
    const currProductPrice = inCart[i].price;
    currQty = currProductPrice.length;
    qtyNumEl.textContent = currQty;
    multiplyByPriceEl.textContent = currQty;

    addUpToPriceEl.addEventListener('click', () => {
      if (currQty < 5 && currQty >= 1) {
        currQty++;

        const [price] = currProductPrice;
        currProductPrice.push(price);
        localStorage.setItem('inCartProducts', JSON.stringify(inCart));

        qtyNumEl.textContent = currQty;
        multiplyByPriceEl.textContent = currQty;

        genIndicatorAndSum();
        shippingLoading();

        if (checkoutPage) {
          createInCheckoutProduct(inCart, checkoutProductsContainerEL);
          checkoutTotal();
        }
      }
    });

    subFromPriceEl.addEventListener('click', () => {
      if (currQty > 1) {
        currQty--;

        currProductPrice.pop();
        localStorage.setItem('inCartProducts', JSON.stringify(inCart));

        qtyNumEl.textContent = currQty;
        multiplyByPriceEl.textContent = currQty;

        genIndicatorAndSum();
        shippingLoading();

        if (checkoutPage) {
          createInCheckoutProduct(inCart, checkoutProductsContainerEL);
          checkoutTotal();
        }
      }
    });
  });
};

// Generate Num of Bought Products and Sum
const genIndicatorAndSum = function () {
  inCartItemsIndicatorEl.parentElement.style.display = `${
    inCart.length > 0 ? 'flex' : 'none'
  }`;
  inCartsumEl.style.marginLeft = `${inCart.length > 0 ? '20px' : '10px'}`;

  inCartItemsIndicatorEl.textContent = inCart.length;
  inOpenedCartSumEl.textContent = '$' + inCartSum(inCart);
  inCartsumEl.textContent = inOpenedCartSumEl.textContent;
};

// Calculate the Sum of All Products
const inCartSum = inCartProducts =>
  inCartProducts
    .reduce(
      (acum, products) => acum + products.price.reduce((acum, p) => acum + p),
      0
    )
    .toFixed(2);

// Free Shipping Loading to Unlocked Shipping
const shippingLoading = function () {
  const inCartSum = +inOpenedCartSumEl.textContent.slice(1);
  const leftToFreeShipping = spendToShipping - inCartSum;

  if (leftToFreeShipping <= spendToShipping) {
    spendToShippingEl.textContent = '$' + leftToFreeShipping.toFixed(2);
    freeShippingLoadingActiveEl.style.width = `${
      inCartSum <= 25 ? inCartSum : inCartSum + 25
    }%`;
    freeShippingLoadingActiveEl.style.transition = '400ms ease';
  }

  if (inCartSum >= spendToShipping) {
    freeShippingLoadingBgEl.style.display = 'none';
    freeShippingDscEl.innerHTML = `<img src="${
      singleProductPage ? '../../' : ''
    }imgs/icons/free-shipping-checkmark.svg" alt="free shipping approved" style="margin-right: 5px; margin-bottom: 1px;"/> Free Shipping Unlocked`;
  }

  if (inCartSum >= 0 && inCartSum < spendToShipping) {
    freeShippingLoadingBgEl.style.display = 'flex';
    freeShippingDscEl.innerHTML = `Add <span class="free-shipping-left">$${leftToFreeShipping.toFixed(
      2
    )}</span> to the cart and get free delivery.`;
  }
};

// Remove DONE state from Add Product Buttons
const isNotBought = function (currInCartProductId) {
  if (inCart.length < 0) return;
  const addToCartEl = document.querySelectorAll('.add-to-cart');

  addToCartEl.forEach(btn => {
    const currAddBtnId = btn.dataset.productId;

    if (currInCartProductId === currAddBtnId) {
      btn.innerHTML = `<img src="${
        singleProductPage ? '../../' : ''
      }imgs/icons/addtocart.svg" alt="add to cart button"/> 
      ${
        Array.from(btn.classList).includes('dscBtn')
          ? '<span>Add to cart</span>'
          : ''
      }
      `;

      btn.style.backgroundColor = '#0d0f15';
      btn.style.pointerEvents = 'auto';

      btn.addEventListener('mouseover', () => {
        btn.style.backgroundColor = '#c29117';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = '#0d0f15';
      });
    }
  });
};

// Checkout Page Total Price Calculations
const checkoutTotal = function () {
  inCheckoutSum.textContent = '$' + inCartSum(inCart);
  shippingStatus.textContent = inCartSum(inCart) >= 75 ? 'Free' : '+ $25.00';
  totalPrice.textContent =
    inCartSum(inCart) <= 75 && inCartSum(inCart) > 0
      ? `$${(+inCartSum(inCart) + 25).toFixed(2)}`
      : `$${inCartSum(inCart)}`;
};

// Call
createInCartProduct(inCart, inCartProductsEl);
genIndicatorAndSum();
shippingLoading();
removeInCartProduct();
changeQuantity();

if (checkoutPage) {
  createInCheckoutProduct(inCart, checkoutProductsContainerEL);
  checkoutTotal();
}

//
//
//
// Search Functionality
const createSearchRecommended = function (products, container) {
  const getCategories = products.map(p => p.category);
  const categories = [...new Set(getCategories)];
  const categoriesLength = categories.length;

  for (let i = 0; i < categoriesLength; i++) {
    container.innerHTML += `<li class="rec-category" data-category-id="${
      categories[i]
    }"><span >#</span>${categories[i].split('-').join(' ')}</li>`;
  }
};

// Recommended Searches Control
const recommendedBtnsControl = function () {
  let currRecCat = 0;
  const allWidths = [];
  const allCategoriesEl = document.querySelectorAll('.rec-category');
  const lastCategoryEl = allCategoriesEl[allCategoriesEl.length - 1];
  allCategoriesEl.forEach(categ => (categ.style.userSelect = 'none'));
  showNextBtnOnLoad();

  // Show Next Recommended Category on Load
  function showNextBtnOnLoad() {
    if (
      window.innerWidth < widthOfAllRecommended() &&
      window.innerWidth > 768
    ) {
      rightRecommendedBtnEl.style.visibility = 'visible';
    }
  }

  // Slide Through Recommended Categories
  const categSlide = function () {
    const widthAdd = allWidths.reduce((accum, width) => accum + width, 0);
    allCategoriesEl.forEach(categ => {
      categ.style.transform = `translateX(-${widthAdd}px)`;
    });
  };

  // Remove Right Button if the Last Recommended Category Show Within the Window
  const removeBtnOnLastPos = function () {
    const lastCatPosition = lastCategoryEl.getBoundingClientRect();

    if (Math.trunc(lastCatPosition.left + 40) < window.innerWidth) {
      rightRecommendedBtnEl.style.visibility = 'hidden';
      categSlide();
    }
  };

  // Slide to the Right by One Recommended Category
  const nextRecommCateg = function () {
    currRecCat++;
    let currRecCatWidth = allCategoriesEl[currRecCat].clientWidth;
    allWidths.push(currRecCatWidth);

    categSlide();

    if (currRecCat > 0) {
      leftRecommendedBtnEl.style.visibility = 'visible';
    }

    removeBtnOnLastPos();
  };

  // Slide to the Left by One Recommended Category
  const prevRecommCateg = function () {
    currRecCat--;
    allWidths.pop();
    categSlide();

    rightRecommendedBtnEl.style.visibility = 'visible';

    if (currRecCat < 1) {
      leftRecommendedBtnEl.style.visibility = 'hidden';
    }
  };

  // Open Search
  const openSearch = function () {
    searchOverlayEL.classList.remove('closed');
    searchInputEl.focus();
    document.querySelector('body').style.overflow = 'hidden';

    showNextBtnOnLoad();
    removeBtnOnLastPos();
  };

  // Close Search
  const closeSearch = function () {
    searchOverlayEL.classList.add('closed');
    productsSearchResultsEl.innerHTML = '';
    searchInputEl.value = '';
    document
      .querySelectorAll('.rec-category.active')
      .forEach(active => active.classList.remove('active'));
    document.querySelector('body').style.overflow = 'auto';
  };

  // Controls
  openSearchEl.addEventListener('click', openSearch);
  closeSearchEl.addEventListener('click', closeSearch);
  rightRecommendedBtnEl.addEventListener('click', nextRecommCateg);
  leftRecommendedBtnEl.addEventListener('click', prevRecommCateg);
};

// Sum of All Recommended Categories
const widthOfAllRecommended = function () {
  const recCategoryEls = Array.from(document.querySelectorAll('.rec-category'));
  const recCategoryElsLength = recCategoryEls.length;
  const arrOfAllWidths = recCategoryEls.map(categ => categ.clientWidth);
  const sumOFWidths =
    arrOfAllWidths.reduce((accum, categ) => accum + categ, 0) +
    recCategoryElsLength * 15 +
    40;

  return sumOFWidths;
};

// Display Search Results Basen on Name
const displayResultsBasedOnName = function (products) {
  searchInputEl.addEventListener('click', () => {
    if (!searchInputEl.value) {
      document
        .querySelectorAll('.rec-category.active')
        .forEach(active => active.classList.remove('active'));
      productsSearchResultsEl.innerHTML = '';
    }
  });

  searchInputEl.addEventListener('input', () => {
    const searchValue = searchInputEl.value.toLowerCase();

    let x = products.filter(p => p.name.toLowerCase().includes(searchValue));

    if (searchValue) {
      displaySearchResults(x);
    } else {
      productsSearchResultsEl.innerHTML = '';
    }
  });
};

// Display Results Based on Recommended
const displayResultsBasedOnRecommended = function (resProducts) {
  productsSearchResultsEl.innerHTML = '';

  document.querySelectorAll('.rec-category').forEach(categ => {
    categ.addEventListener('click', e => {
      searchInputEl.value = '';
      const currCategory = e.currentTarget;
      const currCategID = currCategory.dataset.categoryId;

      document
        .querySelectorAll('.rec-category.active')
        .forEach(active => active.classList.remove('active'));

      currCategory.classList.add('active');

      const displayById = resProducts.filter(p => p.category == currCategID);

      displaySearchResults(displayById);
    });
  });
};

// Generate HTML Script for Search Results Container
const displaySearchResults = function (resProducts) {
  productsSearchResultsEl.innerHTML = '';

  const resProductsLength = resProducts.length;
  for (let i = 0; i < resProductsLength; i++) {
    productsSearchResultsEl.innerHTML += `
        <li>
        <a href="${singleProductPage ? '../../' : ''}products/${
      resProducts[i].link
    }" class="search-overlay__results__list__product d-flex h-flex">
            <img
              class="search-overlay__results__list__product--img"
              src="${singleProductPage ? '../../' : ''}imgs/products/${
      resProducts[i].imageUrl
    }"
              alt="${altForImage(resProducts, i)}"
            />
            <p class="search-overlay__results__list__product--title">
              ${resProducts[i].name}
            </p>
            </a>
         </li>
    `;
  }
};

//
//
//
// Product Details Page Functionality

// Create Related Products for Following Category
const createRelatedProducts = function (fromStorage, relatedContainer) {
  relatedContainer.innerHTML = '';

  const getCategory = document
    .querySelector('.single-product__info--link')
    .textContent.split('/')[1]
    .toLowerCase()
    .trim()
    .split(' ')
    .join('-');

  const getCurrProductName = document
    .querySelector('.single-product__info--title')
    .textContent.toLowerCase()
    .trim();

  relatedFromHeadingEl.textContent =
    'from ' + getCategory.replace('-', ' ') + ' category';

  const relatedProducts = fromStorage.filter(
    product =>
      product.category.toLowerCase() === getCategory &&
      product.name.toLowerCase() !== getCurrProductName
  );

  const relatedProductsLength = relatedProducts.length;
  const numOfAvailableRelatedProducts =
    relatedProductsLength < 4 ? relatedProductsLength : 4;

  if (numOfAvailableRelatedProducts < 1)
    relatedProductsEl.style.display = 'none';

  for (let i = 0; i < numOfAvailableRelatedProducts; i++) {
    relatedContainer.innerHTML += `
  <div class="products__product" data-product-id="${relatedProducts[i].id}">
  <figure class="products__product--img" style='border: 1px solid #E4E5E6;'>
    <img
      src="../../imgs/products/${relatedProducts[i].imageUrl}"
      alt="${altForImage(fromStorage, i)}"
    />
  </figure>

  <div class="product-name-price-add">
    <div class="product-name-price">
      <p class="products__product--title product-name">
      ${relatedProducts[i].name}
      </p>
      <p class="products__product--price product-price">$${
        relatedProducts[i].price
      }</p>
    </div>
    <div class="product-name-price-add-info d-flex h-flex">
      <div
        class="products__product--add add-to-cart"
        data-product-id="${relatedProducts[i].id}"
      >
        <img
          src="../../imgs/icons/addtocart.svg"
          alt="add to cart button"
        />
      </div>
      <a class="product-link" href="../../products/${
        relatedProducts[i].link
      }" style='background-color: #fff;'>Details</a>
    </div>
  </div>
</div>
  `;
  }

  const addToCartEl = document.querySelectorAll('.add-to-cart');
  addToCart(addToCartEl);
  isBought(addToCartEl);
};
