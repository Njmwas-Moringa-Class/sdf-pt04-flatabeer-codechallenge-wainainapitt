// Define constants
const beerList = document.getElementById('beer-list');
const beerName = document.getElementById('beer-name');
const beerImage = document.getElementById('beer-image');
const beerDescription = document.getElementById('beer-description');
const descriptionForm = document.getElementById('description-form');
const descriptionTextarea = document.getElementById('description');
const reviewList = document.getElementById('review-list');
const reviewForm = document.getElementById('review-form');
const reviewTextarea = document.getElementById('review');

// API base URL

const baseUrl = 'http://localhost:3000';

// Function to fetch beer details by ID

function fetchBeerDetails(beerId) {
  fetch(`${baseUrl}/beers/${beerId}`)
    .then(response => response.json())
    .then(data => {

      // Update the UI with beer details

      beerName.textContent = data.name;
      beerImage.src = data.image_url;
      beerDescription.textContent = data.description;

      // Clear the description form

      descriptionTextarea.value = '';

      // Update the review list
      updateReviewList(data.reviews);
    })
    .catch(error => console.error('Error fetching beer details:', error));
}

// Function to update the review list

function updateReviewList(reviews) {
  // Clear the existing reviews

  reviewList.innerHTML = '';

  // Create list items for each review and add them to the review list

  reviews.forEach(review => {
    const listItem = document.createElement('li');
    listItem.textContent = review;
    reviewList.appendChild(listItem);
  });
}

// Function to fetch the list of beers and update the navigation barc

function fetchBeerList() {
  fetch(`${baseUrl}/beers`)
    .then(response => response.json())
    .then(data => {

      // Clear the existing beer list

      beerList.innerHTML = '';

      // Create list items for each beer and add them to the beer list

      data.forEach(beer => {
        const listItem = document.createElement('li');
        listItem.textContent = beer.name;

        // Add an event listener to load the details of the selected beer

        listItem.addEventListener('click', () => fetchBeerDetails(beer.id));
        beerList.appendChild(listItem);
      });
    })
    .catch(error => console.error('Error fetching beer list:', error));
}

// Function to add a review and save it on the server

function addReviewAndSave(review) {
  // Get the current beer ID 

  const beerId = 1;

  // Get the current list of reviews

  const currentReviews = Array.from(reviewList.children).map(li => li.textContent);

  // Combine the new review with the existing reviews

  const updatedReviews = [review, ...currentReviews];


  fetch(`${baseUrl}/beers/${beerId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviews: updatedReviews }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Review added on the server:', data);

      // Update the UI with the saved review data

      updateReviewList(data.reviews);
    })
    .catch(error => console.error('Error updating review on the server:', error));
}

// Function to update the beer's description and save it on the server

function updateDescriptionAndSave(newDescription) {

  // Get the current beer ID 

  const beerId = 1; 

  
  fetch(`${baseUrl}/beers/${beerId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description: newDescription }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Description updated on the server:', data);

      // Update the UI with the saved description data

      beerDescription.textContent = data.description;
    })
    .catch(error => console.error('Error updating description on the server:', error));
}

// Event listener for the description form submission

descriptionForm.addEventListener('submit', event => {
  event.preventDefault();
  const newDescription = descriptionTextarea.value;
  updateDescriptionAndSave(newDescription);
});

// Event listener for the review form submission

reviewForm.addEventListener('submit', event => {
  event.preventDefault();
  const newReview = reviewTextarea.value;
  addReviewAndSave(newReview);
});

// Initial fetch to load the first beer's details and beer list
fetchBeerDetails(1); 
fetchBeerList();
// wonderful project