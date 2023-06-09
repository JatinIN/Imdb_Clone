const movieSearchBox = document.querySelector('#movie-search-box'); //Input box
const searchList = document.querySelector('#search-list'); // Autocomplete box
const resultGrid = document.querySelector('#result-grid'); // Result container

 // Set default data to localstorage
if(!localStorage.getItem('favMovies')){
    let favMovies = [];
    localStorage.setItem('favMovies',JSON.stringify(favMovies));
}
 // Function to get movies from Omdb API
async function loadMovies(movieId) {                                           // movieId here is Movie Name.
    const URL = `https://www.omdbapi.com/?s=${movieId}&page=1&apikey=76ef9c9f`; //Base URL
    const res = await fetch(`${URL}`); //Fetch data from server
    const data = await res.json(); //Arrange data to readable format (JSON)
    // Check if everything is Okay
    if (data.Response == "True") {
        displayMovieList(data.Search); //then display the autocomplete box
    }
}

 //Find movies as you type any character
const findMovies = () => {
    let movieId = (movieSearchBox.value).trim(); // Get typed value and remove whitespace
    //Perform operation only if any character is present in the search box
    if (movieId.length > 0) {
        searchList.classList.remove('hide-search-list'); // show the autocomplete box
        loadMovies(movieId); //Load movies from API
    } else {
        searchList.classList.add('hide-search-list'); // Hide the autocomplete box if no character is present in the search box
    }
}

// Show the matched movies in the autocomplete box
const displayMovieList = (movies) => {
    searchList.innerHTML = ""; //clear the list of movies
    
    //Get all matching movies related to typed charactes
    for (let id = 0; id < movies.length; id++) {
        let movieListItem = document.createElement('div'); // Create a Div
        movieListItem.dataset.id = movies[id].imdbID; // Set Id to each movie result
        movieListItem.classList.add('search-list-item'); //Add CSS
        //Set poster image address
        if (movies[id].Poster != "N/A")
         {
            moviePoster = movies[id].Poster; // Set found image address
        } 
        else {
            moviePoster = "Assets/NO_Image.png"; //If image not found then set default image
        }
        //Add a matched result to list
        movieListItem.innerHTML = `
        <div class="search-item-thumbnail"> 
            <img src="${moviePoster}" alt="movie">
        </div>
        <div class="search-item-info">
            <h3>${movies[id].Title}</h3>
            <p>${movies[id].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem); //Add a matched movie to autocomplete list
    }
    loadMovieDetails(); //Load movie details
}

//Function For movie details From Omdb API 
const loadMovieDetails = () => {
    const searchListMovies = searchList.querySelectorAll('.search-list-item'); //Select all Matched movies
    //Add all matched movies to autmocomplete box
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list'); //Add CSS
            movieSearchBox.value = ""; //Reset search box

            // For Local Machine Run

            // localStorage.setItem('movieID',movie.dataset.id); // Set movie id to localstorage for later use
            // let dir = window.location.origin + "/MoviePage/moviePg.html"; // Custom URL for result page
            // window.location.href = "/MoviePage/moviePg.html"; //Redirect to a new page

            //For GitHub Run

            localStorage.setItem('movieID',movie.dataset.id); // Set movie id to localstorage for later use
            let dir = window.location.origin + "/MoviePage/moviePg.html"; // Custom URL for result page
            window.location.href = "https://jatinin.github.io/Imdb_Clone/MoviePage/moviePg.html"; //Redirect to a new page
        });
    });
}


// EventListners
window.addEventListener('click', (event) => {
    if(event.target.className != 'form-control'){
        searchList.classList.add('hide-search-list'); // Hide autocomplete box if user click anywhere other than autocomplete box
    }
})
movieSearchBox.addEventListener('keyup', findMovies);
movieSearchBox.addEventListener('click', findMovies);
