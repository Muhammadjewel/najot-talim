var $ = function (selector) {
  return document.querySelector(selector);
};

var $$ = function (selector) {
  return document.querySelectorAll(selector);
};

document.addEventListener('DOMContentLoaded', function () {
  var elSitenav = $('.sitenav');
  var elSitenavToggler = $('.sitenav__toggler');
  
  // Open sitenav if JS is disabled
  elSitenav.classList.remove('sitenav--nojs');

  var onElSitenavTogglerClick = function () {
    elSitenav.classList.toggle('sitenav--open');
  };

  elSitenavToggler.addEventListener('click', onElSitenavTogglerClick);
});
