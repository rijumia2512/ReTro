// Function to Loading Spinner
const toggleLoadingSpinner = (isLoading) => {
  const loadingSpinner = document.getElementById('loader');
  if (isLoading) {
      loadingSpinner.classList.remove('hidden');
  } else {
      setTimeout(() => {
          loadingSpinner.classList.add('hidden');
      }, 2000);
  }
};

// Function to load discussion data from API
const loadDiscussionData = (category = '') => {
  toggleLoadingSpinner(true);

  fetch(`https://openapi.programming-hero.com/api/retro-forum/posts${category ? `?category=${category}` : ''}`)
      .then(res => res.json())
      .then((data) => {
          const cardContainer = document.getElementById('card-container');
          cardContainer.textContent = '';

          data.posts.forEach(post => {
              const div = document.createElement('div');
              div.classList.add('mt-5', 'card', 'card-side', 'bg-base-100', 'shadow-xl');

              div.innerHTML = generatePostHTML(post);
              cardContainer.appendChild(div);
          });
      })
      .catch(error => {
          console.error('Error loading discussion data:', error);
      })
      .finally(() => {
          toggleLoadingSpinner(false);
      });
};

// Function to generate HTML for each post
const generatePostHTML = (post) => {
  const { isActive, image, category, author, title, description, comment_count, view_count, posted_time } = post;
  // console.log('Image URL:', image);
  return `
      <div>
          <div class="avatar ${isActive ? 'online' : 'offline'} placeholder">
              <div class="bg-gray-500 text-gray-content rounded-xl w-16">
                  <img src='${image}'/>
              </div>
          </div>
      </div>
      <div class="card-body">
          <div class='flex'>
              <p># ${category}</p>
              <p>Author: ${author?.name}</p>
          </div>
          <h2 class="card-title">${title}</h2>
          <p>${description}</p>
          <div class=" border-t border-dotted border-base-400"></div>
          <div class='flex justify-between items-center'>
              <div class='flex justify-evenly'>
                  <div class='flex justify-center items-center'>
                      <i class="fa-regular fa-comment-dots"></i>
                      <p class='ms-1'>${comment_count}</p>
                  </div>
                  <div class='ms-3 flex justify-center items-center'>
                      <i class="fa-regular fa-eye"></i>
                      <p class='ms-1'>${view_count}</p>
                  </div>
                  <div class='ms-3 flex justify-center items-center'>
                      <i class="fa-regular fa-clock"></i>
                      <p class='ms-1'>${posted_time} min</p>
                  </div>
              </div>
              <div class="card-actions justify-end">
                  <button onClick="handleGetPostData('${title}', ${view_count})" class="btn bg-[#10B981] text-white rounded-full"><i class="fa-regular fa-envelope-open"></i></button>
              </div>
          </div>
      </div>`;
};

// Function to handle retrieving post data
const handleGetPostData = (title, view) => {
  console.log(title, view);
  const container = document.getElementById('container');
  const div = document.createElement('div');

  const counter = document.getElementById('count-mes');
  counter.innerText = `${++count}`;

  div.classList.add('flex', 'justify-center', 'items-center', 'p-5', 'bg-[#f8f9fa]', 'shadow-lg','mb-2','rounded-lg');
  div.innerHTML = `
      <h1 class="text-[15px] font-[800]">${title}</h1>
      <div class='md:ms-48 flex justify-center items-center'>
          <i class="fa-regular fa-eye"></i>
          <p class='ms-1 text-[16px]'>${view}</p>
      </div>`;
  container.appendChild(div);
};

// Event listener for search button
document.getElementById('searchBtn').addEventListener('click', (e) => {
  e.preventDefault();
  const searchField = document.getElementById('input-filed').value;
  loadDiscussionData(searchField);
});

// Load latest data on page load
const loadLatestData = () => {
  fetch(`https://openapi.programming-hero.com/api/retro-forum/latest-posts`)
      .then(res => res.json())
      .then(displayLatestData)
      .catch(error => {
          console.error('Error loading latest data:', error);
      });
};

// Display data
const displayLatestData = (news) => {
  const newsContainer = document.getElementById('newsContainer');
  news.forEach(newsItem => {
      const div = document.createElement('div');
      div.classList.add('card', 'card-compact', 'w-96', 'bg-base-100', 'shadow-xl');

      // 'No publish date'
      const postedDate = newsItem.author.posted_date ? newsItem.author.posted_date : 'No publish date';

      div.innerHTML = `
          <figure><img src="${newsItem.cover_image}" alt="" /></figure>
          <div class="card-body">
              <p class='text-[#12132D99]'><i class="fa-regular fa-calendar me-1"></i>${postedDate}</p>
              <h2 class="card-title text-[#12132D]">${newsItem.title}</h2>
              <p>${newsItem.description}</p>
              <div class="card-actions flex justify-start">
                  <div class="avatar">
                      <div class="rounded-full w-12">
                          <img src="${newsItem.profile_image}"/>
                      </div>
                  </div>
                  <div>
                      <p class='font-bold'>${newsItem.author.name}</p>
                      <p>${newsItem.author?.designation || 'Unknown'}</p>
                  </div>
              </div>
          </div>`;
      newsContainer.appendChild(div);
  });
};


let count = 0;
loadDiscussionData();
loadLatestData();
