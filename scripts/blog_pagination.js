'use strict';

const postTitlesAndImages = [
  {
    title: 'The 17 best damn fathers day gifts for 2022',
    imageUrl: 'post-1.jpg'
  },
  {
    title: 'Mans Grooming and Daily Skin Care Tips',
    imageUrl: 'post-1.jpg'
  },
  {
    title:
      'A great start to your day begins with a warm shower, shaving and grooming.',
    imageUrl: 'post-1.jpg'
  },
  {
    title: 'This is a sample title for this post 4',
    imageUrl: 'post-1.jpg'
  },
  {
    title: 'This is a sample title for this post 5',
    imageUrl: 'post-1.jpg'
  },
  {
    title: 'This is a sample title for this post 6',
    imageUrl: 'post-1.jpg'
  },
  {
    title: 'This is a sample title for this post 7',
    imageUrl: 'post-1.jpg'
  },
  {
    title: 'This is a sample title for this post 8',
    imageUrl: 'post-1.jpg'
  },
  {
    title: 'This is a sample title for this post 9',
    imageUrl: 'post-1.jpg'
  },
  {
    title: 'This is a sample title for this post 10',
    imageUrl: 'post-1.jpg'
  },
  {
    title: 'This is a sample title for this post 11',
    imageUrl: 'post-1.jpg'
  },
  {
    title: 'This is a sample title for this post 12',
    imageUrl: 'post-1.jpg'
  },
  {
    title: 'This is a sample title for this post 13',
    imageUrl: 'post-1.jpg'
  },
  {
    title: 'This is a sample title for this post 14',
    imageUrl: 'post-1.jpg'
  },
  {
    title: 'This is a sample title for this post 15',
    imageUrl: 'post-1.jpg'
  },
  {
    title: 'This is a sample title for this post 16',
    imageUrl: 'post-1.jpg'
  }
];

const blogContainerEl = document.querySelector('.blog__container');
const paginationContainerEl = document.querySelector('.blog__pagination');
const paginationContainerPagesEl = document.querySelector(
  '.blog__pagination__pages'
);

const prevPostBtn = document.querySelector('.blog__pagination--left');
const nextPostBtn = document.querySelector('.blog__pagination--right');

let initPage = 1;
const visiblePosts = 6;

// Show Visible Posts
// initPage, visiblePosts, postTitlesAndImages, blogContainerEl
const displayPosts = function (currPage, vPosts, allPosts, postsContainer) {
  postsContainer.innerHTML = '';
  currPage--;

  // Show and hide next and previous button
  initPage < 2
    ? (prevPostBtn.style.display = 'none')
    : (prevPostBtn.style.display = 'block');

  initPage >= calcPages()
    ? (nextPostBtn.style.display = 'none')
    : (nextPostBtn.style.display = 'block');

  // Scroll to the top of the blog after each interaction with pagination
  window.scrollTo({
    top: 0,
    left: 100,
    behavior: 'instant'
  });

  // Take number of visible posts from the all posts
  const firstPost = currPage * vPosts;
  const lastPost = firstPost + vPosts;
  const sliceVisiblePosts = allPosts.slice(firstPost, lastPost);

  // Create visible posts
  for (let i = 0; i < sliceVisiblePosts.length; i++) {
    postsContainer.innerHTML += `
        <div class="blog__container__post">
        <a href="#">
          <img
            src="imgs/blog/post-1.jpg"
            class="blog__container__post--image"
            alt="post image"
          />
          <div class="blog__container__post__title-and-link">
            <h4 class="blog__container__post__title-and-link--title">
              ${sliceVisiblePosts[i].title}
            </h4>
            <span class="blog__container__post__title-and-link--link"
              >read more <img src="imgs/icons/arrow-accent.svg" alt="arrow"
            /></span>
          </div>
        </a>
      </div>
    `;
  }
};

// Show Pagination Functionality
const showPagination = function (
  paginationContainer,
  paginationPages,
  allPosts
) {
  if (allPosts.length < visiblePosts) return;
  paginationContainer.style.display = 'flex';
  paginationPages.innerHTML = '';

  // Create pagination numbers
  for (let i = 1; i < calcPages() + 1; i++) {
    paginationPages.innerHTML += `
    <li class="blog__pagination__pages--page">${i}</li>
    `;
  }

  // Create functionality
  const page = document.querySelectorAll('.blog__pagination__pages--page');

  page.forEach(p => {
    if (initPage === +p.innerText) p.classList.add('active');

    p.addEventListener('click', e => {
      const currPaginationEl = e.target;
      const activePageEl = document.querySelectorAll(
        '.blog__pagination__pages--page.active'
      );

      activePageEl.forEach(el => el.classList.remove('active'));
      currPaginationEl.classList.add('active');

      initPage = +currPaginationEl.innerText;

      displayPosts(
        +currPaginationEl.innerText,
        visiblePosts,
        postTitlesAndImages,
        blogContainerEl
      );
    });
  });
};

// Calculate number of pages
const calcPages = () => Math.ceil(postTitlesAndImages.length / visiblePosts);

// Next post button
const nextPost = function () {
  initPage++;

  displayPosts(initPage, visiblePosts, postTitlesAndImages, blogContainerEl);
  showPagination(
    paginationContainerEl,
    paginationContainerPagesEl,
    postTitlesAndImages
  );
};

// Previous post button
const prevPost = function () {
  initPage--;

  displayPosts(initPage, visiblePosts, postTitlesAndImages, blogContainerEl);
  showPagination(
    paginationContainerEl,
    paginationContainerPagesEl,
    postTitlesAndImages
  );
};

displayPosts(initPage, visiblePosts, postTitlesAndImages, blogContainerEl);
showPagination(
  paginationContainerEl,
  paginationContainerPagesEl,
  postTitlesAndImages
);

nextPostBtn.addEventListener('click', nextPost);
prevPostBtn.addEventListener('click', prevPost);
