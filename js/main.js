let isLocalEnv = false;
var availableLanguage = [];
const castGender = ["Not Set", "Female", "Male", "Non Binary"];

var currentPageUpcoming = 1;
var currentPageTopRated = 1;
var currentPagePopular = 1;
var currentPageNowPlaying = 1;
var currentPageSearch = 1;
var currentPageGenreSearch= 1;
var tv_currentPageNowPlaying = 1;
var tv_currentPagePopular = 1;
var tv_currentPageTopRated = 1;

document.addEventListener("DOMContentLoaded", function () {
	const baseUrl = window.location.origin;
	isLocalEnv = !baseUrl.includes("vercel.app");
});

$(document).ready(function(){
	runAllLanguageProvided()
	runMovieTrendingTodayList()
	runTvTrendingTodayList()
	runMovieGenreList()
	runTvGenreList()

	$(document).on("click", "#today-trending-movie", function () {
		window.location.href = getBaseUrl() + "#now-playing";
	});

	$(document).on("click", "#today-trending-tv", function () {
		window.location.href = getBaseUrl() + "#tv-main";
	});

	runUpcomingList(currentPageUpcoming);

	$(document).on("click", "#btn-load-more-upcoming", function () {
		currentPageUpcoming += 1;
		runUpcomingList(currentPageUpcoming);
	});

	runTopRatedList(currentPageTopRated);

	$(document).on("click", "#btn-load-more-top-rated", function () {
		currentPageTopRated += 1;
		runTopRatedList(currentPageTopRated);
	});
	
	runPopularList(currentPagePopular);

	$(document).on("click", "#btn-load-more-popular", function () {
		currentPagePopular += 1;
		runPopularList(currentPagePopular);
	});

	runNowPlayingList(currentPageNowPlaying);

	$(document).on("click", "#btn-load-more-main", function () {
		currentPageNowPlaying += 1;
		runNowPlayingList(currentPageNowPlaying);
	});


	runTvShowNowPlayingList(tv_currentPageNowPlaying);

	$(document).on("click", "#btn-load-more-tv-main", function () {
		tv_currentPageNowPlaying += 1;
		runTvShowNowPlayingList(tv_currentPageNowPlaying);
	});

	runTvShowPopularList(tv_currentPagePopular);

	$(document).on("click", "#btn-load-more-tv-popular", function () {
		tv_currentPagePopular += 1;
		runTvShowPopularList(tv_currentPagePopular);
	});

	runTvShowTopRatedList(tv_currentPageTopRated);

	$(document).on("click", "#btn-load-more-tv-top-rated", function () {
		tv_currentPageTopRated += 1;
		runTvShowTopRatedList(tv_currentPageTopRated);
	});

	$(document).on("click", ".btn-search", function () {
		const keyword = $("#et-search").val();
		currentPageSearch = 1;
		$("#movieListSearch").html('');

		if (keyword != "") {
			runSearchList(currentPageSearch, keyword)
		} else {
			alert("keyword cannot be empty!")
		}
	});

	$(document).on("click", "#btn-load-more-search", function () {
		const keyword = $("#et-search").val();
		currentPageSearch += 1;

		if (keyword != "") {
			runSearchList(currentPageSearch, keyword)
		} else {
			alert("keyword cannot be empty!")
		}
	});

	// HYPERLINK CAST AND DETAIL

	$(document).on("click", "#externalLink", function () {
		var currentActiveDetailId = $(this).data("slug");
		var currentActiveDetailDisplayType = $(this).data("ref");
		var externalOpenNewTabUrl = getExternalDetailPageUrl(currentActiveDetailDisplayType, currentActiveDetailId);

		window.open(externalOpenNewTabUrl, "_blank");
	});

	$(document).on("click", "#externalLinkCast", function () {
		var currentActiveDetailId = $(this).data("slug");
		var currentActiveDetailDisplayType = $(this).data("ref");
		var externalOpenNewTabUrl = getExternalDetailPageUrl(currentActiveDetailDisplayType, currentActiveDetailId);

		window.open(externalOpenNewTabUrl, "_blank");
	});

	// MOVIE AND TV SHOW DETAIL PART

	$(document).on("click", ".list-tv-movie", function () {
		var currentActiveDetailId = $(this).data("slug");
		var currentActiveDetailDisplayType = $(this).data("ref");

		if (currentActiveDetailDisplayType == "tv") {
			runDetailTvShowData(currentActiveDetailId)
		} else if (currentActiveDetailDisplayType == "movie") {
			runDetailMovieData(currentActiveDetailId);
		}
	});

	// CAST DETAIL PART

	$(document).on("click", ".list-cast", function () {
		var currentActiveDetailId = $(this).data("slug");
		var currentActiveDetailDisplayType = $(this).data("ref");
		
		runDetailCastData(currentActiveDetailId);
	});
});

async function runAllLanguageProvided() {
	const apikey = await decryptString(ciphertext, iv, password);
	
	$.getJSON("https://api.themoviedb.org/3/configuration/languages?api_key="+apikey, function(data){
		availableLanguage = data;
	});
}

async function runMovieTrendingTodayList() {
	const apikey = await decryptString(ciphertext, iv, password);
	
	$.getJSON("https://api.themoviedb.org/3/trending/movie/day?api_key="+apikey, function(data){
		$.each(data.results, function(){	
			const posterList = document.getElementById("item-movie-trending-today");
			posterList.innerHTML = "";

			const randomFive = data.results
					.sort(() => Math.random() - 0.5)
					.slice(0, 5);

			randomFive.forEach(data => {
				const imageUrl = data.poster_path == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
						: baseImageLoad + data.poster_path;
				
				const li = document.createElement("li");
				li.className = "flex-none w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5";

				const img = document.createElement("img");
					img.src = imageUrl;
					img.alt = `${data.poster_path} Logo`;
					img.className = "rounded-lg shadow-md w-full h-auto object-cover";
					li.appendChild(img);

				posterList.appendChild(li);
			});
		});
	});
}

