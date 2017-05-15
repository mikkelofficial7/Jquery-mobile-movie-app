//Upcoming Movies : http://api.themoviedb.org/3/movie/upcoming?api_key=edfccf752de0d09758c56e652809912b
$(document).ready(function(){
	$.getJSON("http://api.themoviedb.org/3/movie/upcoming?api_key=edfccf752de0d09758c56e652809912b", function(data){
		$.each(data.results, function(){
			$("#movieList").append("<li class = 'list-movie'><a href='#'><img alt='Poster' class = 'poster-movie' src = https://image.tmdb.org/t/p/w300_and_h450_bestv2"+this['poster_path']+"></img></a><br><b>Title : </b>"+this['title']+"</li>");
		});
	});
});