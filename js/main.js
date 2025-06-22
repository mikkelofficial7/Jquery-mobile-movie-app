let isLocalEnv = false;
var availableLanguage = [];
var listReviewMovieData = [];
var listReviewTvShowData = [];
const castGender = ["Not Set", "Female", "Male", "Non Binary"];

const scrollAmount = 320;

var currentPageUpcoming = 1;
var currentPageTopRated = 1;
var currentPagePopular = 1;
var currentPageNowPlaying = 1;
var currentPageSearch = 1;
var currentPageGenreSearch= 1;
var tv_currentPageNowPlaying = 1;
var tv_currentPagePopular = 1;
var tv_currentPageTopRated = 1;
var currentPageReview = 1;

document.addEventListener("DOMContentLoaded", function () {
	const baseUrl = window.location.origin;
	isLocalEnv = !baseUrl.includes("vercel.app");
});

$(document).ready(function(){
	if (window.location.pathname.includes("/detail/")) {
		autoScroll("item-movie-trending-today")
		autoScroll("item-tv-trending-today")
		autoScroll("item-cast-trending-today")
		autoScroll("item-reviews-trending-today")
	}

	runAllLanguageProvided()
	runMovieTrendingTodayList()
	runTvTrendingTodayList()
	runCastTrendingTodayList()
	runMovieGenreList()
	runTvGenreList()

	runDetailMovieData()
	runDetailTvShowData()
	runDetailCastData()
	runReviewList()

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
			showSnackBar(2500, "Keyword cannot be empty!", "#fc0404")
		}
	});

	$(document).on("click", "#btn-load-more-search", function () {
		const keyword = $("#et-search").val();
		currentPageSearch += 1;

		if (keyword != "") {
			runSearchList(currentPageSearch, keyword)
		} else {
			showSnackBar(2500, "Keyword cannot be empty!", "#fc0404")
		}
	});

	// HYPERLINK CAST AND DETAIL

	$(document).on("click", "#externalLink", function () {
		var currentActiveDetailId = $(this).attr("data-slug");
		var currentActiveDetailDisplayType = $(this).attr("data-ref");
		var externalOpenNewTabUrl = getExternalDetailPageUrl(currentActiveDetailDisplayType, currentActiveDetailId);

		window.open(externalOpenNewTabUrl, "_blank");
	});

	$(document).on("click", "#externalLinkCast", function () {
		var currentActiveDetailId = $(this).attr("data-slug");
		var currentActiveDetailDisplayType = $(this).attr("data-ref");
		var externalOpenNewTabUrl = getExternalDetailPageUrl(currentActiveDetailDisplayType, currentActiveDetailId);

		window.open(externalOpenNewTabUrl, "_blank");
	});

	// MOVIE AND TV SHOW DETAIL PART

	$(document).on("click", ".list-tv-movie", function () {		
		var currentActiveDetailId = $(this).attr("data-slug");
		var currentActiveDetailDisplayType = $(this).attr("data-ref");

		if (currentActiveDetailDisplayType == "tv") {
			runDetailTvShowData(currentActiveDetailId)
		} else if (currentActiveDetailDisplayType == "movie") {
			runDetailMovieData(currentActiveDetailId);
		}
	});

	// CAST DETAIL PART

	$(document).on("click", ".list-cast", function () {
		var currentActiveDetailId = $(this).attr("data-slug");		
		runDetailCastData(currentActiveDetailId);
	});

	// LOAD MORE REVIEW
	$(document).on("click", ".btn-review-home", function () {
		currentPageReview = 1;

		var id = $(this).attr("data-slug");
		var displayType = $(this).attr("data-ref");
		var itemPoster = $(this).attr("data-image");
		var title = $(this).attr("data-title-name");

		const imageUrl = itemPoster == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
						: baseImageLoad + itemPoster;

		$("#review-movie-title").text(title);
		$("#review-movie-poster").attr("src", imageUrl);
		$("#review-movie-poster-bg").attr("src", imageUrl);

		$("#btn-load-more-all-review").attr("data-ref", displayType);
		$("#btn-load-more-all-review").attr("data-slug", id);
		
		$("#review-list").html("");
		$("#load-more-all-review").removeClass("hidden");
		runReviewList(id, displayType, "#review-list", currentPageReview, 50, 250, true, (listReview) => {})
	});

	$(document).on("click", "#btn-load-more-review", function () {
		currentPageReview = 1;

		var id = $(this).attr("data-slug");
		var displayType = $(this).attr("data-ref");
		var itemPoster = $(this).attr("data-image");
		var title = $(this).attr("data-title-name");

		const imageUrl = itemPoster == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
						: baseImageLoad + itemPoster;

		$("#review-movie-title").text(title);
		$("#review-movie-poster").attr("src", imageUrl);
		$("#review-movie-poster-bg").attr("src", imageUrl);

		$("#btn-load-more-all-review").attr("data-ref", displayType);
		$("#btn-load-more-all-review").attr("data-slug", id);
		
		$("#review-list").html("");
		$("#load-more-all-review").removeClass("hidden");
		runReviewList(id, displayType, "#review-list", currentPageReview, 50, 250, true, (listReview) => {})
	});

	$(document).on("click", "#btn-load-more-all-review", function () {
		currentPageReview += 1;
		var id = $(this).attr("data-slug");
		var displayType = $(this).attr("data-ref");

		runReviewList(id, displayType, "#review-list", currentPageReview, 50, 250, true, (listReview) => {
			if (listReview.length < 1) {
				$("#load-more-all-review").addClass("hidden");
			} else {
				$("#load-more-all-review").removeClass("hidden");
			}
		})
	});

	$(document).on("click", ".review-read-more", function () {
  		const $clickedSpan = $(this);
  		const $parentParagraph = $clickedSpan.closest('p');

		const $fullText = $(this).siblings('.review-full-text');
		$parentParagraph.text($fullText.text());
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
		listReviewMovieData = data.results.map(item => ({
			id: item.id,
			name: item.title,
			poster_path: item.poster_path
		}));

		$.each(data.results, function() {	
			const posterList = document.querySelector("#item-movie-trending-today");
			posterList.innerHTML = "";

			data.results.forEach(data => {
				const imageUrl = data.poster_path == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
						: baseImageLoad + data.poster_path;
				
				const slide = document.createElement("div");
				slide.className = "list-tv-movie relative w-1/3 h-[200px] flex-shrink-0 overflow-hidden flex items-center justify-center shadow-lg";
				slide.setAttribute("data-slug", data.id);
				slide.setAttribute("data-ref", "movie");

				// Background overlay
				const img_bg = document.createElement("img");
				img_bg.className = "absolute inset-0 w-full h-full object-cover rounded z-0";
				img_bg.src = imageUrl;
				img_bg.alt = `${data.poster_path} Logo`;

				const overlay = document.createElement("div");
				overlay.className = "absolute inset-0 bg-black bg-opacity-50 rounded z-10";

				const background = document.createElement("div");
				background.className = "absolute inset-0 rounded overflow-hidden";
				background.appendChild(img_bg);
				background.appendChild(overlay);

				slide.appendChild(background);

				// Anchor tag
				const a = document.createElement("a");
				a.href = "#item-detail";
				a.className = "relative z-10 flex items-center justify-center";

				// Centered and sized image
				const img = document.createElement("img");
				img.className = "w-[100px] h-[150px] object-cover rounded";
				img.src = imageUrl;
				img.alt = `${data.poster_path} Logo`;

				a.appendChild(img);

				// Caption
				const caption = document.createElement("p");
				caption.className = "absolute bottom-2 left-2 text-[#f8f8ff] text-xs bg-black bg-opacity-60 px-2 py-1 rounded z-20";
				caption.textContent = data.title || "Movie Title";

				// Append elements
				slide.appendChild(caption);
				slide.appendChild(a);
				posterList.appendChild(slide);
			});
		});

		runReviewListHome(listReviewMovieData, "movie", 1)
	});
}