async function runTvTrendingTodayList() {
	const apikey = await decryptString(ciphertext, iv, password);

	$.getJSON("https://api.themoviedb.org/3/trending/tv/day?api_key="+apikey, function(data){
		$.each(data.results, function(){	
			const posterList = document.getElementById("item-tv-trending-today");
			posterList.innerHTML = "";

			const randomFive = data.results
					.sort(() => Math.random() - 0.5)
					.slice(0, 5);

			randomFive.forEach(data => {
				const imageUrl = data.poster_path == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
						: baseImageLoad + data.poster_path;
				
				const li = document.createElement("li");
				li.className = "flex-none w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5";

				const img = document.createElement("img");
					img.src = imageUrl;
					img.alt = `${data.poster_path} Logo`;
					img.className = "rounded-lg shadow-md w-full h-auto object-cover";
					li.appendChild(img);

				posterList.appendChild(li);
			});
		});
	});
}

async function runUpcomingList(currentPage) {
	const apikey = await decryptString(ciphertext, iv, password);
	
	$.getJSON("https://api.themoviedb.org/3/movie/upcoming?page="+currentPage+"&api_key="+apikey+"&include_adult=true", function(data){
		if (data.results.length < 1 && currentPage < 2) {
			$("#movieListUpcoming").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#movieListUpcoming").append("<li class='flex justify-center'>Data not found</li>");
		}

		$("#movieListUpcoming").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");

		$.each(data.results, function(index, item){
			createItemElementMovieTvShow("movieListUpcoming", item, "movie");
		});

		if (data.results.length > 0) {
			const loadMoreSection = document.getElementById('load-more-section-upcoming');
			loadMoreSection.classList.remove('hidden');
		} else {
			const loadMoreSection = document.getElementById('load-more-section-upcoming');
			loadMoreSection.classList.add('hidden');
		}
	});
}

async function runTopRatedList(currentPage) {
	const apikey = await decryptString(ciphertext, iv, password);
	
	$.getJSON("https://api.themoviedb.org/3/movie/top_rated?page="+currentPage+"&api_key="+apikey+"&include_adult=true", function(data){
		if (data.results.length < 1 && currentPage < 2) {
			$("#movieListTopRated").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#movieListTopRated").append("<li class='flex justify-center'>Data not found</li>");
		}
		$("#movieListTopRated").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");

		$.each(data.results, function(index, item){
			createItemElementMovieTvShow("movieListTopRated", item, "movie");
		});

		if (data.results.length > 0) {
			const loadMoreSection = document.getElementById('load-more-section-top-rated');
			loadMoreSection.classList.remove('hidden');
		} else {
			const loadMoreSection = document.getElementById('load-more-section-top-rated');
			loadMoreSection.classList.add('hidden');
		}
	});
}

async function runPopularList(currentPage) {
	const apikey = await decryptString(ciphertext, iv, password);
	
	$.getJSON("https://api.themoviedb.org/3/movie/popular?page="+currentPage+"&api_key="+apikey+"&include_adult=true", function(data){
		if (data.results.length < 1 && currentPage < 2) {
			$("#movieListPopular").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#movieListPopular").append("<li class='flex justify-center'>Data not found</li>");
		}
		$("#movieListPopular").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");

		$.each(data.results, function(index, item){
			createItemElementMovieTvShow("movieListPopular", item, "movie");
		});

		if (data.results.length > 0) {
			const loadMoreSection = document.getElementById('load-more-section-popular');
			loadMoreSection.classList.remove('hidden');
		} else {
			const loadMoreSection = document.getElementById('load-more-section-popular');
			loadMoreSection.classList.add('hidden');
		}
	});
}

async function runNowPlayingList(currentPage) {
	const apikey = await decryptString(ciphertext, iv, password);
	
	$.getJSON("https://api.themoviedb.org/3/movie/now_playing?page="+currentPage+"&api_key="+apikey+"&include_adult=true", function(data){
		if (data.results.length < 1 && currentPage < 2) {
			$("#movieListNowPlaying").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#movieListNowPlaying").append("<li class='flex justify-center'>Data not found</li>");
		}
		$("#movieListNowPlaying").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");

		$.each(data.results, function(index, item) {
			createItemElementMovieTvShow("movieListNowPlaying", item, "movie");
		});

		if (data.results.length > 0) {
			const loadMoreSection = document.getElementById('load-more-section-main');
			loadMoreSection.classList.remove('hidden');
		} else {
			const loadMoreSection = document.getElementById('load-more-section-main');
			loadMoreSection.classList.add('hidden');
		}
	});
}

async function runTvShowNowPlayingList(currentPage) {
	const apikey = await decryptString(ciphertext, iv, password);
	
	$.getJSON("https://api.themoviedb.org/3/tv/airing_today?page="+currentPage+"&api_key="+apikey+"&include_adult=true", function(data){
		if (data.results.length < 1 && currentPage < 2) {
			$("#tvListNowPlaying").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#tvListNowPlaying").append("<li class='flex justify-center'>Data not found</li>");
		}
		$("#tvListNowPlaying").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");

		$.each(data.results, function(index, item){	
			createItemElementMovieTvShow("tvListNowPlaying", item, "tv");
		});

		if (data.results.length > 0) {
			const loadMoreSection = document.getElementById('load-more-section-tv-main');
			loadMoreSection.classList.remove('hidden');
		} else {
			const loadMoreSection = document.getElementById('load-more-section-tv-main');
			loadMoreSection.classList.add('hidden');
		}
	});
}

