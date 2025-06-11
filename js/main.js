$(document).ready(function(){
	var currentPageUpcoming = 1;
	var currentPageTopRated = 1;
	var currentPagePopular = 1;
	var currentPageNowPlaying = 1;
	var currentPageSearch = 1;

	$(document).on("click", ".menu-item", function () {
		updateMovieDetailPageIdAndUrl("")
	});

	runUpcomingList(currentPageUpcoming);

	$(document).on("click", "#btn-load-more-top-upcoming", function () {
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

	$(document).on("click", ".btn-search", function () {
		const keyword = $("#et-search").val();

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

	function runUpcomingList(currentPage) {
		$.getJSON("http://api.themoviedb.org/3/movie/upcoming?page="+currentPage+"&api_key=edfccf752de0d09758c56e652809912b", function(data){
			$.each(data.results, function(){
				const imageUrl = this['poster_path'] == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

				if (data.results.length < 1 && currentPage < 2) {
					$("#movieListUpcoming").append("<li class='flex-li'>Data not found</li>");
				}
				$("#movieListUpcoming").append("<li class = 'list-movie' data-id='"+this['id']+"'><a href='#movie-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = "+imageUrl+"></img></a><br><p class = 'list-movie-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b>Rating : </b>⭐ "+this['vote_average']+"/10</li>");
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
		$.getJSON("http://api.themoviedb.org/3/movie/top_rated?page="+currentPage+"&api_key=edfccf752de0d09758c56e652809912b", function(data){
			$.each(data.results, function(){
				const imageUrl = this['poster_path'] == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];
						
				if (data.results.length < 1 && currentPage < 2) {
					$("#movieListTopRated").append("<li class='flex-li'>Data not found</li>");
				}
				$("#movieListTopRated").append("<li class = 'list-movie' data-id='"+this['id']+"'><a href='#movie-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = "+imageUrl+"></img></a><br><p class = 'list-movie-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b>Rating : </b>⭐ "+this['vote_average']+"/10</li>");
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
		$.getJSON("http://api.themoviedb.org/3/movie/popular?page="+currentPage+"1&api_key=edfccf752de0d09758c56e652809912b", function(data){
			$.each(data.results, function(){
				const imageUrl = this['poster_path'] == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

				if (data.results.length < 1 && currentPage < 2) {
					$("#movieListPopular").append("<li class='flex-li'>Data not found</li>");
				}
				$("#movieListPopular").append("<li class = 'list-movie' data-id='"+this['id']+"'><a href='#movie-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = "+imageUrl+"></img></a><br><p class = 'list-movie-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b>Rating : </b>⭐ "+this['vote_average']+"/10</li>");
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
		$.getJSON("http://api.themoviedb.org/3/movie/now_playing?page="+currentPage+"&api_key=edfccf752de0d09758c56e652809912b", function(data){
			$.each(data.results, function(){
				const imageUrl = this['poster_path'] == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

				if (data.results.length < 1 && currentPage < 2) {
					$("#movieListNowPlaying").append("<li class='flex-li'>Data not found</li>");
				}
				$("#movieListNowPlaying").append("<li class = 'list-movie' data-id='"+this['id']+"'><a href='#movie-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = "+imageUrl+"></img></a><br><p class = 'list-movie-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b>Rating : </b>⭐ "+this['vote_average']+"/10</li>");
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

	function runSearchList(currentPage, keyword) {
		$.getJSON('https://api.themoviedb.org/3/search/movie?page='+currentPage+'&query="'+keyword+'"&api_key=edfccf752de0d09758c56e652809912b', function(data) {
			$.each(data.results, function(){
				const imageUrl = this['poster_path'] == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];
						
				if (data.results.length < 1 && currentPage < 2) {
					$("#movieListSearch").append("<li class='flex-li'>Data not found</li>");
				}
				$("#movieListSearch").append("<li class = 'list-movie' data-id='"+this['id']+"'><a href='#movie-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = "+imageUrl+"></img></a><br><p class = 'list-movie-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b>Rating : </b>⭐ "+this['vote_average']+"/10</li>");
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

	function truncateLongTitle(title, maxLength) {
		if (title.length <= maxLength) {
			return title;
		}
		return title.substring(0, maxLength - 3) + '...';
	}

	// MOVIE DETAIL PART

	$(document).on("click", ".list-movie", function () {
		const movieId = $(this).data("id");
		updateMovieDetailPageIdAndUrl(`-${movieId}`);

		$.getJSON(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=edfccf752de0d09758c56e652809912b`, function(data) {
			$.each(data.results, function(){
				const imageUrl = this['poster_path'] == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

				if (data.results.length < 1 && currentPage < 2) {
					$("#movieListSimilar").append("<li class='flex-li'>Data not found</li>");
				}
				$("#movieListSimilar").append("<li class = 'list-movie' data-id='"+this['id']+"'><a href='#movie-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = "+imageUrl+"></img></a><br><p class = 'list-movie-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b>Rating : </b>⭐ "+this['vote_average']+"/10</li>");
			});
		});

		$.getJSON(`https://api.themoviedb.org/3/movie/${movieId}?api_key=edfccf752de0d09758c56e652809912b`, function(data) {
			const imageUrl = data.poster_path == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w500" + data.poster_path;

			document.getElementById("movie-title").textContent = data.title;
			document.getElementById("movie-release").textContent = data.release_date;
			document.getElementById("movie-rating").textContent = `⭐ ${data.vote_average}/10`;
			document.getElementById("movie-poster").src = imageUrl;
			document.getElementById("movie-bg").src = imageUrl;

  			setGenresAndOverview(data);

			document.getElementById("movie-tagline").textContent = data.tagline || "No tagline available.";

			const productionList = document.getElementById("movie-production");
				productionList.innerHTML = "";

				data.production_companies.forEach(company => {
				const li = document.createElement("li");
				li.className = "flex items-center gap-2 mb-2 bg-white/80 rounded-lg px-4 py-2 shadow-sm";

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


			document.getElementById("movie-revenue").textContent =
			data.revenue ? `$${data.revenue.toLocaleString()}` : "N/A";

			document.getElementById("movie-languages").textContent =
			data.spoken_languages.map(lang => lang.english_name).join(", ") || "N/A";

			document.getElementById("movie-rating-age").textContent = data.adult ? "17+" : "All Age";

			if (data?.adult) {
				document.getElementById("movie-rating-age").textContent = "17+";
				document.getElementById("movie-rating-age").className = "inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full";
			} else {
				document.getElementById("movie-rating-age").textContent = "All ages";
				document.getElementById("movie-rating-age").className = "inline-block px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full";
			}
		});
	});

	function updateMovieDetailPageIdAndUrl(newName) {
		const $page = $('div[data-original="true"]'); // always target the original

		const newId = `movie-detail${newName}`;
		const newUrl = `movie-detail${newName}`;

		$page.attr("id", newId);
		$page.attr("data-url", newUrl);
	}
	
	function setGenresAndOverview(data) {
		// Set Overview
		document.getElementById("movie-overview").textContent = data.overview;

		// Set Genres
		const genreContainer = document.getElementById("genre-tags");
		genreContainer.innerHTML = ""; // Clear old tags

		data.genres.forEach(genre => {
			const span = document.createElement("span");
			span.className = "px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full text-xs shadow transition-all";
			span.textContent = genre.name;
			genreContainer.appendChild(span);
		});
	}

});