async function runTvTrendingTodayList() {
	const apikey = await decryptString(ciphertext, iv, password);

	$.getJSON("https://api.themoviedb.org/3/trending/tv/day?api_key="+apikey, function(data){
		listReviewTvShowData = data.results.map(item => ({
			id: item.id,
			name: item.name,
			poster_path: item.poster_path
		}));

		$.each(data.results, function(){	
			const posterList = document.querySelector("#item-tv-trending-today");
			posterList.innerHTML = "";

			data.results.forEach(data => {
				const imageUrl = data.poster_path == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
						: baseImageLoad + data.poster_path;
				
				const slide = document.createElement("div");
				slide.className = "list-tv-movie relative w-1/3 h-[200px] flex-shrink-0 overflow-hidden flex items-center justify-center shadow-lg";
				slide.setAttribute("data-slug", data.id);
				slide.setAttribute("data-ref", "tv");

				// Background overlay
				const img_bg = document.createElement("img");
				img_bg.className = "absolute inset-0 w-full h-full object-cover rounded z-0";
				img_bg.src = imageUrl;
				img_bg.alt = `${data.poster_path} Logo`;

				const overlay = document.createElement("div");
				overlay.className = "absolute inset-0 bg-black bg-opacity-50 rounded z-10";

				const background = document.createElement("div");
				background.className = "absolute inset-0 rounded overflow-hidden";
				background.appendChild(img_bg);
				background.appendChild(overlay);

				slide.appendChild(background);

				// Anchor tag
				const a = document.createElement("a");
				a.href = "#item-detail";
				a.className = "relative z-10 flex items-center justify-center";

				// Centered and sized image
				const img = document.createElement("img");
				img.className = "w-[100px] h-[150px] object-cover rounded";
				img.src = imageUrl;
				img.alt = `${data.poster_path} Logo`;

				a.appendChild(img);

				// Caption
				const caption = document.createElement("p");
				caption.className = "absolute bottom-2 left-2 text-[#f8f8ff] text-xs bg-black bg-opacity-60 px-2 py-1 rounded z-20";
				caption.textContent = data.name || "TV Show Title";

				// Append elements
				slide.appendChild(caption);
				slide.appendChild(a);
				posterList.appendChild(slide);
			});
		});

		runReviewListHome(listReviewTvShowData, "tv", 1)
	});
}

