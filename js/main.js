var availableLanguage = [];

const apikey = "edfccf752de0d09758c56e652809912b"
var currentPageUpcoming = 1;
var currentPageTopRated = 1;
var currentPagePopular = 1;
var currentPageNowPlaying = 1;
var currentPageSearch = 1;
var currentPageGenreSearch= 1;
var tv_currentPageNowPlaying = 1;
var tv_currentPagePopular = 1;
var tv_currentPageTopRated = 1;

$(document).ready(function(){
	runAllLanguageProvided()
	runMovieTrendingTodayList()
	runTvTrendingTodayList()

	$(document).on("click", ".menu-item", function () {
		updateMovieDetailPageIdAndUrl("")
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

	runMovieGenreList()
	runTvGenreList()

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

	// TV DETAIL PART

	runDetailTvShowData("")
	runDetailMovieData("");

	$(document).on("click", ".list-tv", function () {
		const tvId = $(this).data("id");

		const url = getExternalDetailPageUrl("tv/"+tvId);

		navigator.clipboard.writeText(url)
		.then(() => {
		})
		.catch(err => {
			console.error("Failed to copy URL:", err);
  		});

		document.getElementById("externalLink").href = url;
		runDetailTvShowData(tvId)
	});

	// MOVIE DETAIL PART

	$(document).on("click", ".list-movie", function () {
		const movieId = $(this).data("id");

		const url = getExternalDetailPageUrl("movie/"+movieId);

		navigator.clipboard.writeText(url)
		.then(() => {
		})
		.catch(err => {
			console.error("Failed to copy URL:", err);
  		});

		document.getElementById("externalLink").href = url;
		runDetailMovieData(movieId);
	});
});

function runAllLanguageProvided() {
	$.getJSON("https://api.themoviedb.org/3/configuration/languages?api_key="+apikey, function(data){
		availableLanguage = data;
	});
}

function runMovieTrendingTodayList() {
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
						: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + data.poster_path;
				
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

function runTvTrendingTodayList() {
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
						: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + data.poster_path;
				
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

function runUpcomingList(currentPage) {
	$.getJSON("https://api.themoviedb.org/3/movie/upcoming?page="+currentPage+"&api_key="+apikey+"&include_adult=true", function(data){
		if (data.results.length < 1 && currentPage < 2) {
			$("#movieListUpcoming").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#movieListUpcoming").append("<li class='flex justify-center'>Data not found</li>");
		}

		$("#movieListUpcoming").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");

		$.each(data.results, function(){
			const imageUrl = this['poster_path'] == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

			$("#movieListUpcoming").append("<li class = 'list-movie flex flex-col items-center justify-center text-center p-4' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-images' src = "+imageUrl+"></img></a><br><p class = 'list-item-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b><p>Rating : </b>⭐ "+this['vote_average']+"/10</p><p>"+languageCode(this['original_language'])+"</p></a></li>");
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

function runTopRatedList(currentPage) {
	$.getJSON("https://api.themoviedb.org/3/movie/top_rated?page="+currentPage+"&api_key="+apikey+"&include_adult=true", function(data){
		if (data.results.length < 1 && currentPage < 2) {
			$("#movieListTopRated").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#movieListTopRated").append("<li class='flex justify-center'>Data not found</li>");
		}
		$("#movieListTopRated").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");

		$.each(data.results, function(){
			const imageUrl = this['poster_path'] == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];
					
			$("#movieListTopRated").append("<li class = 'list-movie flex flex-col items-center justify-center text-center p-4' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-images' src = "+imageUrl+"></img></a><br><p class = 'list-item-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b><p>Rating : </b>⭐ "+this['vote_average']+"/10</p><p>"+languageCode(this['original_language'])+"</p></a></li>");
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

function runPopularList(currentPage) {
	$.getJSON("https://api.themoviedb.org/3/movie/popular?page="+currentPage+"&api_key="+apikey+"&include_adult=true", function(data){
		if (data.results.length < 1 && currentPage < 2) {
			$("#movieListPopular").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#movieListPopular").append("<li class='flex justify-center'>Data not found</li>");
		}
		$("#movieListPopular").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");

		$.each(data.results, function(){
			const imageUrl = this['poster_path'] == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

			$("#movieListPopular").append("<li class = 'list-movie flex flex-col items-center justify-center text-center p-4' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-images' src = "+imageUrl+"></img></a><br><p class = 'list-item-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b><p>Rating : </b>⭐ "+this['vote_average']+"/10</p><p>"+languageCode(this['original_language'])+"</p></a></li>");
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

function runNowPlayingList(currentPage) {
	$.getJSON("https://api.themoviedb.org/3/movie/now_playing?page="+currentPage+"&api_key="+apikey+"&include_adult=true", function(data){
		if (data.results.length < 1 && currentPage < 2) {
			$("#movieListNowPlaying").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#movieListNowPlaying").append("<li class='flex justify-center'>Data not found</li>");
		}
		$("#movieListNowPlaying").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");

		$.each(data.results, function(){
			const imageUrl = this['poster_path'] == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

			$("#movieListNowPlaying").append("<li class = 'list-movie flex flex-col items-center justify-center text-center p-4' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-images' src = "+imageUrl+"></img></a><br><p class = 'list-item-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b><p>Rating : </b>⭐ "+this['vote_average']+"/10</p><p>"+languageCode(this['original_language'])+"</p></a></li>");
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

function runTvShowNowPlayingList(currentPage) {
	$.getJSON("https://api.themoviedb.org/3/tv/airing_today?page="+currentPage+"&api_key="+apikey+"&include_adult=true", function(data){
		if (data.results.length < 1 && currentPage < 2) {
			$("#tvListNowPlaying").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#tvListNowPlaying").append("<li class='flex justify-center'>Data not found</li>");
		}
		$("#tvListNowPlaying").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");

		$.each(data.results, function(){				
			const imageUrl = this['poster_path'] == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

			$("#tvListNowPlaying").append("<li class = 'list-tv flex flex-col items-center justify-center text-center p-4' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-images' src = "+imageUrl+"></img></a><br><p class = 'list-item-title'><b>Title : </b>"+truncateLongTitle(this['name'], 30)+"</p><b><p>Rating : </b>⭐ "+this['vote_average']+"/10</p><p>"+languageCode(this['original_language'])+"</p></a></li>");
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

function runTvShowPopularList(currentPage) {
	$.getJSON("https://api.themoviedb.org/3/tv/popular?page="+currentPage+"&api_key="+apikey+"&include_adult=true", function(data){
		if (data.results.length < 1 && currentPage < 2) {
			$("#tvListPopular").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#tvListPopular").append("<li class='flex justify-center'>Data not found</li>");
		}
		$("#tvListPopular").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");

		$.each(data.results, function(){				
			const imageUrl = this['poster_path'] == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

			$("#tvListPopular").append("<li class = 'list-tv flex flex-col items-center justify-center text-center p-4' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-images' src = "+imageUrl+"></img></a><br><p class = 'list-item-title'><b>Title : </b>"+truncateLongTitle(this['name'], 30)+"</p><b><p>Rating : </b>⭐ "+this['vote_average']+"/10</p><p>"+languageCode(this['original_language'])+"</p></a></li>");
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

function runTvShowTopRatedList(currentPage) {
	$.getJSON("https://api.themoviedb.org/3/tv/top_rated?page="+currentPage+"&api_key="+apikey+"&include_adult=true", function(data){
		if (data.results.length < 1 && currentPage < 2) {
			$("#tvListTopRated").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#tvListTopRated").append("<li class='flex justify-center'>Data not found</li>");
		}
		$("#tvListTopRated").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
		
		$.each(data.results, function(){				
			const imageUrl = this['poster_path'] == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

			$("#tvListTopRated").append("<li class = 'list-tv flex flex-col items-center justify-center text-center p-4' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-images' src = "+imageUrl+"></img></a><br><p class = 'list-item-title'><b>Title : </b>"+truncateLongTitle(this['name'], 30)+"</p><b><p>Rating : </b>⭐ "+this['vote_average']+"/10</p><p>"+languageCode(this['original_language'])+"</p></a></li>");
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

function runSearchList(currentPage, keyword) {
	$.getJSON('https://api.themoviedb.org/3/search/movie?page='+currentPage+'&query='+keyword+'&api_key='+apikey+'&include_adult=true', function(data) {
		$("#movieListSearch").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");

		if (data.results.length < 1 && currentPage < 2) {
			$("#movieListSearch").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#movieListSearch").append("<li class='flex justify-center'>Data not found</li>");
		}

		$.each(data.results, function(){
			const imageUrl = this['poster_path'] == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];
					
			const name = this['title'] || this['name'];
			$("#movieListSearch").append("<li class = 'list-movie flex flex-col items-center justify-center text-center p-4' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-images' src = "+imageUrl+"></img></a><br><p class = 'list-item-title'><b>Title : </b>"+truncateLongTitle(name, 30)+"</p><b><p>Rating : </b>⭐ "+this['vote_average']+"/10</p><p>"+languageCode(this['original_language'])+"</p></a></li>");
		});

		if (data.results.length > 0) {
			const loadMoreSection = document.getElementById('load-more-section-search');
			loadMoreSection.classList.remove('hidden');
		} else {
			const loadMoreSection = document.getElementById('load-more-section-search');
			loadMoreSection.classList.add('hidden');
		}
	});

	$.getJSON('https://api.themoviedb.org/3/search/tv?page='+currentPage+'&query='+keyword+'&api_key='+apikey+'&include_adult=true', function(data) {
		$("#movieListSearch").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");

		if (data.results.length < 1 && currentPage < 2) {
			$("#movieListSearch").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#movieListSearch").append("<li class='flex justify-center'>Data not found</li>");
		}

		$.each(data.results, function(){
			const imageUrl = this['poster_path'] == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];
					
			const name = this['title'] || this['name'];
			$("#movieListSearch").append("<li class = 'list-tv flex flex-col items-center justify-center text-center p-4' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-images' src = "+imageUrl+"></img></a><br><p class = 'list-item-title'><b>Title : </b>"+truncateLongTitle(name, 30)+"</p><b><p>Rating : </b>⭐ "+this['vote_average']+"/10</p><p>"+languageCode(this['original_language'])+"</p></a></li>");
		});

		if (data.results.length > 0) {
			const loadMoreSection = document.getElementById('load-more-section-search');
			loadMoreSection.classList.remove('hidden');
		} else {
			const loadMoreSection = document.getElementById('load-more-section-search');
			loadMoreSection.classList.add('hidden');
		}
	});
}

function runMovieGenreList() {
	let movieGenre = [];

	$.getJSON('https://api.themoviedb.org/3/genre/movie/list?api_key='+apikey, function(data) {
		movieGenre = data.genres;
		$.each(data.genres, function(){
			const li = document.createElement("li");
			li.className = "bg-[#5e87b0] px-4 py-2 rounded-[30px] text-[#f8f8ff] no-text-shadow item-click-genre";
			li.setAttribute("data-genre-id", this['id']);
			li.textContent = this['name']

			const parentList = document.getElementById("movieGenreList");
			parentList.appendChild(li);
		});
	});

	$("#movieGenreList").on("click", "li", function () {
		currentPageGenreSearch = 1;
		$("#GenreListSearch").html("");
		
		const index = $(this).index(); // Get the index of clicked <li>
		if (movieGenre[index]) {
			$.getJSON('https://api.themoviedb.org/3/discover/movie?api_key='+apikey+'&with_genres='+movieGenre[index].id, function(data) {
				$.each(data.results, function(){
					const imageUrl = this['poster_path'] == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

					$("#GenreListSearch").append("<li class = 'list-movie flex flex-col items-center justify-center text-center p-4' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-images' src = "+imageUrl+"></img></a><br><p class = 'list-item-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b><p>Rating : </b>⭐ "+this['vote_average']+"/10</p><p>"+languageCode(this['original_language'])+"</p></a></li>");
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
			$.each(data.results, function(){
				const imageUrl = this['poster_path'] == null
				? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
				: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

				$("#GenreListSearch").append("<li class = 'list-movie flex flex-col items-center justify-center text-center p-4' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-images' src = "+imageUrl+"></img></a><br><p class = 'list-item-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b><p>Rating : </b>⭐ "+this['vote_average']+"/10</p><p>"+languageCode(this['original_language'])+"</p></a></li>");
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

function runTvGenreList() {
	let tvGenre = [];

	$.getJSON('https://api.themoviedb.org/3/genre/tv/list?api_key='+apikey, function(data) {
		tvGenre = data.genres;
		$.each(data.genres, function(){
			const li = document.createElement("li");
			li.className = "bg-[#5e87b0] px-4 py-2 rounded-[30px] text-[#f8f8ff] no-text-shadow item-click-genre";
			li.setAttribute("data-genre-id", this['id']);
			li.textContent = this['name']

			const parentList = document.getElementById("tvGenreList");
			parentList.appendChild(li);
		});
	});

	$("#tvGenreList").on("click", "li", function () {
		currentPageGenreSearch = 1;
		$("#GenreListSearch").html("");

		const index = $(this).index(); // Get the index of clicked <li>
		if (tvGenre[index]) {
			$.getJSON('https://api.themoviedb.org/3/discover/tv?api_key='+apikey+'&with_genres='+tvGenre[index].id, function(data) {
				
				$.each(data.results, function(){
					const imageUrl = this['poster_path'] == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

					$("#GenreListSearch").append("<li class = 'list-tv flex flex-col items-center justify-center text-center p-4' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-images' src = "+imageUrl+"></img></a><br><p class = 'list-item-title'><b>Title : </b>"+truncateLongTitle(this['name'], 30)+"</p><b><p>Rating : </b>⭐ "+this['vote_average']+"/10</p><p>"+languageCode(this['original_language'])+"</p></a></li>");
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
			$.each(data.results, function(){
				const imageUrl = this['poster_path'] == null
				? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
				: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

				$("#GenreListSearch").append("<li class = 'list-movie flex flex-col items-center justify-center text-center p-4' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-images' src = "+imageUrl+"></img></a><br><p class = 'list-item-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b><p>Rating : </b>⭐ "+this['vote_average']+"/10</p><p>"+languageCode(this['original_language'])+"</p></a></li>");
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



function truncateLongTitle(title, maxLength) {
	if (title?.length <= maxLength) {
		return title;
	}
	return title?.substring(0, maxLength - 3) + '...';
}

function updateMovieDetailPageIdAndUrl(newName) {
	const $page = $('div[data-original="true"]'); // always target the original

	const newId = `item-detail${newName}`;
	const newUrl = `item-detail${newName}`;

	$page.attr("id", newId);
	$page.attr("data-url", newUrl);
}

function setGenresAndOverview(data) {
	// Set Overview
	document.getElementById("item-overview").textContent = data.overview;

	// Set Genres
	const genreContainer = document.getElementById("genre-tags");
	genreContainer.innerHTML = ""; // Clear old tags

	data.genres.forEach(genre => {
		const span = document.createElement("span");
		span.className = "px-4 py-1 bg-blue-600 hover:bg-blue-700 text-[#f8f8ff] font-medium rounded-full text-xs shadow transition-all";
		span.textContent = genre.name;
		genreContainer.appendChild(span);
	});
}

function languageCode(languageCode) {
		const lang = "Sub"
		const entry = availableLanguage.find(lang => lang.iso_639_1 === languageCode.toLowerCase());

		if (entry != null) {
			if (entry.name === "" || entry.name.toLowerCase() === entry.english_name.toLowerCase()) {
				return entry.english_name+" "+lang
			} else {
				return entry.english_name+" ("+entry.name+")"+" "+lang
			}
		} else {
			return "N/A"+" "+lang
		}
}

function countryCodeToFlagEmoji(countryCode) {
	return countryCode
		.toUpperCase()
		.replace(/./g, char =>
		String.fromCodePoint(127397 + char.charCodeAt())
	);
}

function runDetailMovieData(movieId) {
	if (window.location.href.includes("item-detail") && movieId === "") {
	  	window.location.href = document.referrer;
		return;
	}
	if (movieId === "") return;

	let backdropImages = [];
	
	updateMovieDetailPageIdAndUrl(`-${movieId}`);
	
	$("#itemSimilarTitle").text("Similar movies you'd like");

	$.getJSON("https://api.themoviedb.org/3/movie/"+movieId+"/similar?api_key="+apikey+"&include_adult=true", function(data) {
		$("#itemListSimilar").html("");

		$("#itemListSimilar").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
		if (data.results.length < 1) {
			$("#itemListSimilar").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#itemListSimilar").append("<li class='flex justify-center'>Data not found</li>");
		}

		$.each(data.results, function(){
			const imageUrl = this['poster_path'] == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

			$("#itemListSimilar").append("<li class = 'list-movie flex flex-col items-center justify-center text-center p-4' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-images' src = "+imageUrl+"></img></a><br><p class = 'list-item-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b><p>Rating : </b>⭐ "+this['vote_average']+"/10</p><p>"+languageCode(this['original_language'])+"</p></a></li>");
		});
	});

	$.getJSON("https://api.themoviedb.org/3/movie/"+movieId+"/images?api_key="+apikey, function(data) {
		const posterList = document.getElementById("item-images-alternate");
			posterList.innerHTML = "";

			backdropImages = data.backdrops;
			data.backdrops.forEach((data, index) => {
				const imageUrl = data.file_path == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w500" + data.file_path;

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

	$("#item-images-alternate").on("click", "li", function () {
		const index = $(this).index(); // Get the index of clicked <li>
		if (backdropImages[index]) {
			const selectedPath = backdropImages[index].file_path;
			const imageUrl = selectedPath
			? "https://image.tmdb.org/t/p/original" + selectedPath
			: "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg";

			$("#item-bg").attr("src", imageUrl);
		}
	});

	$.getJSON("https://api.themoviedb.org/3/movie/"+movieId+"/videos?api_key="+apikey, function(data) {
		const seasonList = document.getElementById("item-videos");
		seasonList.innerHTML = "";
		
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

			seasonList.appendChild(card); // seasonList should be a <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
		});

	});

	$.getJSON("https://api.themoviedb.org/3/movie/"+movieId+"/external_ids?api_key="+apikey, function(dataId) {
		$.getJSON("https://api.themoviedb.org/3/find/"+dataId.imdb_id+"?api_key="+apikey+"&external_source=imdb_id", function(data) {
			const imageUrl = data.movie_results[0].poster_path == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w500" + data.movie_results[0].poster_path;

			document.getElementById("item-title").textContent = data.movie_results[0].title;
			document.getElementById("item-release").textContent = data.movie_results[0].release_date;
			document.getElementById("item-rating").textContent = `${data.movie_results[0].vote_average}/10`;
			document.getElementById("item-poster").src = imageUrl;
			document.getElementById("item-bg").src = imageUrl;
		});
	});


	$.getJSON("https://api.themoviedb.org/3/movie/"+movieId+"?api_key="+apikey+"&include_adult=true", function(data) {
		setGenresAndOverview(data);

		const backdropUrl = data.backdrop_path == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w500" + data.backdrop_path;

		document.getElementById("item-bg").src = backdropUrl;

		document.getElementById("item-tagline").textContent = data.tagline || "No tagline available.";

		const productionList = document.getElementById("item-production");
			productionList.innerHTML = "";

			data.production_companies.forEach(company => {
			const li = document.createElement("li");
			li.className = "flex items-center gap-2 mb-2 bg-[#f8f8ff] rounded-lg px-4 py-2 shadow-sm";

			// Create logo image if available
			const imageUrl = company.logo_path == null
					? "https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg"
					: "https://image.tmdb.org/t/p/w92" + company.logo_path;

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

		let flagString = "";
		$.each(data.origin_country, function(index, countryCode) {
			flagString += countryCodeToFlagEmoji(countryCode) + " ";
		});
		document.getElementById("item-country-flag").textContent = flagString.trim();

		document.getElementById("item-total-episode").innerHTML = "";
		document.getElementById("item-total-season").innerHTML = "";

		$("#section-season").addClass("hidden");
		$("#section-revenue").removeClass("hidden");

		document.getElementById("item-revenue").textContent =
		data.revenue ? `$${data.revenue.toLocaleString()}` : "N/A";

		document.getElementById("item-languages").textContent =
		data.spoken_languages.map(lang => lang.english_name).join(", ") || "N/A";

		if (data?.adult) {
			document.getElementById("item-rating-age").textContent = "17+";
			document.getElementById("item-rating-age").className = "inline-block px-3 py-1 bg-red-600 text-[#f8f8ff] text-xs font-bold rounded-full";
		} else {
			document.getElementById("item-rating-age").textContent = "All ages";
			document.getElementById("item-rating-age").className = "inline-block px-3 py-1 bg-green-600 text-[#f8f8ff] text-xs font-bold rounded-full";
		}
	});
}

function runDetailTvShowData(tvShowId) {
	if (window.location.href.includes("item-detail") && tvShowId === "") {
	  	window.location.href = document.referrer;
		return;
	}
	if (tvShowId === "") return;
	
	let backdropImages = [];
	$("#itemSimilarTitle").text("Similar TV show you'd like");

	updateMovieDetailPageIdAndUrl(`-${tvShowId}`);

	$.getJSON("https://api.themoviedb.org/3/tv/"+tvShowId+"/images?api_key="+apikey, function(data) {
		const posterList = document.getElementById("item-images-alternate");
			posterList.innerHTML = "";

			backdropImages = data.backdrops;
			data.backdrops.forEach(data => {
				const imageUrl = data.file_path == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w500" + data.file_path;

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

	$("#item-images-alternate").on("click", "li", function () {
		const index = $(this).index(); // Get the index of clicked <li>
		if (backdropImages[index]) {
			const selectedPath = backdropImages[index].file_path;
			const imageUrl = selectedPath
			? "https://image.tmdb.org/t/p/original" + selectedPath
			: "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg";

			$("#item-bg").attr("src", imageUrl);
		}
	});

	$.getJSON("https://api.themoviedb.org/3/tv/"+tvShowId+"/similar?api_key="+apikey+"&include_adult=true", function(data) {
		
		$("#itemListSimilar").html("");
		$("#itemListSimilar").addClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");

		if (data.results.length < 1) {
			$("#itemListSimilar").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
			$("#itemListSimilar").append("<li class='flex justify-center'>Data not found</li>");
		}

		$.each(data.results, function(){
			const imageUrl = this['poster_path'] == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

			$("#itemListSimilar").append("<li class = 'list-tv flex flex-col items-center justify-center text-center p-4' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-images' src = "+imageUrl+"></img></a><br><p class = 'list-item-title'><b>Title : </b>"+truncateLongTitle(this['name'], 30)+"</p><b><p>Rating : </b>⭐ "+this['vote_average']+"/10</p><p>"+languageCode(this['original_language'])+"</p></a></li>");
		});
	});

	$.getJSON("https://api.themoviedb.org/3/tv/"+tvShowId+"/videos?api_key="+apikey, function(data) {
		const seasonList = document.getElementById("item-videos");
		seasonList.innerHTML = "";
		
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

			seasonList.appendChild(card);
		});

	});

	$.getJSON("https://api.themoviedb.org/3/tv/"+tvShowId+"?api_key="+apikey+"&include_adult=true", function(data) {
		setGenresAndOverview(data);

		const backdropUrl = data.backdrop_path == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w500" + data.backdrop_path;

		document.getElementById("item-bg").src = backdropUrl;

		document.getElementById("item-tagline").textContent = data.tagline || "No tagline available.";

		const productionList = document.getElementById("item-production");
		productionList.innerHTML = "";

		data.production_companies.forEach(company => {
			const li = document.createElement("li");
			li.className = "flex items-center gap-2 mb-2 bg-[#f8f8ff] rounded-lg px-4 py-2 shadow-sm";

			// Create logo image if available
			const imageUrl = company.logo_path == null
					? "https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg"
					: "https://image.tmdb.org/t/p/w92" + company.logo_path;

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

		let flagString = "";
		$.each(data.origin_country, function(index, countryCode) {
			flagString += countryCodeToFlagEmoji(countryCode) + " ";
		});
		document.getElementById("item-country-flag").textContent = flagString.trim();

		document.getElementById("item-total-episode").innerHTML = "<b>Total Episodes:</b> " + data.number_of_episodes;
		document.getElementById("item-total-season").innerHTML = "<b>Total Seasons:</b> " + data.number_of_seasons;

		$("#section-season").removeClass("hidden");
		$("#section-revenue").addClass("hidden");
		$("#item-season").html("");

		$.each(data.seasons, function(index, season) {
			const posterSeason = season.poster_path == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w500" + season.poster_path;

			const seasonOrdinal = season.season_number < 1 ? "Special edition" : "Season "+season.season_number;
			$("#item-season").append("<li class = 'list-season flex flex-col items-center justify-center text-center p-4' data-id='"+season.id+"'><a href='#item-detail-"+season.id+"'><p>"+seasonOrdinal+"</p><br/><img alt='Poster' class = 'poster-images-small' src = "+posterSeason+"></img></a><br><p class = 'list-item-title'><b>Title : </b>"+truncateLongTitle(season.name, 30)+"</p><b><p>Rating : </b>⭐ "+season.vote_average+"/10</p><p>"+season.episode_count+" episode</p></a></li>");
		});

		document.getElementById("item-revenue").textContent =
		data.revenue ? `$${data.revenue.toLocaleString()}` : "N/A";

		document.getElementById("item-languages").textContent =
		data.spoken_languages.map(lang => lang.english_name).join(", ") || "N/A";

		if (data?.adult) {
			document.getElementById("item-rating-age").textContent = "17+";
			document.getElementById("item-rating-age").className = "inline-block px-3 py-1 bg-red-600 text-[#f8f8ff] text-xs font-bold rounded-full";
		} else {
			document.getElementById("item-rating-age").textContent = "All ages";
			document.getElementById("item-rating-age").className = "inline-block px-3 py-1 bg-green-600 text-[#f8f8ff] text-xs font-bold rounded-full";
		}
	});

	$.getJSON("https://api.themoviedb.org/3/tv/"+tvShowId+"/external_ids?api_key="+apikey, function(dataId) {
		$.getJSON("https://api.themoviedb.org/3/find/"+dataId.imdb_id+"?api_key="+apikey+"&external_source=imdb_id", function(data) {
			const imageUrl = data.tv_results[0].poster_path == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: "https://image.tmdb.org/t/p/w500" + data.tv_results[0].poster_path;

			document.getElementById("item-title").textContent = data.tv_results[0].name;
			document.getElementById("item-release").textContent = data.tv_results[0].first_air_date;
			document.getElementById("item-rating").textContent = `${data.tv_results[0].vote_average}/10`;
			document.getElementById("item-poster").src = imageUrl;
		});
	});
}

function getExternalDetailPageUrl(path) {
	return "https://findyourmovies.vercel.app/detail/"+path;
}