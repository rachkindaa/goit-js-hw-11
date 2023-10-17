import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40109023-9f0ba6a40e0af548120d66e03';
const perPage = 20;
let page = 1;
let searchQuery = '';

async function fetchImages() {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

function clearGallery() {
  gallery.innerHTML = '';
}

function displayImages(images) {
  const lightbox = new SimpleLightbox('.gallery a');
  images.hits.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('photo-card');
    card.innerHTML = `
            <a href="${image.largeImageURL}" class="gallery__item" data-lightbox="image">
                <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            </a>
            <div class="info">
                <p class="info-item"><b>Likes:</b> ${image.likes}</p>
                <p class="info-item"><b>Views:</b> ${image.views}</p>
                <p class="info-item"><b>Comments:</b> ${image.comments}</p>
                <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
            </div>
        `;
    gallery.appendChild(card);
  });
  lightbox.refresh();
}

async function loadMoreImages() {
  page++;
  const images = await fetchImages();
  if (images.hits.length > 0) {
    displayImages(images);
  } else {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  page = 1;
  searchQuery = e.target.elements.searchQuery.value;
  if (searchQuery.trim() === '') {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }
  clearGallery();
  const images = await fetchImages();
  if (images.hits.length > 0) {
    displayImages(images);
    loadMoreBtn.style.display = 'block';
    Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMoreBtn.style.display = 'none';
  }
});

loadMoreBtn.addEventListener('click', loadMoreImages);