async function runCastTrendingTodayList() {
	const apikey = await decryptString(ciphertext, iv, password);

	$.getJSON("https://api.themoviedb.org/3/trending/person/day?api_key="+apikey, function(data){
		$.each(data.results, function(){	
			const posterList = document.querySelector("#item-cast-trending-today");
			posterList.innerHTML = "";

			data.results.forEach(data => {
				const imageUrl = data.profile_path == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
						: baseImageLoad + data.profile_path;
				
				const slide = document.createElement("div");
				slide.className = "list-cast relative w-1/3 h-[200px] flex-shrink-0 overflow-hidden flex items-center justify-center shadow-lg";
				slide.setAttribute("data-slug", data.id);
				slide.setAttribute("data-ref", "cast");

				// Background overlay
				const img_bg = document.createElement("img");
				img_bg.className = "absolute inset-0 w-full h-full object-cover rounded z-0";
				img_bg.src = imageUrl;
				img_bg.alt = `${data.poster_path} Logo`;

				const overlay = document.createElement("div");
				overlay.className = "absolute inset-0 bg-black bg-opacity-50 rounded z-10";

				const background = document.createElement("div");
				background.className = "absolute inset-0 rounded overflow-hidden";
				background.appendChild(img_bg);
				background.appendChild(overlay);

				slide.appendChild(background);

				// Anchor tag
				const a = document.createElement("a");
				a.href = "#item-cast";
				a.className = "relative z-10 flex items-center justify-center";

				// Centered and sized image
				const img = document.createElement("img");
				img.className = "w-[100px] h-[150px] object-cover rounded";
				img.src = imageUrl;
				img.alt = `${data.poster_path} Logo`;

				a.appendChild(img);

				// Caption
				const caption = document.createElement("p");
				caption.className = "absolute bottom-2 left-2 text-[#f8f8ff] text-xs bg-black bg-opacity-60 px-2 py-1 rounded z-20";
				caption.textContent = data.name || "Cast Name";

				// Append elements
				slide.appendChild(caption);
				slide.appendChild(a);
				posterList.appendChild(slide);
			});
		});
	});
}

async function getMovieReviewApi(id, displayType, page, onComplete = () => {}) {
  const apikey = await decryptString(ciphertext, iv, password);

  return $.getJSON(`https://api.themoviedb.org/3/${displayType}/${id}/reviews?page=${page}&api_key=${apikey}`)
    .then(data => {
      	onComplete(data);
      	return data;
    });
}

