let isLocalEnv = false;

document.addEventListener("DOMContentLoaded", function () {
	const baseUrl = window.location.origin;
	isLocalEnv = !baseUrl.includes("vercel.app");

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