async function runTvShowPopularList(currentPage) {
	const apikey = await decryptString(ciphertext, iv, password);
	
	$.getJSON("https://api.themoviedb.org/3/tv/popular?page="+currentPage+"&api_key="+apikey+"&include_adult=true", function(data){
		if (data.results.length < 1 && currentPage < 2) {
			$("#tvListPopular").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#tvListPopular").append("<li class='flex justify-center'>Data not found</li>");
		}
		$("#tvListPopular").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");

		$.each(data.results, function(index, item){		
			createItemElementMovieTvShow("tvListPopular", item, "tv");
		});

		if (data.results.length > 0) {
			const loadMoreSection = document.getElementById('load-more-section-tv-popular');
			loadMoreSection.classList.remove('hidden');
		} else {
			const loadMoreSection = document.getElementById('load-more-section-tv-popular');
			loadMoreSection.classList.add('hidden');
		}
	});
}

async function runTvShowTopRatedList(currentPage) {
	const apikey = await decryptString(ciphertext, iv, password);
	
	$.getJSON("https://api.themoviedb.org/3/tv/top_rated?page="+currentPage+"&api_key="+apikey+"&include_adult=true", function(data){
		if (data.results.length < 1 && currentPage < 2) {
			$("#tvListTopRated").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#tvListTopRated").append("<li class='flex justify-center'>Data not found</li>");
		}
		$("#tvListTopRated").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
		
		$.each(data.results, function(index, item){	
			createItemElementMovieTvShow("tvListTopRated", item, "tv");
		});

		if (data.results.length > 0) {
			const loadMoreSection = document.getElementById('load-more-section-tv-top-rated');
			loadMoreSection.classList.remove('hidden');
		} else {
			const loadMoreSection = document.getElementById('load-more-section-tv-top-rated');
			loadMoreSection.classList.add('hidden');
		}
	});
}

async function runSearchList(currentPage, keyword) {
	const apikey = await decryptString(ciphertext, iv, password);

	// make 2 type of api run synchronously
	
	let totalMovieFound = [];
	let totalTvFound = [];
	let isMovieNotFound = false
	let isTvNotFound = false

	const movieUrl = `https://api.themoviedb.org/3/search/movie?page=${currentPage}&query=${keyword}&api_key=${apikey}&include_adult=true`;
	const tvUrl = `https://api.themoviedb.org/3/search/tv?page=${currentPage}&query=${keyword}&api_key=${apikey}&include_adult=true`;

	// Fetch movies
	const movieResponse = await fetch(movieUrl);
	const movieData = await movieResponse.json();

	// Fetch TV
	const tvResponse = await fetch(tvUrl);
	const tvData = await tvResponse.json();

	totalMovieFound = movieData.results;

	if (movieData.results.length < 1 && currentPage < 2) {
		isMovieNotFound = true;
	}

	totalTvFound = tvData.results;

	if (tvData.results.length < 1 && currentPage < 2) {
		isTvNotFound = true;
	}

	$("#movieListSearch").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");

	movieData.results.forEach(item => {
		createItemElementMovieTvShow("movieListSearch",item, "movie");
	});

	tvData.results.forEach(item => {
		createItemElementMovieTvShow("movieListSearch", item, "tv");
	});

	if (isTvNotFound && isMovieNotFound) {
		$("#movieListSearch").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
		$("#movieListSearch").append("<li class='flex justify-center'>Data not found</li>");
	}

	if (totalMovieFound.length > 0 || totalTvFound.length > 0) {
		const loadMoreSection = document.getElementById('load-more-section-search');
		loadMoreSection.classList.remove('hidden');
	} else {
		const loadMoreSection = document.getElementById('load-more-section-search');
		loadMoreSection.classList.add('hidden');
	}
}

var currentMovieGenreId = ""
var currentTvGenreId = ""
let movieGenre = [];
let tvGenre = [];

async function runMovieGenreList() {
	const apikey = await decryptString(ciphertext, iv, password);
	
	$.getJSON('https://api.themoviedb.org/3/genre/movie/list?api_key='+apikey, function(data) {
		movieGenre = data.genres;
		populateItemGenre();
	});

	$("#movieGenreList").on("click", "li", function () {
		currentPageGenreSearch = 1;
		$("#GenreListSearch").html("");
		
		const index = $(this).index(); // Get the index of clicked <li>
		if (movieGenre[index]) {
			currentMovieGenreId = movieGenre[index].id;
			currentTvGenreId = "";
			populateItemGenre();

			$.getJSON('https://api.themoviedb.org/3/discover/movie?api_key='+apikey+'&with_genres='+movieGenre[index].id, function(data) {
				$.each(data.results, function(index, item){
					createItemElementMovieTvShow("GenreListSearch", item, "movie");
				});
				$("#GenreListSearch").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");

				if (data.results.length < 1 && currentPage < 2) {
					$("#GenreListSearch").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
					$("#GenreListSearch").append("<li class='flex justify-center'>Data not found</li>");
				}

				if (data.results.length > 0) {
					const section = document.getElementById('load-more-section-genre-list');
					section.classList.remove('hidden');
				} else {
					const section = document.getElementById('load-more-section-genre-list');
					section.classList.add('hidden');
				}
			});
		}
	});

	$(document).on("click", "#btn-load-more-genre-list", function () {
		const index = $(this).index(); // Get the index of clicked <li>
		currentPageGenreSearch += 1;
		
		$.getJSON('https://api.themoviedb.org/3/discover/movie?api_key='+apikey+'&with_genres='+movieGenre[index].id, function(data) {	
			$.each(data.results, function(index, item){
				createItemElementMovieTvShow("GenreListSearch", item, "movie");
			});

			if (data.results.length > 0) {
				const section = document.getElementById('load-more-section-genre-list');
				section.classList.remove('hidden');
			} else {
				const section = document.getElementById('load-more-section-genre-list');
				section.classList.add('hidden');
			}
		});
	});

}

