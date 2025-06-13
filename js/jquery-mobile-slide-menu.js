(function($){
  $.fn.slideMenu = function(options) {
    options = $.extend({
      duration: 500,
      easing: 'linear'
    }, options);
    
    return this.each(function() {
      var obj = $(this);
      var menuStatus = false;

      // Toggle Menu Button
      $(document).on('click', 'a.showMenu', function(e) {
        e.preventDefault();
        if (!menuStatus) {
          $('#side-menu').css('visibility', 'visible');
          $('.ui-page-active').animate({
            marginLeft: '185px'
          }, options.duration, options.easing, function() {
            menuStatus = true;
          });
        } else {
          $('.ui-page-active').animate({
            marginLeft: '0px'
          }, options.duration, options.easing, function() {
            menuStatus = false;
          });
        }
      });

      // Swipe gestures
      // $(document).on('swipeleft', '.pages', function(e) {
      //   if (menuStatus) {
      //     $('.ui-page-active').animate({
      //       marginLeft: '0px'
      //     }, options.duration, options.easing, function() {
      //       menuStatus = false;
      //       $('#side-menu').css('marginTop', $('#side-menu').scrollTop());
      //     });
      //   }
      // });

      // $(document).on('swiperight', '.pages', function(e) {
      //   if (!menuStatus) {
      //     $('#side-menu').css('marginTop', $(window).scrollTop());
      //     $('#side-menu').css('visibility', 'visible');
      //     $('.ui-page-active').animate({
      //       marginLeft: '165px'
      //     }, options.duration, options.easing, function() {
      //       menuStatus = true;
      //     });
      //   }
      // });

      // Intercept menu link clicks
      $(document).on('click', '#side-menu li a', function(e) {
        var $link = $(this);
        var target = $link.attr('href');
        var transition = $link.data('transition') || 'none';

        // Only intercept internal page transitions
        if (target && target.startsWith('#')) {
          e.preventDefault();

          $('#side-menu li').removeClass('active');
          $link.parent().addClass('active');

          $('.ui-page-active').animate({
            marginLeft: '0px'
          }, options.duration, options.easing, function() {
            menuStatus = false;
            $('#side-menu').css('visibility', 'hidden');
            $.mobile.changePage(target, {
              transition: transition
            });
          });
        }
      });

      // Intercept button inside active/current page
      $(document).on('click', '.btn-inside-active', function(e) {
        var $link = $(this);
        var target = $link.attr('href');
        var transition = $link.data('transition') || 'none';

        // Only intercept internal page transitions
        if (target && target.startsWith('#')) {
          e.preventDefault();

          $('#side-menu li').removeClass('active');
          $link.parent().addClass('active');

          $('.ui-page-active').animate({
            marginLeft: '0px'
          }, options.duration, options.easing, function() {
            menuStatus = false;
            $('#side-menu').css('visibility', 'hidden');
            $.mobile.changePage(target, {
              transition: transition
            });
          });
        }
      });

      // Logout handler
      $(document).on('click', '.item-logout', function(e) {
        $('#side-menu li').removeClass('active');
        $('.ui-page-active').animate({
          marginLeft: '0px'
        }, options.duration, options.easing, function() {
          menuStatus = false;
          $('#side-menu').css({
            'visibility': 'hidden',
            'marginTop': $(window).scrollTop()
          });
        });
      });

      // Scroll handler
      $(document).on('click', '#btn-up', function() {
        $('#side-menu').css('marginTop', $(window).scrollTop(10));
      });
    });
  };
})(jQuery);
