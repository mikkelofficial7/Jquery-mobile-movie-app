$(document).ready(function(){
	var currentPageUpcoming = 1;
	var currentPageTopRated = 1;
	var currentPagePopular = 1;
	var currentPageNowPlaying = 1;
	var currentPageSearch = 1;
	var tv_currentPageNowPlaying = 1;
	var tv_currentPagePopular = 1;
	var tv_currentPageTopRated = 1;


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








	$(document).on("click", ".btn-search", function () {
		const keyword = $("#et-search").val();
		currentPageSearch = 1;

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






	function runMovieTrendingTodayList() {
		$.getJSON("http://api.themoviedb.org/3/trending/movie/day?api_key=edfccf752de0d09758c56e652809912b", function(data){
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
		$.getJSON("http://api.themoviedb.org/3/trending/tv/day?api_key=edfccf752de0d09758c56e652809912b", function(data){
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
		$.getJSON("http://api.themoviedb.org/3/movie/upcoming?page="+currentPage+"&api_key=edfccf752de0d09758c56e652809912b&include_adult=true", function(data){
			$.each(data.results, function(){
				const imageUrl = this['poster_path'] == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

				if (data.results.length < 1 && currentPage < 2) {
					$("#movieListUpcoming").append("<li class='flex-li'>Data not found</li>");
				}
				$("#movieListUpcoming").append("<li class = 'list-movie' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = "+imageUrl+"></img></a><br><p class = 'list-movie-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b>Rating : </b>⭐ "+this['vote_average']+"/10</li>");
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
		$.getJSON("http://api.themoviedb.org/3/movie/top_rated?page="+currentPage+"&api_key=edfccf752de0d09758c56e652809912b&include_adult=true", function(data){
			$.each(data.results, function(){
				const imageUrl = this['poster_path'] == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];
						
				if (data.results.length < 1 && currentPage < 2) {
					$("#movieListTopRated").append("<li class='flex-li'>Data not found</li>");
				}
				$("#movieListTopRated").append("<li class = 'list-movie' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = "+imageUrl+"></img></a><br><p class = 'list-movie-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b>Rating : </b>⭐ "+this['vote_average']+"/10</li>");
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
		$.getJSON("http://api.themoviedb.org/3/movie/popular?page="+currentPage+"1&api_key=edfccf752de0d09758c56e652809912b&include_adult=true", function(data){
			$.each(data.results, function(){
				const imageUrl = this['poster_path'] == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

				if (data.results.length < 1 && currentPage < 2) {
					$("#movieListPopular").append("<li class='flex-li'>Data not found</li>");
				}
				$("#movieListPopular").append("<li class = 'list-movie' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = "+imageUrl+"></img></a><br><p class = 'list-movie-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b>Rating : </b>⭐ "+this['vote_average']+"/10</li>");
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
		$.getJSON("http://api.themoviedb.org/3/movie/now_playing?page="+currentPage+"&api_key=edfccf752de0d09758c56e652809912b&include_adult=true", function(data){
			$.each(data.results, function(){
				const imageUrl = this['poster_path'] == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

				if (data.results.length < 1 && currentPage < 2) {
					$("#movieListNowPlaying").append("<li class='flex-li'>Data not found</li>");
				}
				$("#movieListNowPlaying").append("<li class = 'list-movie' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = "+imageUrl+"></img></a><br><p class = 'list-movie-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b>Rating : </b>⭐ "+this['vote_average']+"/10</li>");
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
		$.getJSON("http://api.themoviedb.org/3/tv/airing_today?page="+currentPage+"&api_key=edfccf752de0d09758c56e652809912b&include_adult=true", function(data){
			$.each(data.results, function(){				
				const imageUrl = this['poster_path'] == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

				if (data.results.length < 1 && currentPage < 2) {
					$("#tvListNowPlaying").append("<li class='flex-li'>Data not found</li>");
				}
				$("#tvListNowPlaying").append("<li class = 'list-tv' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = "+imageUrl+"></img></a><br><p class = 'list-tv-title'><b>Title : </b>"+truncateLongTitle(this['name'], 30)+"</p><b>Rating : </b>⭐ "+this['vote_average']+"/10</li>");
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
		$.getJSON("http://api.themoviedb.org/3/tv/popular?page="+currentPage+"&api_key=edfccf752de0d09758c56e652809912b&include_adult=true", function(data){
			$.each(data.results, function(){				
				const imageUrl = this['poster_path'] == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

				if (data.results.length < 1 && currentPage < 2) {
					$("#tvListPopular").append("<li class='flex-li'>Data not found</li>");
				}
				$("#tvListPopular").append("<li class = 'list-tv' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = "+imageUrl+"></img></a><br><p class = 'list-tv-title'><b>Title : </b>"+truncateLongTitle(this['name'], 30)+"</p><b>Rating : </b>⭐ "+this['vote_average']+"/10</li>");
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
		$.getJSON("http://api.themoviedb.org/3/tv/top_rated?page="+currentPage+"&api_key=edfccf752de0d09758c56e652809912b&include_adult=true", function(data){
			$.each(data.results, function(){				
				const imageUrl = this['poster_path'] == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

				if (data.results.length < 1 && currentPage < 2) {
					$("#tvListTopRated").append("<li class='flex-li'>Data not found</li>");
				}
				$("#tvListTopRated").append("<li class = 'list-tv' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = "+imageUrl+"></img></a><br><p class = 'list-tv-title'><b>Title : </b>"+truncateLongTitle(this['name'], 30)+"</p><b>Rating : </b>⭐ "+this['vote_average']+"/10</li>");
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
		$.getJSON('https://api.themoviedb.org/3/search/multi?page='+currentPage+'&query="'+keyword+'"&api_key=edfccf752de0d09758c56e652809912b&include_adult=true', function(data) {
			if (currentPage == 1) $("#movieListSearch").html('');
			
			$.each(data.results, function(){
				const imageUrl = this['poster_path'] == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];
						
				if (data.results.length < 1 && currentPage < 2) {
					$("#movieListSearch").append("<li class='flex-li'>Data not found</li>");
				}
				$("#movieListSearch").append("<li class = 'list-movie' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = "+imageUrl+"></img></a><br><p class = 'list-movie-title'><b>Title : </b>"+truncateLongTitle(this['name'], 30)+"</p><b>Rating : </b>⭐ "+this['vote_average']+"/10</li>");
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
		if (title?.length <= maxLength) {
			return title;
		}
		return title?.substring(0, maxLength - 3) + '...';
	}

	// TV DETAIL PART

	$(document).on("click", ".list-tv", function () {
		const movieId = $(this).data("id");

		let backdropImages = [];
		$("#itemSimilarTitle").text("Similar TV show you'd like");

		updateMovieDetailPageIdAndUrl(`-${movieId}`);

		$.getJSON(`https://api.themoviedb.org/3/tv/${movieId}/images?api_key=edfccf752de0d09758c56e652809912b`, function(data) {
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

		$.getJSON(`https://api.themoviedb.org/3/tv/${movieId}/similar?api_key=edfccf752de0d09758c56e652809912b&include_adult=true`, function(data) {
			$("#itemListSimilar").html("");

			$.each(data.results, function(){
				const imageUrl = this['poster_path'] == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

				if (data.results.length < 1 && currentPage < 2) {
					$("#itemListSimilar").append("<li class='flex-li'>Data not found</li>");
				}
				$("#itemListSimilar").append("<li class = 'list-tv' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = "+imageUrl+"></img></a><br><p class = 'list-tv-title'><b>Title : </b>"+truncateLongTitle(this['name'], 30)+"</p><b>Rating : </b>⭐ "+this['vote_average']+"/10</li>");
			});
		});

		$.getJSON(`https://api.themoviedb.org/3/tv/${movieId}?api_key=edfccf752de0d09758c56e652809912b&include_adult=true`, function(data) {
			const imageUrl = data.poster_path == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w500" + data.poster_path;

			document.getElementById("item-title").textContent = data.name;
			document.getElementById("item-release").textContent = data.release_date;
			document.getElementById("item-rating").textContent = `⭐ ${data.vote_average}/10`;
			document.getElementById("item-poster").src = imageUrl;
			document.getElementById("item-bg").src = imageUrl;

  			setGenresAndOverview(data);

			document.getElementById("item-tagline").textContent = data.tagline || "No tagline available.";

			const productionList = document.getElementById("item-production");
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

			const seasonList = document.getElementById("item-seasons");
			seasonList.innerHTML = "";
			
			if (data.seasons.length > 0) {
				const section = document.getElementById('section-session');
				section.classList.remove('hidden');
			} else {
				const section = document.getElementById('section-session');
				section.classList.add('hidden');
			}

			data.seasons.forEach(season => {
				const card = document.createElement("li");
				card.className = "flex-none w-40";

				const imageUrl = season.poster_path == null
						? "https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg"
  						: "https://image.tmdb.org/t/p/w300" + season.poster_path;

				const image = document.createElement("img");
				image.src = imageUrl;
				image.alt = season.name;
				image.className = "rounded-lg shadow-md w-full h-auto";

				const content = document.createElement("div");
				content.className = "p-3";

				const title = document.createElement("div");
				title.className = "text-sm font-semibold mb-1";
				title.textContent = season.name;

				const episodes = document.createElement("div");
				episodes.className = "text-xs text-black-400";
				episodes.textContent = `${season.episode_count} Episodes`;

				content.appendChild(title);
				content.appendChild(episodes);
				card.appendChild(image);
				card.appendChild(content);
				seasonList.appendChild(card);
			});


			document.getElementById("item-revenue").textContent =
			data.revenue ? `$${data.revenue.toLocaleString()}` : "N/A";

			document.getElementById("item-languages").textContent =
			data.spoken_languages.map(lang => lang.english_name).join(", ") || "N/A";

			document.getElementById("item-rating-age").textContent = data.adult ? "17+" : "All Age";

			if (data?.adult) {
				document.getElementById("item-rating-age").textContent = "17+";
				document.getElementById("item-rating-age").className = "inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full";
			} else {
				document.getElementById("item-rating-age").textContent = "All ages";
				document.getElementById("item-rating-age").className = "inline-block px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full";
			}
		});
	});

	// MOVIE DETAIL PART

	$(document).on("click", ".list-movie", function () {
		const movieId = $(this).data("id");

		let backdropImages = [];
		
		updateMovieDetailPageIdAndUrl(`-${movieId}`);
		$("#itemSimilarTitle").text("Similar movies you'd like");

		$.getJSON(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=edfccf752de0d09758c56e652809912b&include_adult=true`, function(data) {
			$("#itemListSimilar").html("");

			$.each(data.results, function(){
				const imageUrl = this['poster_path'] == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + this['poster_path'];

				if (data.results.length < 1 && currentPage < 2) {
					$("#itemListSimilar").append("<li class='flex-li'>Data not found</li>");
				}
				$("#itemListSimilar").append("<li class = 'list-movie' data-id='"+this['id']+"'><a href='#item-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = "+imageUrl+"></img></a><br><p class = 'list-movie-title'><b>Title : </b>"+truncateLongTitle(this['title'], 30)+"</p><b>Rating : </b>⭐ "+this['vote_average']+"/10</li>");
			});
		});

		$.getJSON(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=edfccf752de0d09758c56e652809912b`, function(data) {
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

		$.getJSON(`https://api.themoviedb.org/3/movie/${movieId}?api_key=edfccf752de0d09758c56e652809912b&include_adult=true`, function(data) {
			const imageUrl = data.poster_path == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
  						: "https://image.tmdb.org/t/p/w500" + data.poster_path;

			document.getElementById("item-title").textContent = data.title;
			document.getElementById("item-release").textContent = data.release_date;
			document.getElementById("item-rating").textContent = `⭐ ${data.vote_average}/10`;
			document.getElementById("item-poster").src = imageUrl;
			document.getElementById("item-bg").src = imageUrl;

  			setGenresAndOverview(data);

			document.getElementById("item-tagline").textContent = data.tagline || "No tagline available.";

			const productionList = document.getElementById("item-production");
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


			document.getElementById("item-revenue").textContent =
			data.revenue ? `$${data.revenue.toLocaleString()}` : "N/A";

			document.getElementById("item-languages").textContent =
			data.spoken_languages.map(lang => lang.english_name).join(", ") || "N/A";

			document.getElementById("item-rating-age").textContent = data.adult ? "17+" : "All Age";

			if (data?.adult) {
				document.getElementById("item-rating-age").textContent = "17+";
				document.getElementById("item-rating-age").className = "inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full";
			} else {
				document.getElementById("item-rating-age").textContent = "All ages";
				document.getElementById("item-rating-age").className = "inline-block px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full";
			}
		});
	});

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
			span.className = "px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full text-xs shadow transition-all";
			span.textContent = genre.name;
			genreContainer.appendChild(span);
		});
	}

});