async function runTvGenreList() {
	const apikey = await decryptString(ciphertext, iv, password);
	
	$.getJSON('https://api.themoviedb.org/3/genre/tv/list?api_key='+apikey, function(data) {
		tvGenre = data.genres;
		populateItemGenre();
	});

	$("#tvGenreList").on("click", "li", function () {
		currentPageGenreSearch = 1;
		$("#GenreListSearch").html("");

		const index = $(this).index(); // Get the index of clicked <li>
		if (tvGenre[index]) {
			currentMovieGenreId = "";
			currentTvGenreId = tvGenre[index].id;
			populateItemGenre();

			$.getJSON('https://api.themoviedb.org/3/discover/tv?api_key='+apikey+'&with_genres='+tvGenre[index].id, function(data) {
				$.each(data.results, function(index, item){
					createItemElementMovieTvShow("GenreListSearch", item, "tv")
				});

				$("#GenreListSearch").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
				if (data.results.length < 1 && currentPage < 2) {
					$("#GenreListSearch").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
					$("#GenreListSearch").append("<li class='flex justify-center'>Data not found</li>");
				}

				if (data.results.length > 0) {
					const section = document.getElementById('load-more-section-genre-list');
					section.classList.remove('hidden');
				} else {
					const section = document.getElementById('load-more-section-genre-list');
					section.classList.add('hidden');
				}
			});
		}
	});

	$(document).on("click", "#btn-load-more-genre-list", function () {
		currentPageGenreSearch += 1;
		const index = $(this).index(); // Get the index of clicked <li>
		
		$.getJSON('https://api.themoviedb.org/3/discover/tv?api_key='+apikey+'&with_genres='+tvGenre[index].id, function(data) {	
			$.each(data.results, function(index, item){
				createItemElementMovieTvShow("GenreListSearch", item, "tv");
			});

			if (data.results.length > 0) {
				const section = document.getElementById('load-more-section-genre-list');
				section.classList.remove('hidden');
			} else {
				const section = document.getElementById('load-more-section-genre-list');
				section.classList.add('hidden');
			}
		});
	});
}

async function populateItemGenre() {
	const apikey = await decryptString(ciphertext, iv, password);
	
	$('#movieGenreList li').remove();
	$.each(movieGenre, function(){
		const li = document.createElement("li");

		if (currentMovieGenreId === this['id']) {
			li.className = "bg-gradient-to-b from-[#5e87b0] to-[#355f89] px-4 py-2 rounded-[30px] text-[#f8f8ff] no-text-shadow item-click-genre-active";
		} else {
			li.className = "bg-gradient-to-b from-[#5e87b0] to-[#355f89] px-4 py-2 rounded-[30px] text-[#f8f8ff] no-text-shadow item-click-genre";
		}

		li.setAttribute("data-genre-id", this['id']);
		li.textContent = this['name']

		const parentList = document.getElementById("movieGenreList");
		parentList.appendChild(li);
	});

	$('#tvGenreList li').remove();
	$.each(tvGenre, function(){
		const li = document.createElement("li");

		if (currentTvGenreId === this['id']) {
			li.className = "bg-gradient-to-b from-[#5e87b0] to-[#355f89] px-4 py-2 rounded-[30px] text-[#f8f8ff] no-text-shadow item-click-genre-active";
		} else {
			li.className = "bg-gradient-to-b from-[#5e87b0] to-[#355f89] px-4 py-2 rounded-[30px] text-[#f8f8ff] no-text-shadow item-click-genre";
		}

		li.setAttribute("data-genre-id", this['id']);
		li.textContent = this['name']

		const parentList = document.getElementById("tvGenreList");
		parentList.appendChild(li);
	});
}

function truncateLongTitle(title, maxLength) {
	if (title?.length <= maxLength) {
		return title;
	}
	return title?.substring(0, maxLength - 3) + '...';
}

function setGenresAndOverview(data) {
	// Set Overview
	document.getElementById("item-overview").textContent = data.overview.length < 1 ? "No overview is available" : data.overview;

	// Set Genres
	const genreContainer = document.getElementById("genre-tags");
	genreContainer.innerHTML = ""; // Clear old tags

	if (data.genres < 1) {
		const span = document.createElement("span");
		span.className = "px-4 py-1 bg-red-600 hover:bg-red-700 text-[#f8f8ff] font-medium rounded-full text-xs shadow transition-all";
		span.textContent = "Unknown genre";
		genreContainer.appendChild(span);
	} else {
		data.genres.forEach(genre => {
			const span = document.createElement("span");
			span.className = "px-4 py-1 bg-blue-600 hover:bg-blue-700 text-[#f8f8ff] font-medium rounded-full text-xs shadow transition-all";
			span.textContent = genre.name;
			genreContainer.appendChild(span);
		});
	}
}

function languageCode(languageCode) {
		const subs = "Sub"
		const entry = availableLanguage.find(lang => lang.iso_639_1 === languageCode);

		if (entry != null) {
			if (entry.name === "" || entry.name.toLowerCase() === entry.english_name) {
				return entry.english_name+" "+subs
			} else {
				return entry.english_name+" ("+entry.name+")"+" "+subs
			}
		} else {
			return "N/A"+" "+subs
		}
}

