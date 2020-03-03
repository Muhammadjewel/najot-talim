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
  
  // Open sitenav if JS is disabled
  elSitenav.classList.remove('sitenav--nojs');
  
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
  
  var onElSitenavTogglerClick = function () {
    elSitenav.classList.toggle('sitenav--open');
  };
  
  window.addEventListener('scroll', debounce(onWindowScroll, DEBOUNCE_DELAY_FOR_SCROLL));
  elSitenavToggler.addEventListener('click', onElSitenavTogglerClick);
});
