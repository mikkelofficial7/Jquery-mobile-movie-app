(function($){
	$.fn.slideMenu = function(options) {
		// If options exist, merge them with the default settings
		options = $.extend({
			duration:	500,
			easing:	'linear'
		}, options);
		
		return this.each(function() {
			var obj = $(this);
			
			var menuStatus = false;
			
			$(document).on('click', 'a.showMenu', function(e) {
				if(!menuStatus){
					$('#side-menu').css('visibility','visible');
					$('.ui-page-active').animate({
						marginLeft: '165px',
					}, options.duration, options.easing, function(){menuStatus = true});
					return false;
				} else {
					$('.ui-page-active').animate({
						marginLeft: '0px',
					}, options.duration, options.easing, function(){menuStatus = false});
					return false;
				}
			});
		
			$(document).on('swipeleft', '.pages', function(e) {
				if (menuStatus){
					$('.ui-page-active').animate({
						marginLeft: '0px',
					}, options.duration, options.easing, function(){menuStatus = false; $('#side-menu').css('marginTop', $('#side-menu').scrollTop());});
				}
			});
		
			$(document).on('swiperight', '.pages', function(e) {
				if (!menuStatus){
					$('#side-menu').css('marginTop', $(window).scrollTop(0));
					$('#side-menu').css('visibility','visible');
					$('.ui-page-active').animate({
						marginLeft: '165px',
					}, options.duration, options.easing, function(){menuStatus = true; });
				}
			});
		
			$('#side-menu li a').click(function(){
				var p = $(this).parent();
				if($(p).hasClass('active')){
					$('#side-menu li').removeClass('active');
					$('#side-menu').css('visibility','visible');
					$('.ui-page-active').animate({
						marginLeft: '0px',
					}, options.duration, options.easing, function(){menuStatus = false});
				} else {
					$('#side-menu li').removeClass('active');
					$('#side-menu').css('visibility','visible');
					$('.ui-page-active').animate({
						marginLeft: '0px',
					}, options.duration, options.easing, function(){menuStatus = false; $('#side-menu').css('marginTop', $(window).scrollTop(0));});
					$(p).addClass('active');
				}
				menuStatus = false;
			});
			$('.item-logout').click(function(){
				$('#side-menu li').removeClass('active');
				$('#side-menu').css('visibility','hidden');
				$(p).addClass('active');
				$('.ui-page-active').animate({
					marginLeft: '0px',
				}, options.duration, options.easing, function(){menuStatus = false; $('#side-menu').css('marginTop', $(window).scrollTop());});
			});
			$('#btn-up').click(function(){
				$('#side-menu').css('marginTop', $(window).scrollTop(10));
			});
		});
	};
})(jQuery);