function countryCodeToFlagEmoji(countryCode) {
	return countryCode
		.toUpperCase()
		.replace(/./g, char =>
		String.fromCodePoint(127397 + char.charCodeAt())
	);
}

async function runDetailMovieData(movieId, isDisplayOnly = false) {	
	let backdropImages = [];

	var hrefCast = isDisplayOnly == true ? "#" : "#item-cast";
		
	$("#externalLink").attr("data-ref", "movie");
	$("#externalLink").attr("data-slug", movieId);

	$("#itemSimilarTitle").text("Similar movies you'd like");

	$("#item-images-alternate").on("click", "li", function () {
		const index = $(this).index(); // Get the index of clicked <li>
		if (backdropImages[index]) {
			const selectedPath = backdropImages[index].file_path;
			const imageUrl = selectedPath
			? baseImageLoad + selectedPath
			: "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg";

			$("#item-bg").attr("src", imageUrl);
		}
	});

	const apikey = await decryptString(ciphertext, iv, password);

	$.getJSON("https://api.themoviedb.org/3/movie/"+movieId+"/similar?api_key="+apikey+"&include_adult=true", function(data) {
		$("#itemListSimilar").html("");

		$("#itemListSimilar").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
		if (data.results.length < 1) {
			$("#itemListSimilar").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#itemListSimilar").append("<li><i>Similar movie not found</i></li>");
		}

		$.each(data.results, function(index, item) {
			createItemElementMovieTvShow("itemListSimilar", item, "movie");
		});
	});

	$.getJSON("https://api.themoviedb.org/3/movie/"+movieId+"/images?api_key="+apikey, function(data) {
		const posterList = document.getElementById("item-images-alternate");
			posterList.innerHTML = "";

			backdropImages = data.backdrops;
			data.backdrops.forEach((data, index) => {
				const imageUrl = data.file_path == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: baseImageLoad + data.file_path;

			const li = document.createElement("li");
			li.className = "flex-none w-40";
			li.setAttribute("data-movie-id", index);

			const img = document.createElement("img");
				img.src = imageUrl;
				img.alt = `${data.file_path} Logo`;
				img.className = "rounded-lg shadow-md w-full h-auto";
				li.appendChild(img);

			posterList.appendChild(li);
		});
	});

	$.getJSON("https://api.themoviedb.org/3/movie/"+movieId+"/videos?api_key="+apikey, function(data) {
		const youtubeVideoList = document.getElementById("item-videos");
		youtubeVideoList.innerHTML = "";
		
		if (data.results.length > 0) {
			const section = document.getElementById('section-videos');
			section.classList.remove('hidden');
		} else {
			const section = document.getElementById('section-videos');
			section.classList.add('hidden');
		}

		const takeOnly = data.results
					.sort()
					.slice(0, 6);

		takeOnly.forEach(data => {
			const card = document.createElement("li");
			card.className = "rounded-xl shadow-lg overflow-hidden";

			const iframe = document.createElement("iframe");
			iframe.className = "w-full h-64";
			iframe.src = "https://www.youtube.com/embed/"+data.key;
			iframe.title = data.name;
			iframe.allowFullscreen = true;
			iframe.setAttribute("frameborder", "0");
			iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");

			const content = document.createElement("div");
			content.className = "p-3";

			const title = document.createElement("div");
			title.className = "text-sm font-semibold mb-1";
			title.textContent = data.name;

			const episodes = document.createElement("div");
			episodes.className = "text-xs text-navy-400";
			episodes.textContent = `Available on ${data.site}`;

			content.appendChild(title);
			content.appendChild(episodes);

			card.appendChild(iframe);
			card.appendChild(content);

			youtubeVideoList.appendChild(card);
		});

	});

	$.getJSON("https://api.themoviedb.org/3/movie/"+movieId+"?api_key="+apikey+"&include_adult=true&append_to_response=credits", function(data) {
		setGenresAndOverview(data);

		const imageUrl = data.poster_path == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: baseImageLoad + data.poster_path;

		document.getElementById("item-title").textContent = data.title;
		document.getElementById("item-release").textContent = data.release_date;
		document.getElementById("item-rating").textContent = `${Number(data.vote_average.toFixed(1))}/10`;
		document.getElementById("item-poster").src = imageUrl;

		const backdropUrl = data.backdrop_path == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: baseImageLoad + data.backdrop_path;

		document.getElementById("item-bg").src = backdropUrl;
		document.getElementById("item-tagline").textContent = data.tagline || "No tagline available.";

		// production house
		const productionList = document.getElementById("item-production");
		productionList.innerHTML = "N/A";

		if (data.production_companies.length > 0) {
			productionList.innerHTML = "";
		}

		data.production_companies.forEach(company => {
			const li = document.createElement("li");
			li.className = "flex items-center gap-2 mb-2 bg-[#f8f8ff] rounded-lg px-4 py-2 shadow-sm";

			// Create logo image if available
			const imageUrl = company.logo_path == null
					? "https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg"
					: baseImageLoad + company.logo_path;

			const img = document.createElement("img");
				img.src = imageUrl;
				img.alt = `${company.name} Logo`;
				img.className = "w-10 h-auto object-contain";
				li.appendChild(img);

			// Company name
			const span = document.createElement("span");
			span.textContent = company.name;
			li.appendChild(span);

			productionList.appendChild(li);
		});

		// casts
		var allCasts = []

		$("#item-casts").html("N/A");

		if (data.credits.cast.length > 0) {
			$("#item-casts").html("");
		}
		$.each(data.credits.cast, function(index, cast) {
			allCasts = data.credits.cast;
		});

		if (allCasts.length > 6) {
			$("#load-more-cast").removeClass("hidden")
		} else {
			$("#load-more-cast").addClass("hidden")
		}

		const takeOnlyCast = allCasts
					.sort()
					.slice(0, 6);

		takeOnlyCast.forEach(cast => {
			createItemElementCast(cast, "cast", hrefCast);	
		});

		$(document).on("click", "#btn-load-more-cast", function () {
			$("#item-casts").html("");
			$("#load-more-cast").addClass("hidden")

			allCasts.forEach(cast => {
				createItemElementCast(cast, "cast", hrefCast);
			});
		});

		// country released
	
		let flagString = "";
		$.each(data.origin_country, function(index, countryCode) {
			flagString += countryCodeToFlagEmoji(countryCode) + " ";
		});
		document.getElementById("item-country-flag").textContent = flagString.trim();

		document.getElementById("item-total-episode").innerHTML = "";
		document.getElementById("item-total-season").innerHTML = "";

		$("#section-season").addClass("hidden");
		$("#section-revenue").removeClass("hidden");
		$("#item-season").html("");

		document.getElementById("item-revenue").textContent =
		data.revenue ? `$${data.revenue.toLocaleString()}` : "N/A";

		document.getElementById("item-languages").textContent =
		data.spoken_languages.map(lang => lang.english_name).join(", ") || "N/A";

		if (data?.adult) {
			document.getElementById("item-rating-age").textContent = "Unrated (17+)";
			document.getElementById("item-rating-age").className = "inline-block px-3 py-1 bg-red-600 text-[#f8f8ff] text-xs font-bold rounded-full";
		} else {
			document.getElementById("item-rating-age").textContent = "All Ages";
			document.getElementById("item-rating-age").className = "inline-block px-3 py-1 bg-green-600 text-[#f8f8ff] text-xs font-bold rounded-full";
		}
	});

	$.getJSON("https://api.themoviedb.org/3/movie/"+movieId+"/external_ids?api_key="+apikey, function(dataId) {
		if (dataId.imdb_id !== null) {
			$.getJSON("https://api.themoviedb.org/3/find/"+dataId.imdb_id+"?api_key="+apikey+"&external_source=imdb_id", function(data) {
				const imageUrl = data.movie_results[0].poster_path == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
						: baseImageLoad + data.movie_results[0].poster_path;

				document.getElementById("item-title").textContent = data.movie_results[0].title;
				document.getElementById("item-release").textContent = data.movie_results[0].release_date;
				document.getElementById("item-rating").textContent = `${Number(data.movie_results[0].vote_average.toFixed(1))}/10`;
				document.getElementById("item-poster").src = imageUrl;
				document.getElementById("item-bg").src = imageUrl;
			});
		}
	});
}

