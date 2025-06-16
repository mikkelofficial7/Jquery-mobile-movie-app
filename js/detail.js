document.addEventListener("DOMContentLoaded", function () {
	console.log(window.location.pathname);
	const path = window.location.pathname;
	const segments = path.split('/').filter(Boolean);

	if (segments.length === 3 && segments[0] === "detail") {
		const type = segments[1];
		const id = segments[2];

		if (type.toLowerCase() === "movie") {
			runDetailMovieData(id)
		} else if (type.toLowerCase() === "tv") {
			runDetailTvShowData(id)
		}
	}
});

$(document).on("click", "#goToRealPage", function () {
	window.location.href = getBaseUrl();
});

$(document).on("click", "#copyLink", function () {
	navigator.clipboard.writeText(window.location.href)
		.then(() => {})
		.catch(() => {})
});