async function runReviewListHome(listOfData = [], displayType = "", page = 1) {
	if (listOfData.length < 1 && window.location.hash == "#item-all-review") {
		window.location.href = document.referrer;
		return;
	}

	let listReview = [];

	const fetchAllReviews = () => {
		const promises = listOfData.map(dataContent => {
			return getMovieReviewApi(dataContent.id, displayType, page)
			.then(data => {
				if (data.results.length >= 2) {
					const resultReview = {
						id: dataContent.id,
						name: dataContent.name,
						poster_path: dataContent.poster_path,
						reviews: data.results
					}

					listReview.push(resultReview);
				}
			});
		});

		return Promise.all(promises);
	};

	fetchAllReviews().then(() => {		
		if (listReview.length < 1) return;

		const takeOnly = listReview
					.sort()
					.slice(0, 20);
		
		takeOnly.forEach(itemReviews => {
			const imageUrl = itemReviews.poster_path == null
			? "https://connectkaro.org/wp-content/uploads/2019/03/placeholder-profile-male-500x500.png"
			: baseImageLoad + itemReviews.poster_path;

			const container = document.createElement("div");
			container.className = "relative h-[300px] w-[380px] rounded-xl m-2 shrink-0 btn-review-home";
			container.setAttribute("data-slug", itemReviews.id)
			container.setAttribute("data-ref", displayType)
			container.setAttribute("data-image", itemReviews.poster_path)
			container.setAttribute("data-title-name", itemReviews.name)

			const image_bg = document.createElement("img");
			image_bg.src = imageUrl;
			image_bg.className = "w-full h-full object-cover rounded shadow-lg opacity-50 backdrop-blur-lg";

			container.appendChild(image_bg);

			const imageWrapper = document.createElement("div");
			imageWrapper.className = "absolute top-[20px] left-[120px] w-[150px] h-[250px] flex justify-center items-center";

			const image = document.createElement("img");
			image.src = imageUrl;
			image.className = "w-full h-full object-cover rounded shadow-lg";

			const a = document.createElement("a");
			a.href = "#item-all-review";
			a.appendChild(image);

			imageWrapper.appendChild(a);
			container.appendChild(imageWrapper);

			container.appendChild(createReviewBox("top-[70px] w-[150px] left-[10px] z-20 shadow-lg", itemReviews.reviews[0].author_details.username, itemReviews.name, itemReviews.reviews[0].author_details.rating));
			container.appendChild(createReviewBox("bottom-[70px] w-[150px] right-[10px] z-30 shadow-lg", itemReviews.reviews[1].author_details.username, itemReviews.name, itemReviews.reviews[1].author_details.rating));

			$("#item-reviews-trending-today").append(container);
		});
	});

	function createReviewBox(positionClasses, username, movieTitle, ratingStar) {
		const wrapper = document.createElement("div");
		wrapper.className = `absolute ${positionClasses} text-sm z-20 rounded-sm shadow`;

		const card = document.createElement("div");
		card.className = "max-w-sm p-2 bg-[#f8f8ff] rounded-xl shadow-md space-y-1";

		const name = document.createElement("div");
		name.className = "text-[10px] text-gray-500";
		name.textContent = truncateLongTitle("@"+username, 15);

		const title = document.createElement("div");
		title.className = "text-[12px] font-semibold text-gray-800";
		title.textContent = truncateLongTitle(movieTitle, 20);

		const starContainer = document.createElement("div");
		starContainer.className = "flex items-center space-x-1 text-[#121212]";

		var rate = ratingStar == null || ratingStar == "" ? "0" : ratingStar
		const starFull = "⭐";
		starContainer.innerHTML = `${starFull} ${rate}/10`;

		card.appendChild(name);
		card.appendChild(title);
		card.appendChild(starContainer);

		wrapper.appendChild(card);
			return wrapper;
	}
}