async function runDetailTvShowData(tvShowId, isDisplayOnly = false) {
	let backdropImages = [];

	var hrefCast = isDisplayOnly == true ? "#" : "#item-cast";

	$("#externalLink").attr("data-ref", "tv");
	$("#externalLink").attr("data-slug", tvShowId);

	$("#itemSimilarTitle").text("Similar TV show you'd like");

	$("#item-images-alternate").on("click", "li", function () {
		const index = $(this).index(); // Get the index of clicked <li>
		if (backdropImages[index]) {
			const selectedPath = backdropImages[index].file_path;
			const imageUrl = selectedPath
			? baseImageLoad + selectedPath
			: "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg";

			$("#item-bg").attr("src", imageUrl);
		}
	});

	const apikey = await decryptString(ciphertext, iv, password);
	
	$.getJSON("https://api.themoviedb.org/3/tv/"+tvShowId+"/images?api_key="+apikey, function(data) {
		const posterList = document.getElementById("item-images-alternate");
			posterList.innerHTML = "";

			backdropImages = data.backdrops;
			data.backdrops.forEach(data => {
				const imageUrl = data.file_path == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: baseImageLoad + data.file_path;

			const li = document.createElement("li");
			li.className = "flex-none w-40";

			const img = document.createElement("img");
				img.src = imageUrl;
				img.alt = `${data.file_path} Logo`;
				img.className = "rounded-lg shadow-md w-full h-auto";
				li.appendChild(img);

			posterList.appendChild(li);
		});
	});

	$.getJSON("https://api.themoviedb.org/3/tv/"+tvShowId+"/similar?api_key="+apikey+"&include_adult=true", function(data) {
		
		$("#itemListSimilar").html("");
		$("#itemListSimilar").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");

		if (data.results.length < 1) {
			$("#itemListSimilar").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#itemListSimilar").append("<li><i>Similar tv show not found</i></li>");
		}

		$.each(data.results, function(index, item){
			createItemElementMovieTvShow("itemListSimilar", item, "tv");
		});
	});

	$.getJSON("https://api.themoviedb.org/3/tv/"+tvShowId+"/videos?api_key="+apikey, function(data) {
		const youtubeVideoList = document.getElementById("item-videos");
		youtubeVideoList.innerHTML = "";
		
		if (data.results.length > 0) {
			const section = document.getElementById('section-videos');
			section.classList.remove('hidden');
		} else {
			const section = document.getElementById('section-videos');
			section.classList.add('hidden');
		}

		const takeOnly = data.results
					.sort()
					.slice(0, 6);

		takeOnly.forEach(data => {
			const card = document.createElement("li");
			card.className = "rounded-xl shadow-lg overflow-hidden";

			const iframe = document.createElement("iframe");
			iframe.className = "w-full h-64";
			iframe.src = "https://www.youtube.com/embed/"+data.key;
			iframe.title = data.name;
			iframe.allowFullscreen = true;
			iframe.setAttribute("frameborder", "0");
			iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");

			const content = document.createElement("div");
			content.className = "p-3";

			const title = document.createElement("div");
			title.className = "text-sm font-semibold mb-1";
			title.textContent = data.name;

			const episodes = document.createElement("div");
			episodes.className = "text-xs text-navy-400";
			episodes.textContent = `Available on ${data.site}`;

			content.appendChild(title);
			content.appendChild(episodes);

			card.appendChild(iframe);
			card.appendChild(content);

			youtubeVideoList.appendChild(card);
		});

	});

	$.getJSON("https://api.themoviedb.org/3/tv/"+tvShowId+"?api_key="+apikey+"&include_adult=true&append_to_response=credits", function(data) {
		setGenresAndOverview(data);

		const imageUrl = data.poster_path == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
						: baseImageLoad + data.poster_path;

		document.getElementById("item-title").textContent = data.name;
		document.getElementById("item-release").textContent = data.first_air_date;
		document.getElementById("item-rating").textContent = `${Number(data.vote_average.toFixed(1))}/10`;
		document.getElementById("item-poster").src = imageUrl;

		const backdropUrl = data.backdrop_path == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: baseImageLoad + data.backdrop_path;

		document.getElementById("item-bg").src = backdropUrl;
		document.getElementById("item-tagline").textContent = data.tagline || "No tagline available.";

		// production house
		const productionList = document.getElementById("item-production");
		productionList.innerHTML = "N/A";

		if (data.production_companies.length > 0) {
			productionList.innerHTML = "";
		}

		data.production_companies.forEach(company => {
			const li = document.createElement("li");
			li.className = "flex items-center gap-2 mb-2 bg-[#f8f8ff] rounded-lg px-4 py-2 shadow-sm";

			// Create logo image if available
			const imageUrl = company.logo_path == null
					? "https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg"
					: baseImageLoad + company.logo_path;

			const img = document.createElement("img");
				img.src = imageUrl;
				img.alt = `${company.name} Logo`;
				img.className = "w-10 h-auto object-contain";
				li.appendChild(img);

			// Company name
			const span = document.createElement("span");
			span.textContent = company.name;
			li.appendChild(span);

			productionList.appendChild(li);
		});
		
		// casts
		var allCasts = []

		$("#item-casts").html("N/A");

		if (data.credits.cast.length > 0) {
			$("#item-casts").html("");
		}
		$.each(data.credits.cast, function(index, cast) {
			allCasts = data.credits.cast;
		});

		if (allCasts.length > 6) {
			$("#load-more-cast").removeClass("hidden")
		} else {
			$("#load-more-cast").addClass("hidden")
		}

		const takeOnlyCast = allCasts
					.sort()
					.slice(0, 6);

		takeOnlyCast.forEach(cast => {
			createItemElementCast(cast, "cast", hrefCast);
		});

		$(document).on("click", "#btn-load-more-cast", function () {
			$("#item-casts").html("");
			$("#load-more-cast").addClass("hidden")
			
			allCasts.forEach(cast => {
				createItemElementCast(cast, "cast", hrefCast);
			});
		});

		// country released

		let flagString = "";
		$.each(data.origin_country, function(index, countryCode) {
			flagString += countryCodeToFlagEmoji(countryCode) + " ";
		});
		document.getElementById("item-country-flag").textContent = flagString.trim();

		document.getElementById("item-total-episode").innerHTML = "<b>Total Episodes:</b> " + data.number_of_episodes;
		document.getElementById("item-total-season").innerHTML = "<b>Total Seasons:</b> " + data.number_of_seasons;

		$("#section-season").removeClass("hidden");
		$("#section-revenue").addClass("hidden");
		$("#item-season").html("N/A");

		if (data.seasons.length > 0) {
			$("#item-season").html("");
		}
		$.each(data.seasons, function(index, season) {
			const posterSeason = season.poster_path == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: baseImageLoad + season.poster_path;

			const seasonOrdinal = season.season_number < 1 ? "Special edition" : "Season "+season.season_number;
			$("#item-season").append("<li class = 'list-season flex flex-col items-center justify-center text-center p-4' data-id='"+season.id+"'><a href='#item-season-"+season.id+"'><p>"+seasonOrdinal+"</p><br/><img alt='Poster' class = 'poster-images-small' src = "+posterSeason+"></img></a><br><p class = 'list-item-title'><b>Title : </b>"+truncateLongTitle(season.name, 30)+"</p><p><b>Rating : </b>⭐ "+season.vote_average+"/10</p><p>"+season.episode_count+" episode</p></a></li>");
		});

		document.getElementById("item-revenue").textContent =
		data.revenue ? `$${data.revenue.toLocaleString()}` : "N/A";

		document.getElementById("item-languages").textContent =
		data.spoken_languages.map(lang => lang.english_name).join(", ") || "N/A";

		if (data?.adult) {
			document.getElementById("item-rating-age").textContent = "Unrated (17+)";
			document.getElementById("item-rating-age").className = "inline-block px-3 py-1 bg-red-600 text-[#f8f8ff] text-xs font-bold rounded-full";
		} else {
			document.getElementById("item-rating-age").textContent = "All Ages";
			document.getElementById("item-rating-age").className = "inline-block px-3 py-1 bg-green-600 text-[#f8f8ff] text-xs font-bold rounded-full";
		}
	});

	$.getJSON("https://api.themoviedb.org/3/tv/"+tvShowId+"/external_ids?api_key="+apikey, function(dataId) {
		if(dataId.imdb_id !== null) {
			$.getJSON("https://api.themoviedb.org/3/find/"+dataId.imdb_id+"?api_key="+apikey+"&external_source=imdb_id", function(data) {
				const imageUrl = data.tv_results[0].poster_path == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
						: baseImageLoad + data.tv_results[0].poster_path;

				document.getElementById("item-title").textContent = data.tv_results[0].name;
				document.getElementById("item-release").textContent = data.tv_results[0].first_air_date;
				document.getElementById("item-rating").textContent = `${Number(data.tv_results[0].vote_average.toFixed(1))}/10`;
				document.getElementById("item-poster").src = imageUrl;
			});
		}
	});
}

