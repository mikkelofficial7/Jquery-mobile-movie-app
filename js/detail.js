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
		$("#external-section-detail").removeClass("hidden");
		$("#external-section-cast").addClass("hidden");
		runDetailMovieData(id, true)

	} else if (type.toLowerCase() === "tv") {
		$("#external-section-detail").removeClass("hidden");
		$("#external-section-cast").addClass("hidden");
		runDetailTvShowData(id, true)

	} else if (type.toLowerCase() === "cast") {
		$("#external-section-detail").addClass("hidden");
		$("#external-section-cast").removeClass("hidden");
		runDetailCastData(id, true)
	}
});

$(document).on("click", "#goToRealPage", function () {
	window.location.href = getBaseUrl();
});

$(document).on("click", "#copyLink", function () {
	navigator.clipboard.writeText(window.location.href)
		.then(() => {
			showSnackBar(2500, "Link copied successfully!", "#00b120")
		})
		.catch(() => {
			showSnackBar(2500, "Failed to copy link!", "#fc0404")
		})
});

$(document).on("click", "#copyLinkCast", function () {
	navigator.clipboard.writeText(window.location.href)
		.then(() => {
			showSnackBar(2500, "Link copied successfully!", "#00b120")
		})
		.catch(() => {
			showSnackBar(2500, "Failed to copy link!", "#fc0404")
		})
});

function showSnackBar(duration, text, color) {
	$(".topSnackbar").html(text);
	$(".topSnackbar").removeClass("hidden");
	$(".topSnackbar").addClass("bg-["+color+"]");
	$(".topSnackbar").addClass("opacity-100");
	
	setTimeout(() => {
		$(".topSnackbar").removeClass("opacity-100");
		$(".topSnackbar").addClass("opacity-50");
	}, duration/3);

	setTimeout(() => {
		$(".topSnackbar").removeClass("opacity-50");
		$(".topSnackbar").addClass("opacity-30");
	}, duration/3);

	setTimeout(() => {
		$(".topSnackbar").removeClass("opacity-30");
		$(".topSnackbar").addClass("hidden");
	}, duration/3);
}