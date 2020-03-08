var $ = function (selector) {
  return document.querySelector(selector);
};

var $$ = function (selector) {
  return document.querySelectorAll(selector);
};

var debounce = function (func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

var DEBOUNCE_DELAY_FOR_SCROLL = 80;

document.addEventListener('DOMContentLoaded', function () {
  var elSitenav = $('.sitenav');
  var elSitenavToggler = $('.sitenav__toggler');
  var elIntroVideoWrapper = $('.intro__video-wrapper');
  var elVideoPlayButton = $('.intro__play-button');
  var elIntroVideo = $('.intro__video');
  
  // Open sitenav if JS is disabled
  elSitenav.classList.remove('sitenav--nojs');
  
  // Fixed sitenav
  var makeSitenavFixed = function () {
    elSitenav.classList.add('sitenav--fixed');
    document.body.style.cssText = 'padding-top: ' + elSitenav.offsetHeight + 'px;';
  };

  var makeSitenavStatic = function () {
    elSitenav.classList.remove('sitenav--fixed');
    document.body.style.cssText = 'padding-top: 0;';
  };
  
  var onWindowScroll = function () {
    if (window.scrollY > elSitenav.offsetHeight) {
      makeSitenavFixed();
    } else {
      makeSitenavStatic();
    }
  };
  
  // Toggle sitenav__collapse
  var onElSitenavTogglerClick = function () {
    elSitenav.classList.toggle('sitenav--open');
  };

  // Control video player
  var pauseVideo = function () {
    elIntroVideoWrapper.classList.remove('intro__video-wrapper--playing');
    elIntroVideo.controls = false;

    elIntroVideo.removeEventListener('pause', onElIntroVideoPause);
  };

  var onElIntroVideoPause = function () {
    pauseVideo();
  };

  var playIntroVideo = function () {
    elIntroVideoWrapper.classList.add('intro__video-wrapper--playing');
    elIntroVideo.controls = true;
    elIntroVideo.play();

    elIntroVideo.addEventListener('pause', onElIntroVideoPause);
  };

  var onElVideoPlayButtonClick = function () {
    playIntroVideo();
  };
  
  window.addEventListener('scroll', debounce(onWindowScroll, DEBOUNCE_DELAY_FOR_SCROLL));
  elSitenavToggler.addEventListener('click', onElSitenavTogglerClick);
  elVideoPlayButton.addEventListener('click', onElVideoPlayButtonClick);

  // Slider
  var slider = tns({
    container: '.companies__list',
    nav: false,
    items: 1,
    slideBy: 1,
    autoplay: false,
    mouseDrag: true,
    swipeAngle: false,
    loop: true,
    responsive: {
      480: {
        items: 2,
        slideBy: 2
      },
      680: {
        items: 3,
        slideBy: 3
      },
      900: {
        items: 4,
        slideBy: 4
      },
      1200: {
        items: 5,
        slideBy: 5
      }
    }
  });
});
