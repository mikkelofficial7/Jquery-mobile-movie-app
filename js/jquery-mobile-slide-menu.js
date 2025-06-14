$(document).ready(function () {
  const hash = window.location.hash;

  $('#side-menu ul li.menu-item a[href]').each(function () {
    const linkHref = $(this).attr('href');
    if (linkHref === hash) {
      $(this).parent().addClass('active');
    } else {
       $('#side-menu ul li.menu-item:first').addClass('active');
    }
  });
});

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
      $(document).on('click', '.btn-inside-movie', function(e) {
        var $link = $("#section-inside-movie a");
        var target = $link.attr('href');
        var transition = $link.data('transition') || 'none';

        // Only intercept internal page transitions
        if (target && target.startsWith('#')) {
          e.preventDefault();

          $('#side-menu li').removeClass('active');

          $('#side-menu li a').each(function() {
            const href = $(this).attr('href');
            if (href === target) {
              $(this).parent().addClass('active');
            }
          });


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

      $(document).on('click', '.btn-inside-tv', function(e) {
        var $link = $("#section-inside-tv a");
        var target = $link.attr('href');
        var transition = $link.data('transition') || 'none';

        // Only intercept internal page transitions
        if (target && target.startsWith('#')) {
          e.preventDefault();

          $('#side-menu li').removeClass('active');

          $('#side-menu li a').each(function() {
            const href = $(this).attr('href');
            if (href === target) {
              $(this).parent().addClass('active');
            }
          });


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
  };
})(jQuery);
