//Upcoming Movies : http://api.themoviedb.org/3/movie/upcoming?api_key=edfccf752de0d09758c56e652809912b
$(document).ready(function(){
	$.getJSON("http://api.themoviedb.org/3/movie/upcoming?api_key=edfccf752de0d09758c56e652809912b", function(data){
		$.each(data.results, function(){
			$("#movieListUpcoming").append("<li class = 'list-movie' data-id='"+this['id']+"'><a href='#movie-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = https://image.tmdb.org/t/p/w300_and_h450_bestv2"+this['poster_path']+"></img></a><br><b>Title : </b>"+this['title']+"</li>");
		});
	});

	$.getJSON("http://api.themoviedb.org/3/movie/top_rated?api_key=edfccf752de0d09758c56e652809912b", function(data){
		$.each(data.results, function(){
			$("#movieListTopRated").append("<li class = 'list-movie' data-id='"+this['id']+"'><a href='#movie-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = https://image.tmdb.org/t/p/w300_and_h450_bestv2"+this['poster_path']+"></img></a><br><b>Title : </b>"+this['title']+"</li>");
		});
	});

	$.getJSON("http://api.themoviedb.org/3/movie/popular?api_key=edfccf752de0d09758c56e652809912b", function(data){
		$.each(data.results, function(){
			$("#movieListPopular").append("<li class = 'list-movie' data-id='"+this['id']+"'><a href='#movie-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = https://image.tmdb.org/t/p/w300_and_h450_bestv2"+this['poster_path']+"></img></a><br><b>Title : </b>"+this['title']+"</li>");
		});
	});

	$.getJSON("http://api.themoviedb.org/3/movie/now_playing?api_key=edfccf752de0d09758c56e652809912b", function(data){
		$.each(data.results, function(){
			$("#movieListNowPlaying").append("<li class = 'list-movie' data-id='"+this['id']+"'><a href='#movie-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = https://image.tmdb.org/t/p/w300_and_h450_bestv2"+this['poster_path']+"></img></a><br><b>Title : </b>"+this['title']+"</li>");
		});
	});

	$(document).on("click", ".menu-item", function () {
		updateMovieDetailPageIdAndUrl("")
	});

	$(document).on("click", ".btn-search", function () {
		const keyword = $("#et-search").val();

		if (keyword != "") {
			$.getJSON('https://api.themoviedb.org/3/search/movie?query="'+keyword+'"&api_key=edfccf752de0d09758c56e652809912b', function(data) {
				$.each(data.results, function(){
					$("#movieListSearch").append("<li class = 'list-movie' data-id='"+this['id']+"'><a href='#movie-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = https://image.tmdb.org/t/p/w300_and_h450_bestv2"+this['poster_path']+"></img></a><br><b>Title : </b>"+this['title']+"</li>");
				});
			});
		} else {
			alert("keyword cannot be empty!")
		}
	});

	$(document).on("click", ".list-movie", function () {
		const movieId = $(this).data("id");
		updateMovieDetailPageIdAndUrl(`-${movieId}`);

		$.getJSON(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=edfccf752de0d09758c56e652809912b`, function(data) {
			$.each(data.results, function(){
				$("#movieListSimilar").append("<li class = 'list-movie' data-id='"+this['id']+"'><a href='#movie-detail-"+this['id']+"'><img alt='Poster' class = 'poster-movie' src = https://image.tmdb.org/t/p/w300_and_h450_bestv2"+this['poster_path']+"></img></a><br><b>Title : </b>"+this['title']+"</li>");
			});
		});

		$.getJSON(`https://api.themoviedb.org/3/movie/${movieId}?api_key=edfccf752de0d09758c56e652809912b`, function(data) {
			document.getElementById("movie-title").textContent = data.title;
			document.getElementById("movie-release").textContent = data.release_date;
			document.getElementById("movie-rating").textContent = `⭐ ${data.vote_average}`;
			document.getElementById("movie-poster").src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
			document.getElementById("movie-bg").src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;

  			setGenresAndOverview(data);

			document.getElementById("movie-tagline").textContent = data.tagline || "No tagline available.";

			const productionList = document.getElementById("movie-production");
				productionList.innerHTML = "";

				data.production_companies.forEach(company => {
				const li = document.createElement("li");
				li.className = "flex items-center gap-2 mb-2 bg-white/80 rounded-lg px-4 py-2 shadow-sm";

				// Create logo image if available
				if (company.logo_path) {
					const img = document.createElement("img");
					img.src = `https://image.tmdb.org/t/p/w92${company.logo_path}`;
					img.alt = `${company.name} Logo`;
					img.className = "w-10 h-auto object-contain";
					li.appendChild(img);
				} else {
					const img = document.createElement("img");
					img.src = `https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg`;
					img.alt = `${company.name} Logo`;
					img.className = "w-10 h-auto object-contain";
					li.appendChild(img);
				}

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