async function runReviewList(id = "", displayType = "", parentList = "", page = 1, maxItem = 10, maxCommentLength = 150, addReadMoreButton = false, onComplete = () => {}) {
	if (id == "" && window.location.hash == "#item-all-review") {
		window.location.href = document.referrer;
		return;
	}

	getMovieReviewApi(id, displayType, page, (data) => {
		if (data.results.length < 1 && page < 2) {
			$(parentList).html("No Reviews");
		}

		createElementReviewList(data.results, parentList, maxItem, maxCommentLength, addReadMoreButton);
		onComplete(data.results);
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
		createElementDataNotFound("#movieListSearch")
	}

	if (totalMovieFound.length > 0 || totalTvFound.length > 0) {
		const loadMoreSection = document.getElementById('load-more-section-search');
		loadMoreSection.classList.remove('hidden');
	} else {
		const loadMoreSection = document.getElementById('load-more-section-search');
		loadMoreSection.classList.add('hidden');
	}
}

var selectedMovieGenreId = []
var selectedTvGenreId = []
let movieGenre = [];
let tvGenre = [];

async function runMovieGenreList() {	
	const apikey = await decryptString(ciphertext, iv, password);

	$.getJSON('https://api.themoviedb.org/3/genre/movie/list?api_key='+apikey, function(data) {
		movieGenre = data.genres;
		populateItemGenre();
	});

	$("#movieGenreList").on("click", "li", function () {
		const index = $(this).index(); // Get the index of clicked <li>
		runSelectedGenreMovie(index)
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

	$("#genre-tags").on("click", "span", function () {
		const id = $(this).attr("data-genre-id");
		const displayType = $(this).attr("data-genre-tag");

		if (displayType === "movie") {
			selectedMovieGenreId = [];
			const i = movieGenre.findIndex(item => item.id === Number(id));
			runSelectedGenreMovie(i)
		}
	});
}

async function runSelectedGenreMovie(index) {
	const apikey = await decryptString(ciphertext, iv, password);

	currentPageGenreSearch = 1;
	selectedTvGenreId = [];
	
	if (movieGenre[index]) {
		if (selectedMovieGenreId.includes(movieGenre[index].id)) {
			const i = selectedMovieGenreId.indexOf(movieGenre[index].id);
			selectedMovieGenreId.splice(i, 1); 
		} else {
			selectedMovieGenreId.push(movieGenre[index].id);
		}
		populateItemGenre();
		
		const section = document.getElementById('load-more-section-genre-list');
		section.classList.add('hidden');
		
		$("#GenreListSearch").html("");
		if (selectedMovieGenreId.length < 1) return

		$.getJSON('https://api.themoviedb.org/3/discover/movie?api_key='+apikey+'&with_genres='+selectedMovieGenreId.join(","), function(data) {
			$.each(data.results, function(index, item){
				createItemElementMovieTvShow("GenreListSearch", item, "movie");
			});

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
}

async function runTvGenreList() {
	const apikey = await decryptString(ciphertext, iv, password);
	
	$.getJSON('https://api.themoviedb.org/3/genre/tv/list?api_key='+apikey, function(data) {
		tvGenre = data.genres;
		populateItemGenre();
	});

	$("#tvGenreList").on("click", "li", function () {
		const index = $(this).index(); // Get the index of clicked <li>
		runSelectedGenreTv(index)
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

	$("#genre-tags").on("click", "span", function () {
		const id = $(this).attr("data-genre-id");
		const displayType = $(this).attr("data-genre-tag");

		if (displayType === "tv") {
			selectedTvGenreId = []
			const i = tvGenre.findIndex(item => item.id === Number(id));
			runSelectedGenreTv(i)
		}
	});
}

async function runSelectedGenreTv(index) {
	const apikey = await decryptString(ciphertext, iv, password);

	currentPageGenreSearch = 1;
	selectedMovieGenreId = [];

	if (tvGenre[index]) {
		if (selectedTvGenreId.includes(tvGenre[index].id)) {
			const i = selectedTvGenreId.indexOf(tvGenre[index].id);
			selectedTvGenreId.splice(i, 1); 
		} else {
			selectedTvGenreId.push(tvGenre[index].id);	 
		}
		populateItemGenre();

		const section = document.getElementById('load-more-section-genre-list');
		section.classList.add('hidden');

		$("#GenreListSearch").html("");
		if (selectedTvGenreId.length < 1) return

		$.getJSON('https://api.themoviedb.org/3/discover/tv?api_key='+apikey+'&with_genres='+selectedTvGenreId.join(","), function(data) {				
			$.each(data.results, function(index, item){
				createItemElementMovieTvShow("GenreListSearch", item, "tv")
			});

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
}

async function populateItemGenre() {
	const apikey = await decryptString(ciphertext, iv, password);
	
	$('#movieGenreList li').remove();
	$.each(movieGenre, function(index, movieGenre){
		const li = document.createElement("li");

		if (selectedMovieGenreId.includes(this['id'])) {
			li.className = "bg-gradient-to-b from-[#5e87b0] to-[#355f89] px-4 py-2 rounded-[30px] text-[#f8f8ff] item-click-genre-active";
		} else {
			li.className = "bg-gradient-to-b from-[#5e87b0] to-[#355f89] px-4 py-2 rounded-[30px] text-[#f8f8ff] item-click-genre";
		}

		li.setAttribute("data-genre-id", this['id']);
		li.textContent = this['name']

		const parentList = document.getElementById("movieGenreList");
		parentList.appendChild(li);
	});

	$('#tvGenreList li').remove();
	$.each(tvGenre, function(){
		const li = document.createElement("li");

		if (selectedTvGenreId.includes(this['id'])) {
			li.className = "bg-gradient-to-b from-[#5e87b0] to-[#355f89] px-4 py-2 rounded-[30px] text-[#f8f8ff] item-click-genre-active";
		} else {
			li.className = "bg-gradient-to-b from-[#5e87b0] to-[#355f89] px-4 py-2 rounded-[30px] text-[#f8f8ff] item-click-genre";
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

function setGenresAndOverview(data, displayType, isDisplayOnly) {
	document.getElementById("item-overview").textContent = data.overview.length < 1 ? "No overview is available" : data.overview;

	const genreContainer = document.getElementById("genre-tags");
	genreContainer.innerHTML = "";

	if (data.genres < 1) {
		const span = document.createElement("span");
		span.className = "px-4 py-1 bg-[#fc0404] hover:bg-[#cb0606] text-[#f8f8ff] font-medium rounded-full text-xs shadow transition-all item-genre-tv-movie-unknown";
		span.textContent = "Unknown genre";
		genreContainer.appendChild(span);
	} else {
		data.genres.forEach(genre => {
			const a = document.createElement("a");
			a.href = isDisplayOnly ? "#" : "#find-genre";

			const span = document.createElement("span");
			span.className = "px-4 py-1 bg-[#6facd5] hover:bg-[#456f9a] text-[#121212] font-medium rounded-full text-xs shadow transition-all item-genre-tv-movie";
			span.setAttribute("data-genre-id", genre.id);
			span.setAttribute("data-genre-tag", displayType);
			span.textContent = genre.name;

			a.appendChild(span)
			genreContainer.appendChild(a);
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
	if (movieId == null && window.location.hash == "#item-detail") {
		window.location.href = document.referrer;
		return;
	}

	let backdropImages = [];

	var hrefCast = isDisplayOnly ? "#" : "#item-cast";
	var hrefSimilar = isDisplayOnly ? "#" : "#item-detail";
		
	$("#externalLink").attr("data-ref", "movie");
	$("#externalLink").attr("data-slug", movieId);

	$("#itemSimilarTitle").text("Similar movies you'd like");
	$("#item-reviews-title").text("What they said about this movie?");

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
			createItemElementMovieTvShow("itemListSimilar", item, "movie", hrefSimilar);
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
		setGenresAndOverview(data, "movie", isDisplayOnly);

		const imageUrl = data.poster_path == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: baseImageLoad + data.poster_path;

		document.getElementById("item-title").textContent = data.title;
		document.getElementById("item-release").textContent = convertDate(data.release_date);
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

		$("#btn-load-more-review").attr("data-ref", "movie");
		$("#btn-load-more-review").attr("data-slug", movieId);
		$("#btn-load-more-review").attr("data-image", data.poster_path);		
		$("#btn-load-more-review").attr("data-title-name", data.title);
	});

	$.getJSON("https://api.themoviedb.org/3/movie/"+movieId+"/external_ids?api_key="+apikey, function(dataId) {
		if (dataId.imdb_id !== null) {
			$.getJSON("https://api.themoviedb.org/3/find/"+dataId.imdb_id+"?api_key="+apikey+"&external_source=imdb_id", function(data) {
				const imageUrl = data.movie_results[0].poster_path == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
						: baseImageLoad + data.movie_results[0].poster_path;

				document.getElementById("item-title").textContent = data.movie_results[0].title;
				document.getElementById("item-release").textContent = convertDate(data.movie_results[0].release_date);
				document.getElementById("item-rating").textContent = `${Number(data.movie_results[0].vote_average.toFixed(1))}/10`;
				document.getElementById("item-poster").src = imageUrl;
				document.getElementById("item-bg").src = imageUrl;
			});
		}
	});

	$("#item-reviews").html("");
	
	runReviewList(movieId, "movie", "#item-reviews", 1, 3, 150, true, (listReview) => {
		if (listReview.length < 3) {
			$("#load-more-reviews").addClass("hidden")
		} else {
			$("#load-more-reviews").removeClass("hidden")
		}
  	})
}

async function runDetailTvShowData(tvShowId, isDisplayOnly = false) {
	if (tvShowId == null && window.location.hash == "#item-detail") {
		window.location.href = document.referrer;
		return;
	}

	let backdropImages = [];

	var hrefCast = isDisplayOnly ? "#" : "#item-cast";
	var hrefSimilar = isDisplayOnly ? "#" : "#item-detail";

	$("#externalLink").attr("data-ref", "tv");
	$("#externalLink").attr("data-slug", tvShowId);

	$("#itemSimilarTitle").text("Similar TV show you'd like");
	$("#item-reviews-title").text("What they said about this TV show?");

	$("#item-images-alternate").on("click", "li", function () {
		const index = $(this).index();
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
			createItemElementMovieTvShow("itemListSimilar", item, "tv", hrefSimilar);
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
		setGenresAndOverview(data, "tv", isDisplayOnly);

		const imageUrl = data.poster_path == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
						: baseImageLoad + data.poster_path;

		document.getElementById("item-title").textContent = data.name;
		document.getElementById("item-release").textContent = convertDate(data.first_air_date);
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

		$("#btn-load-more-review").attr("data-ref", "tv");
		$("#btn-load-more-review").attr("data-slug", tvShowId);
		$("#btn-load-more-review").attr("data-image", data.poster_path);
		$("#btn-load-more-review").attr("data-title-name", data.name);
	});

	$.getJSON("https://api.themoviedb.org/3/tv/"+tvShowId+"/external_ids?api_key="+apikey, function(dataId) {
		if(dataId.imdb_id !== null) {
			$.getJSON("https://api.themoviedb.org/3/find/"+dataId.imdb_id+"?api_key="+apikey+"&external_source=imdb_id", function(data) {
				const imageUrl = data.tv_results[0].poster_path == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
						: baseImageLoad + data.tv_results[0].poster_path;

				document.getElementById("item-title").textContent = data.tv_results[0].name;
				document.getElementById("item-release").textContent = convertDate(data.tv_results[0].first_air_date);
				document.getElementById("item-rating").textContent = `${Number(data.tv_results[0].vote_average.toFixed(1))}/10`;
				document.getElementById("item-poster").src = imageUrl;
			});
		}
	});

	$("#item-reviews").html("");

	runReviewList(tvShowId, "tv", "#item-reviews", 1, 3, 150, true, (listReview) => {
		if (listReview.length < 3) {
			$("#load-more-reviews").addClass("hidden")
		} else {
			$("#load-more-reviews").removeClass("hidden")
		}
  	})
}

async function runDetailCastData(castId, isDisplayOnly = false) {
	if (castId == null && window.location.hash == "#item-cast") {
		window.location.href = document.referrer;
		return;
	}

	var hrefMovie = isDisplayOnly ? "#" : "#item-detail";

	$("#externalLinkCast").attr("data-ref", "cast");
	$("#externalLinkCast").attr("data-slug", castId);

	const apikey = await decryptString(ciphertext, iv, password);

	$.getJSON("https://api.themoviedb.org/3/person/"+castId+"?api_key="+apikey, function(data) {
		const imageUrl = data.profile_path == null
						? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
						: baseImageLoad + data.profile_path;

		let birthAndDeathDay = "N/A";
		if (data.birthday !== null) {
			birthAndDeathDay = data.deathday == null ? convertDate(data.birthday) : convertDate(data.birthday)+" (Passed away at "+convertDate(data.deathday)+")"
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

				if (dataImdb.person_results[0].known_for.length > 0) {
					$("#cast-movies").html("");
				}

				$.each(dataImdb.person_results[0].known_for, function(index, item) {
					createItemElementMovieTvShow("cast-movies", item, item.media_type, hrefMovie);
				});
			});
		}
	});
}

function createElementReviewList(listReview, parentList, maxItem, maxCommentLength, addReadMoreButton) {
	const takeOnly = listReview
					.sort(() => Math.random() - 0.5)
					.slice(0, maxItem);
					
	takeOnly.forEach(function(data) {
		const imageUrl = data.author_details.avatar_path == null
			? "https://connectkaro.org/wp-content/uploads/2019/03/placeholder-profile-male-500x500.png"
			: baseImageLoad + data.author_details.avatar_path;
		
		const $li = $('<li>').addClass('bg-[#f8f8ff] rounded-xl p-4 flex flex-col shadow sm:flex-row gap-4');

		const $img = $('<img>')
		.attr('src', imageUrl)
		.attr('alt', 'Reviewer Photo')
		.addClass('w-24 h-36 object-cover rounded-lg mx-auto sm:mx-0 flex-shrink-0'); // keep image size stable

		const $content = $('<div>').addClass('flex-1 w-full');

		const $title = $('<h3>').addClass('text-xl font-semibold text-gray-800')
		.text(data.author_details.name + " (@" + data.author_details.username + ")");

		const $release = $('<p>').addClass('text-sm text-gray-500 mb-2')
		.text("Reviewed at " + convertIsoString(data.updated_at));

		var longReview = truncateLongTitle(data.content, maxCommentLength);
		
		const $review = $('<p>').addClass('text-gray-700 mb-2 whitespace-pre-wrap break-words')
		.html(longReview);
		
		if (addReadMoreButton && longReview.trim().endsWith("...")) {
			$review.append(
				$('<span>').text(data.content).addClass('hidden review-full-text'),
				$('<span>').text('Read more').addClass('text-blue-500 hover:underline cursor-pointer ml-2 mr-5 review-read-more')
			)
		}

		const $stars = $('<div>').addClass('text-black-500 flex items-center gap-2');
		$stars.append(
			$('<span>').text('⭐'),
			$('<span>').text(data.author_details.rating+"/10" ?? 'No Rating')
		);

		$content.append($title, $stars, $release, $review);
		$li.append($img, $content);

		$(parentList).append($li);
	});
}

function createElementReviewHome() {
	const container = document.createElement("div");
	container.addClass("relative w-full h-64 bg-gray-100");

	const items = [
		{ text: "1", class: "absolute top-0 left-0 bg-red-500 text-[#f8f8ff] p-4 z-10" },
		{ text: "2", class: "absolute top-8 left-8 bg-blue-500 text-[#f8f8ff] p-4 z-20" },
		{ text: "3", class: "absolute top-16 left-16 bg-green-500 text-[#f8f8ff] p-4 z-30" }
	];

	items.forEach(item => {
		const div = document.createElement("div");
		div.className = item.class;
		div.textContent = item.text;
		container.appendChild(div);
	});
}

function createItemElementMovieTvShow(parentName, item, displayType, hrefDestination = "#item-detail") {
	const imageUrl = item['poster_path'] == null
					? "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg"
					: baseImageLoad + item['poster_path'];
					
	const name = item['title'] || item['name'];

	const li = document.createElement("li");
	li.className = "list-tv-movie flex flex-col items-center justify-center text-center pt-4 pb-4";
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

	if (item["adult"]) {
		const badge = document.createElement("span");
		badge.textContent = "17+";
		badge.className = "absolute top-2 left-2 bg-red-600 text-[#f8f8ff] text-xs font-bold px-2 py-1 rounded";
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
	.addClass("list-cast flex flex-col items-center justify-center text-center py-4")
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

function createElementDataNotFound(parentName) {
	const container = document.querySelector(parentName);
	container.innerHTML = "";

	const wrapper = document.createElement("div");
	wrapper.className = "flex flex-col items-center justify-center text-center py-12";

	// Create SVG
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("class", "w-16 h-16 text-[#121212] mb-4");
	svg.setAttribute("fill", "none");
	svg.setAttribute("stroke", "currentColor");
	svg.setAttribute("stroke-width", "1.5");
	svg.setAttribute("viewBox", "0 0 24 24");

	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.setAttribute("stroke-linecap", "round");
	path.setAttribute("stroke-linejoin", "round");
	path.setAttribute("d", "M12 14v2m0-6.75V12m9 0a9 9 0 11-18 0 9 9 0 0118 0z");

	svg.appendChild(path);

	const heading = document.createElement("h2");
	heading.className = "text-lg font-semibold text-[#121212]";
	heading.textContent = "No Data Found";

	const paragraph = document.createElement("p");
	paragraph.className = "text-sm text-[#121212]";
	paragraph.textContent = "We couldn’t find what you’re looking for.";

	wrapper.appendChild(svg);
	wrapper.appendChild(heading);
	wrapper.appendChild(paragraph);

	container.appendChild(wrapper);
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

function convertIsoString(isoString) {
	const date = new Date(isoString);

	const options = { day: '2-digit', month: 'short', year: 'numeric' };
	const formattedDate = date.toLocaleDateString('en-GB', options);
	const forrmattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

	return formattedDate+" "+forrmattedTime;
}

function convertDate(input) {
	const date = new Date(input);

	const formatted = date.toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	});

	return formatted
}

function autoScroll(parentName, pixelPerFrame = 1) {
  const parent = document.getElementById(parentName).scrollLeft += pixelPerFrame;

  if (parent.scrollLeft >= parent.scrollWidth - parent.clientWidth) {
    parent.scrollLeft = 0;
  }

  requestAnimationFrame(() => autoScroll(parentName));
}