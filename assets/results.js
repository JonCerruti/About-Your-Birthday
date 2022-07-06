var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');



// function getParams() {
//   // Get the search params out of the URL (i.e. `?q=london&format=photo`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
//   var searchParamsArr = document.location.search.split('&');

//   // Get the query and format values
//   var query = searchParamsArr[0].split('=').pop();
//   var format = searchParamsArr[1].split('=').pop();

//   searchApi(query, format);
// }

function printResults(resultObj) {
  console.log(resultObj);

  // set up `<div>` to hold result content
  var resultCard = document.createElement('div');
  resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

  var resultBody = document.createElement('div');
  resultBody.classList.add('card-body');
  resultCard.append(resultBody);

  var titleEl = document.createElement('h3');
  titleEl.textContent = resultObj.title;

  var bodyContentEl = document.createElement('p');
  bodyContentEl.innerHTML =
    '<strong>Year:</strong> ' + resultObj.year + '<br/>';

  if (resultObj.text) {
    bodyContentEl.innerHTML +=
      '<strong>Subjects:</strong> ' + resultObj.text + '<br/>';
  } else {
    bodyContentEl.innerHTML +=
      '<strong>Subjects:</strong> No subject for this entry.';
  }

  // if (resultObj.description) {
  //   bodyContentEl.innerHTML +=
  //     '<strong>Description:</strong> ' + resultObj.description[0];
  // } else {
  //   bodyContentEl.innerHTML +=
  //     '<strong>Description:</strong>  No description for this entry.';
  // }

  var linkButtonEl = document.createElement('a');
  linkButtonEl.textContent = 'Read More';
  linkButtonEl.setAttribute('href', resultObj.pages[0].content_urls.desktop.page);
  linkButtonEl.classList.add('btn', 'btn-dark');

  resultBody.append(titleEl, bodyContentEl, linkButtonEl);

  resultContentEl.append(resultCard);
}

function searchApi() {
  var locQueryUrl = 'https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/';
  var queryType = "births";
  var queryDate = "06/30";
  
  
 locQueryUrl += queryType + "/" + queryDate;

 fetch(locQueryUrl)
 .then(response => response.json())
 .then (data => console.log(data[queryDate]))
  // if (format) {
  //   locQueryUrl = 'https://www.loc.gov/' + format + '/?fo=json';
  // }

  // locQueryUrl = locQueryUrl + '&q=' + query;

  fetch(locQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (locRes) {
      // write query to page so user knows what they are viewing
      // resultTextEl.textContent = locRes.search.query;

      console.log(locRes);

    

      if (!locRes.length) {
        console.log('No results found!');
        resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
      } else {
        resultContentEl.textContent = '';
        for (var i = 0; i < locRes.length; i++) {
          printResults(locRes[i]);
        }
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;
  var formatInputVal = document.querySelector('#format-input').value;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  searchApi(searchInputVal, formatInputVal);
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);

// determine zodiac sign
function getZodiac(date) {
  var dateComparison = moment(date,"MM/DD/YYYY");
  var yearOfComparison = dateComparison.year()
  if(dateComparison.isBetween(moment("03/21/"+yearOfComparison,"MM/DD/YYYY"),moment("04/19/"+yearOfComparison,"MM/DD/YYYY"),'days','[]')){
    return 'aires';
  } else if(dateComparison.isBetween(moment("04/20/"+yearOfComparison,"MM/DD/YYYY"),moment("05/20/"+yearOfComparison,"MM/DD/YYYY"),'days','[]')){
    return 'taurus';
  } else if(dateComparison.isBetween(moment("05/21/"+yearOfComparison,"MM/DD/YYYY"),moment("06/20/"+yearOfComparison,"MM/DD/YYYY"),'days','[]')){
    return 'gemini';
  } else if(dateComparison.isBetween(moment("06/21/"+yearOfComparison,"MM/DD/YYYY"),moment("07/22/"+yearOfComparison,"MM/DD/YYYY"),'days','[]')){
    return 'cancer';
  } else if(dateComparison.isBetween(moment("07/23/"+yearOfComparison,"MM/DD/YYYY"),moment("08/22/"+yearOfComparison,"MM/DD/YYYY"),'days','[]')){
    return 'leo';
  } else if(dateComparison.isBetween(moment("08/23/"+yearOfComparison,"MM/DD/YYYY"),moment("09/22/"+yearOfComparison,"MM/DD/YYYY"),'days','[]')){
    return 'virgo';
  } else if(dateComparison.isBetween(moment("09/23/"+yearOfComparison,"MM/DD/YYYY"),moment("10/22/"+yearOfComparison,"MM/DD/YYYY"),'days','[]')){
    return 'libra';
  } else if(dateComparison.isBetween(moment("10/23/"+yearOfComparison,"MM/DD/YYYY"),moment("11/21/"+yearOfComparison,"MM/DD/YYYY"),'days','[]')){
    return 'scorpio';
  } else if(dateComparison.isBetween(moment("11/22/"+yearOfComparison,"MM/DD/YYYY"),moment("12/21/"+yearOfComparison,"MM/DD/YYYY"),'days','[]')){
    return 'sagittarius';
  } else if(dateComparison.isBetween(moment("12/22/"+yearOfComparison,"MM/DD/YYYY"),moment("01/19/"+yearOfComparison,"MM/DD/YYYY"),'days','[]')){
    return 'capricorn';
  } else if(dateComparison.isBetween(moment("01/20/"+yearOfComparison,"MM/DD/YYYY"),moment("02/18/"+yearOfComparison,"MM/DD/YYYY"),'days','[]')){
    return 'aquarius';
  } else {
    return 'pices';
  }
}
// adding datepicker to improve date inputs
$( function() {
  $( "#search-input" ).datepicker({
    changeMonth: true,
    changeYear: true
  });
} );


// getParams();
searchApi();