async function runDetailCastData(castId, isDisplayOnly = false) {
	var hrefMovie = isDisplayOnly == true ? "#" : "#item-detail";

	$("#externalLinkCast").attr("data-ref", "cast");
	$("#externalLinkCast").attr("data-slug", castId);

	const apikey = await decryptString(ciphertext, iv, password);

	$.getJSON("https://api.themoviedb.org/3/person/"+castId+"?api_key="+apikey, function(data) {
		const imageUrl = data.profile_path == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
						: baseImageLoad + data.profile_path;

		let birthAndDeathDay = "N/A";
		if (data.birthday !== null) {
			birthAndDeathDay = data.deathday == null ? data.birthday : data.birthday+" (Passed away at "+data.deathday+")"
		}

		document.getElementById("cast-alias").textContent = data.also_known_as < 1 ? "N/A" : data.also_known_as.join(", ");
		document.getElementById("cast-name").textContent = data.name;
		document.getElementById("cast-place-birth").textContent = data.place_of_birth != null ? data.place_of_birth : "N/A";
		document.getElementById("cast-date-birth").textContent = birthAndDeathDay;
		document.getElementById("cast-poster").src = imageUrl;
		document.getElementById("cast-bg").src = imageUrl;
		document.getElementById("cast-gender").textContent = castGender[data.gender];
		document.getElementById("cast-biodata").textContent = data.biography.length > 0 ? data.biography : "No Biography"; 

		if (data.imdb_id != null) {
			$.getJSON("https://api.themoviedb.org/3/find/"+data.imdb_id+"?api_key="+apikey+"&external_source=imdb_id", function(dataImdb) {
				const imageUrl = dataImdb.person_results[0].profile_path == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
						: baseImageLoad + dataImdb.person_results[0].profile_path;

				document.getElementById("cast-poster").src = imageUrl;
				document.getElementById("cast-bg").src = imageUrl;
				document.getElementById("cast-name").textContent = dataImdb.person_results[0].name;
				document.getElementById("cast-gender").textContent = castGender[dataImdb.person_results[0].gender];
			});
		}
	});
}

