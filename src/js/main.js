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
var ESC_KEYCODE = 27;
var REVIEW_VIDEO_LINK;

document.addEventListener('DOMContentLoaded', function () {
  var elSitenav = document.querySelector('.sitenav');
  var elSitenavToggler = document.querySelector('.sitenav__toggler');
  var elIntroVideoWrapper = document.querySelector('.intro__video-wrapper');
  var elVideoPlayButton = document.querySelector('.intro__play-button');
  var elIntroVideo = document.querySelector('.intro__video');
  var elsReviewOpener = document.querySelectorAll('.review__opener');
  var elsReviewVideoButton = document.querySelectorAll('.review__video-button');
  var elsReviewCloseButton = document.querySelectorAll('.review__close-button');
  var elModal = document.querySelector('.modal');
  var elModalCloseButton = document.querySelector('.modal__close-button');
  var elModalIframe = document.querySelector('.modal__youtube-iframe');
  
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
  var playIntroVideo = function (iframeSource) {
    elIntroVideoWrapper.classList.add('intro__video-wrapper--playing');
    elIntroVideo.src = iframeSource + '?autoplay=1';
  };

  var onElVideoPlayButtonClick = function (evt) {
    var iframeSource = evt.target.closest('.intro__play-button').dataset.youtubeIframe;
    playIntroVideo(iframeSource);
  };

  // LEARNING PROCESS TIMELINE
  var elsLearningProcessTimeline = document.querySelector('.learning-process__timeline');
  var elsLearningProcessLine = document.querySelector('.learning-process__hover-line');
  var elsLearningProcessStep = document.querySelectorAll('.learning-process__step');

  var removeActiveStepClasses = function () {
    elsLearningProcessStep.forEach(function (processStep) {
      processStep.classList.remove('learning-process__step--active');
    });
  };

  var addActiveStepClasses = function (hoveredItemOrder) {
    elsLearningProcessStep.forEach(function (processStep, index) {
      if (index + 1 > hoveredItemOrder) {
        return;
      }

      processStep.classList.add('learning-process__step--active');
    });
  };

  var setElProcessLineWidth = function (evt) {
    elsLearningProcessLine.style.width = evt.screenX - elsLearningProcessTimeline.offsetLeft + 'px';
  };

  var onProcessStepMouseOver = function (evt) {
    var hoveredItemOrder = parseInt(evt.target.dataset.step, 10);
    addActiveStepClasses(hoveredItemOrder);
    setElProcessLineWidth(evt);
  };

  var onProcessStepMouseLeave = function (evt) {
    elsLearningProcessLine.style.width = 0;
    removeActiveStepClasses();
  };

  if (document.documentElement.clientWidth >= 690) {
    elsLearningProcessStep.forEach(function (processStep) {
      processStep.addEventListener('mouseover', onProcessStepMouseOver);
      processStep.addEventListener('mouseleave', onProcessStepMouseLeave);
    });
  }

  // Opening and closing reviews
  var openReview = function (evt) {
    evt.target.closest('.review').classList.add('review--open');
  };

  var onReviewOpenerClick = function (evt) {
    openReview(evt);
  };

  var closeReview = function (evt) {
    evt.target.closest('.review').classList.remove('review--open');
  };

  var onReviewCloseButtonClick = function (evt) {
    closeReview(evt);
  };

  var addReviewsEventListeners = function () {
    elsReviewOpener.forEach(function (reviewOpener) {
      reviewOpener.addEventListener('click', onReviewOpenerClick);
    });
  
    elsReviewCloseButton.forEach(function (reviewCloseButton) {
      reviewCloseButton.addEventListener('click', onReviewCloseButtonClick);
    });
  };

  var removeReviewsEventListeners = function () {
    elsReviewOpener.forEach(function (reviewOpener) {
      reviewOpener.removeEventListener('click', onReviewOpenerClick);
    });

    elsReviewCloseButton.forEach(function (reviewCloseButton) {
      reviewCloseButton.removeEventListener('click', onReviewCloseButtonClick);
    });
  };

  var onWindowResize = function () {
    if (document.documentElement.clientWidth >= 775) {
      addReviewsEventListeners();
    } else {
      removeReviewsEventListeners();
    }
  };

  // Modal opening and closing
  var closeModal = function () {
    elModal.classList.remove('modal--open');

    elModal.removeEventListener('click', onElModalClick);
    elModalCloseButton.removeEventListener('click', onElModalCloseButtonClick);
    document.removeEventListener('keyup', onDocumentKeyUp);

    elModalIframe.src = REVIEW_VIDEO_LINK;
  };

  var onElModalClick = function (evt) {
    if (evt.target.matches('.modal')) {
      closeModal();
    }
  };

  var onElModalCloseButtonClick = function () {
    closeModal();
  };

  var onDocumentKeyUp = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeModal();
    }
  };

  var openModal = function () {
    elModal.classList.add('modal--open');

    elModal.addEventListener('click', onElModalClick);
    elModalCloseButton.addEventListener('click', onElModalCloseButtonClick);
    document.addEventListener('keyup', onDocumentKeyUp);
  };

  // Open review videos in modal
  var showReviewVideo = function (evt) {
    REVIEW_VIDEO_LINK = 'https://www.youtube-nocookie.com/embed/' + evt.target.parentElement.dataset.youtubeId;
    elModalIframe.src = REVIEW_VIDEO_LINK + '?autoplay=1';
  };

  var onElReviewVideoButtonClick = function (evt) {
    openModal();
    showReviewVideo(evt);
  };

  elsReviewVideoButton.forEach(function (reviewVideoButton) {
    reviewVideoButton.addEventListener('click', onElReviewVideoButtonClick);
  });
  
  window.addEventListener('scroll', debounce(onWindowScroll, DEBOUNCE_DELAY_FOR_SCROLL));
  window.addEventListener('resize', onWindowResize);
  elSitenavToggler.addEventListener('click', onElSitenavTogglerClick);
  if (elVideoPlayButton) {
    elVideoPlayButton.addEventListener('click', onElVideoPlayButtonClick);
  }
  addReviewsEventListeners();

  // Slider
  if (document.querySelector('.promo-slider__list')) {
    var promoSlider = tns({
      container: '.promo-slider__list',
      nav: true,
      controls: false,
      items: 1,
      slideBy: 1,
      autoplay: true,
      autoplayButtonOutput: false,
      mouseDrag: true,
      swipeAngle: false,
      loop: true
    });
  }

  if (document.querySelector('.companies__list')) {
    var companiesSlider = tns({
      container: '.companies__list',
      nav: false,
      items: 1,
      slideBy: 1,
      autoplay: false,
      mouseDrag: true,
      swipeAngle: false,
      loop: true,
      prevButton: '.slider-button--prev',
      nextButton: '.slider-button--next',
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
  }
});
