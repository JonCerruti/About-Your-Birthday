var searchFormEl = document.querySelector('#search-form');

function handleSearchFormSubmit(event) { 
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }
  
  var queryString = './birthday-results.html?q=' + searchInputVal + '&format=events';
  localStorage.setItem('dates', JSON.stringify({date: searchInputVal, searchParams: 'events',  readMore:'' }));
  location.assign(queryString);
}
 searchFormEl.addEventListener('submit', handleSearchFormSubmit);
// adding datepicker to improve date inputs
$( function() {
  $( "#search-input" ).datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange:"-110:+0",
    maxDate:"+0D"
  });
} );