function createItemElementMovieTvShow(parentName, item, displayType, hrefDestination = "#item-detail") {
	const imageUrl = item['poster_path'] == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: baseImageLoad + item['poster_path'];
					
	const name = item['title'] || item['name'];

	const li = document.createElement("li");
	li.className = "list-tv-movie flex flex-col items-center justify-center text-center p-4";
	li.setAttribute("data-slug", item["id"]);
	li.setAttribute("data-ref", displayType);

	const link = document.createElement("a");
	link.href = hrefDestination;
	link.className = "relative";

	const img = document.createElement("img");
	img.alt = "Poster";
	img.className = "poster-images";
	img.src = imageUrl;
	link.appendChild(img);

	// Optional "Adult" badge overlay
	if (item["adult"]) {
		const badge = document.createElement("span");
		badge.textContent = "Adult";
		badge.className = "absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded";
		link.appendChild(badge);
	}

	li.appendChild(link);
	li.appendChild(document.createElement("br"));

	const title = document.createElement("p");
	title.className = "list-item-title";
	title.innerHTML = "<b>Title : </b>" + truncateLongTitle(name, 30);
	li.appendChild(title);

	const rating = document.createElement("p");
	rating.innerHTML = "<b>Rating : </b>⭐ " + Number(item["vote_average"].toFixed(1)) + "/10";
	li.appendChild(rating);

	const language = document.createElement("p");
	language.textContent = languageCode(item["original_language"]);
	li.appendChild(language);

	document.getElementById(parentName).appendChild(li);

}

function createItemElementCast(item, displayType, hrefDestination = "#item-cast") {
	const photoCast = item["profile_path"] == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
						: baseImageLoad + item["profile_path"];

	const $li = $("<li>")
	.addClass("list-cast flex flex-col items-center justify-center text-center px-2 py-4")
	.attr("data-ref", displayType)
	.attr("data-slug", item["id"]);

	const $a = $("<a>").attr("href", hrefDestination);

	const $img = $("<img>")
	.addClass("poster-images-small")
	.attr("alt", "Poster")
	.attr("src", photoCast);

	const $title = $("<p>")
	.addClass("list-item-title")
	.html("<b>" + truncateLongTitle(item["name"], 30) + "</b>");

	const $character = $("<p>").text("Played as " + truncateLongTitle(item["character"], 30));

	$a.append($img);
	$li.append($a, "<br>", $title, $character);

	$("#item-casts").append($li);
}

function getExternalDetailPageUrl(type, id) {
	if (isLocalEnv) {
		return getBaseUrl().replace("index.html", "")+"detail/index.html?type="+type+"&id="+id;
	} else {
		return getBaseUrl()+"detail/"+type+"/"+id;
	}
}

function getBaseUrl() {
	if (isLocalEnv) {
		return $.mobile.path.documentBase.pathname;
	} else {
		return baseUrl;
	}
}