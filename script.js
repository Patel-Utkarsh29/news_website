// News API key and base URL for fetching news articles
const API_KEY = "f71e4a6f234c45958c4c73966f4c1657";
const BASE_URL = "https://newsapi.org/v2/everything?q=";

// Load news about NASA by default when the page is first loaded
window.addEventListener("load", () => fetchNews("NASA"));

// Function to reload the page
function reload() {
    window.location.reload();
}

// Function to fetch news based on a query (e.g., "NASA", "technology", etc.)
async function fetchNews(query) {
    try {
        // Fetch news data from the API
        const response = await fetch(`${BASE_URL}${query}&apiKey=${API_KEY}`);
        const data = await response.json();

        // Bind fetched data to the UI
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

// Function to bind the fetched news articles to the UI
function bindData(articles) {
    // Get the container where news cards will be displayed
    const cardsContainer = document.getElementById("cards-container");

    // Get the template for a single news card
    const newsCardTemplate = document.getElementById("template-news-card");

    // Clear out any existing news cards
    cardsContainer.innerHTML = "";

    // Iterate over each article and create a card if it has an image
    articles.forEach((article) => {
        if (!article.urlToImage) return; // Skip articles without an image

        // Clone the news card template
        const cardClone = newsCardTemplate.content.cloneNode(true);

        // Fill the cloned card with article data
        fillDataInCard(cardClone, article);

        // Add the filled card to the container
        cardsContainer.appendChild(cardClone);
    });
}

// Function to fill a news card with data from an article
function fillDataInCard(cardClone, article) {
    // Find elements in the cloned card
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    // Set the image, title, and description from the article
    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    // Format the publication date and set the source and date
    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });
    newsSource.innerHTML = `${article.source.name} · ${date}`;

    // Add an event listener to open the full article in a new tab when clicked
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Currently selected navigation item (null by default)
let curSelectedNav = null;

// Function to handle navigation item clicks
function onNavItemClick(id) {
    // Fetch news for the clicked navigation item
    fetchNews(id);

    // Find the clicked navigation item
    const navItem = document.getElementById(id);

    // Remove 'active' class from the previously selected item
    curSelectedNav?.classList.remove("active");

    // Set the clicked item as the currently selected one and add 'active' class
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

// Get the search button and search input field
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

// Add an event listener to the search button
searchButton.addEventListener("click", () => {
    // Get the search query from the input field
    const query = searchText.value;

    // If the search query is empty, do nothing
    if (!query) return;

    // Fetch news based on the search query
    fetchNews(query);

    // Remove 'active' class from the currently selected navigation item (if any)
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
