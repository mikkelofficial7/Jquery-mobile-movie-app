document.addEventListener("DOMContentLoaded", function () {
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