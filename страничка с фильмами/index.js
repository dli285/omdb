//Titles
//Details

const searchInput = document.querySelector(".search-input") 
const searchList = document.querySelector('.search-list')
const resultGrid = document.querySelector('.result-grid')
const favouriteButton = document.querySelector('.favourite-button')
const checkboxInput = document.querySelector('.checkbox-input')

//Colors
checkboxInput.addEventListener('change', function() {
    if (this.checked) {
        document.body.setAttribute('data-theme', 'bright');
        localStorage.setItem('theme', 'bright');
    } else {
        document.body.removeAttribute('data-theme');
        localStorage.removeItem('theme');
    }
});
window.addEventListener('DOMContentLoaded', function() {
    var theme = localStorage.getItem('theme');
    if (theme === 'bright') {
        checkboxInput.checked = true;
        document.body.setAttribute('data-theme', 'bright');
    }
});

//movies from API 
searchInput.addEventListener ("input", async (e) => { 
    const searchTerm = e.target.value; 
    const res = await fetch( 
      `http://www.omdbapi.com/?s=${searchTerm}&apikey=c93568ff` 
    ); 
    const data = await res.json();
    
    displayMovieList(data.Search)
});

function findMovies(){
    let searchTerm = (searchInput.value).trim()
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list')
        loadMovieDetails(searchTerm);
    } else {
        searchList.classList.add('hide-search-list')
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; //setting movie id in data-id
        movieListItem.classList.add('search-list-element')
             if (movies[idx].Poster != "N/A")
                moviePoster = movies[idx].Poster
            else
                moviePoster = "not_found.avif"

        movieListItem.innerHTML = `
        <div class= "search-list-element">
            <div class= "search-img">
                <img src= "${moviePoster}"> 
            </div>
            <div class= "search-info">
                <h3>${movies[idx].Title}</h3>
                <p>${movies[idx].Year}</p>
            </div> 
        </div>
            `
        searchList.appendChild(movieListItem)   
    }
    loadMovieDetails() 
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-element')
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list')
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=c93568ff`)
            const movieDetails = await result.json()
            displayMovieDetails(movieDetails)
        })
    })
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class="movie-title">
        <h3 class="movie-title">${details.Title}</h3>
    </div>
    <div class="movie-poster">
        <img src="${(details.Poster != "N/A") ? details.Poster : not_found.avif}" alt="">
    </div>
    <div class="movie-info">
        <ul class="movie-misc-info">
            <li class="year"><span class="li">Year:</span> ${details.Year}</li>
            <li class="ratings"><span class="li">Raitings:</span> ${details.Rated}</li>
            <li class="release-date"><span class="liэ">Release date:</span> ${details.Released}</li>
        </ul>
        <p class="genre"><b>Genre:</b> ${details.Genre}</p>
        <p class="writer"><b>Writers:</b> ${details.Writer}</p>
        <p class="actors"><b>Actors:</b> ${details.Actors}</p>
        <p class="plot"><b>Plot:</b> ${details.Plot}</p>
        <p class="language"><b>Language:</b> ${details.Language}</p>
        <p class="awards"><b>Awards:</b> ${details.Awards}</p>
    </div>    
    `
}


window.addEventListener('click', (event) => {
    if (event.target.className != "form-control") {
        searchList.classList.add('hide-search-list');
    }
})

function addToFavorites(imdbID) {
    const favorites = getFavorites();
    if (!favorites.includes(imdbID)) {
        favorites.push(imdbID);
        localStorage.setItem('favourite', JSON.stringify(favorites));
        alert('Фильм добавлен в избранное!');
    } else {
        alert('Фильм уже в избранном!');
    }
}
function getFavorites() {
    const favorites = localStorage.getItem('favourite-button');
    return favorites ? JSON.parse(favorites) : [];
}

localStorage.getItem