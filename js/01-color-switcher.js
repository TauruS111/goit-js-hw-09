const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const notification = document.getElementById('notification');

let page = 1;
const perPage = 40;

searchForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const searchQuery = e.target.searchQuery.value.trim();

  if (searchQuery === '') {
    return;
  }

  page = 1;
  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';

  const apiUrl = `https://pixabay.com/api/?key=YOUR_API_KEY&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.hits.length === 0) {
      showNotification('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    hideNotification();
    displayImages(data.hits);
    page++;
    loadMoreBtn.style.display = 'block';
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

loadMoreBtn.addEventListener('click', async function () {
  const searchQuery = searchForm.searchQuery.value.trim();
  const apiUrl = `https://pixabay.com/api/?key=YOUR_API_KEY&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.hits.length === 0) {
      showNotification("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.style.display = 'none';
      return;
    }

    displayImages(data.hits);
    page++;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

function displayImages(images) {
  images.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('photo-card');
    card.innerHTML = `
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    `;
    gallery.appendChild(card);
  });
}

function showNotification(message) {
  notification.textContent = message;
  notification.style.display = 'block';
}

function hideNotification() {
  notification.style.display = 'none';
}

