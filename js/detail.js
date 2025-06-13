const path = window.location.pathname;
const segments = path.split('/').filter(Boolean);

console.log(path);

if (segments.length === 3 && segments[0] === "detail") {
	const type = segments[1];
	const id = segments[2];

	console.log("Type:", type);
	console.log("ID:", id);

	if (type === "movie") {
		runDetailMovieData(id)
	} else if (type === "tv") {
		runDetailTvShowData(id)
	}
}

function runDetailMovieData(movieId) {
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