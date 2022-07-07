var searchFormEl = document.querySelector('#search-form');


var birthday;
//local storage
if(!localStorage.getItem('dates')) {
console.log('dates not present setting value')
 localStorage.setItem('dates', JSON.stringify([{date: 'searchInputVal', searchParams: 'formalInputVal',  readMore:'' }]));
 birthday = localStorage.getItem("dates")
}else{
  console.log("retrieving variables");
  birthday = localStorage.getItem("dates");
  }
  console.log(JSON.parse(birthday));


function handleSearchFormSubmit(event) { 
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;
  var formatInputVal = document.querySelector('#format-input').value;
console.log('searchInputVal', searchInputVal);
  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  var queryString = './birthday-results.html?q=' + searchInputVal + '&format=' + formatInputVal;

  location.assign(queryString);
}
 searchFormEl.addEventListener('submit', handleSearchFormSubmit);
