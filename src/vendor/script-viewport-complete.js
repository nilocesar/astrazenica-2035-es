(function () {
  $.fn.isInViewportComplete = function (options) {
    var BASE = {};
    var settings = $.extend(
      {
        call: undefined,
        released: false,
        container: "body",
        porcentagem: 0,
        completeVerify: false,
      },
      options
    );

    BASE.SETTINGS = settings;
    BASE.THIS = this;

    var elm = $(BASE.THIS);

    // Se for com base em porcentagem
    if (
      elm.is("body") ||
      elm.is("html") ||
      elm[0] === window ||
      elm[0] === document
    ) {
      var compen = BASE.SETTINGS.porcentagem / 100;
      elm.on("scroll", function () {
        var scrollHeight = $(document).height();
        var scrollPosition = elm.height() + elm.scrollTop();

        if ((scrollHeight - scrollPosition) / scrollHeight <= compen) {
          if (!BASE.SETTINGS.completeVerify) {
            BASE.SETTINGS.call();
            BASE.SETTINGS.completeVerify = true;
          }
        }else{
          BASE.SETTINGS.completeVerify = false;
        }
      });
    }
    // Se for com base em uma DIV na viewport
    else {
      function isInViewport(_this) {
        try {
          // Se o elemento não for visível, retorna falso imediatamente
          if (!_this.is(":visible")) return false;

          var $div = _this;
          var windowTop = $(window).scrollTop();
          var windowBottom = windowTop + $(window).height();
          var divTop = $div.offset().top;
          var divBottom = divTop + $div.outerHeight();

          return divBottom >= windowTop && divTop <= windowBottom;
        } catch (e) {
          console.log(e);
          return false;
        }
      }

      $(BASE.SETTINGS.container).on("resize scroll", function () {
        if ($(BASE.THIS).length <= 0) return false;

        if (isInViewport($(BASE.THIS))) {
          if (BASE.SETTINGS.released) {
            BASE.SETTINGS.call(BASE.THIS);
          } else {
            if (!BASE.SETTINGS.completeVerify) {
              BASE.SETTINGS.call(BASE.THIS);
              BASE.SETTINGS.completeVerify = true;
            }
          }
        }else{
          if (BASE.SETTINGS.completeVerify) {
            BASE.SETTINGS.completeVerify = false;
          }
        }
      });
    }
  };
})(jQuery);
