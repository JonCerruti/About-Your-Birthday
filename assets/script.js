var searchFormEl = document.querySelector('#search-form');

function handleSearchFormSubmit(event) { 
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;
  var formatInputVal = document.querySelector('#format-input').value;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }
  
  var queryString = './birthday-results.html?q=' + searchInputVal + '&format=' + formatInputVal;
  localStorage.setItem('dates', JSON.stringify({date: searchInputVal, searchParams: formalInputVal,  readMore:'' }));
  location.assign(queryString);
}
 searchFormEl.addEventListener('submit', handleSearchFormSubmit);
