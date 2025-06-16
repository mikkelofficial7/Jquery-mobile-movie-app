document.addEventListener("DOMContentLoaded", function () {
	let type = "";
	let id = "";

	if (isLocalEnv) {
		const params = new URLSearchParams(window.location.search);
		type = params.get('type');
		id = params.get('id');

	} else {
		const path = window.location.pathname;
		const segments = path.split('/').filter(Boolean);

		if (segments.length === 3 && segments[0] === "detail") {
			type = segments[1];
			id = segments[2];
		}
	}

	if (type.toLowerCase() === "movie") {
		runDetailMovieData(id)
	} else if (type.toLowerCase() === "tv") {
		runDetailTvShowData(id)
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