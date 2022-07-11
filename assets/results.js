var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
var priorSearchDiv = $('#previous-searches');



function getParams() {
  // Get the search params out of the URL (i.e. `?q=london&format=photo`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
  var searchParamsArr = document.location.search.split('&');

  // Get the query and format values
  var query = searchParamsArr[0].split('=').pop();
  var format = searchParamsArr[1].split('=').pop();
  // show search
  renderPriorSearch();

  searchApi(query, format);
}

function printResults(resultObj, queryType) {
  console.log(resultObj);
  console.log(queryType);

  // set up `<div>` to hold result content
  var resultCard = document.createElement('div');
  resultCard.classList.add('rounded-lg','border-gray-400','border-2','m-2','p-2', 'text-white','bg-teal-600');

  var resultBody = document.createElement('div');
  resultCard.append(resultBody);

  var bodyContentEl = document.createElement('p');
  // formatting specific to Births/Deaths/Events data
  if(queryType=='births' || queryType == 'deaths' || queryType == 'selected'){
    bodyContentEl.innerHTML =
    '<strong><span class="text-xl">Year:</span></strong> ' + resultObj.year + '<br/>';
    if (resultObj.text) {
      bodyContentEl.innerHTML +=
        '<strong><span class="text-xl">Subject:</span></strong> ' + resultObj.text + '<br/>';
    } else {
      bodyContentEl.innerHTML +=
        '<strong>Subject:</strong> No subject for this entry.';
    }
    var linkButtonEl = document.createElement('a'); // there is a button link to wikipedia to access more info
    linkButtonEl.textContent = 'Read More';
    linkButtonEl.setAttribute('href', resultObj.pages[0].content_urls.desktop.page);
    linkButtonEl.classList.add('bg-gray-500', 'hover:bg-gray-700', 'text-white','font-bold', 'rounded','m-1','p-2');
    resultBody.append(bodyContentEl, linkButtonEl);
  // formatting specific for sunrise/sunset data
  } else if(queryType == 'results'){
    bodyContentEl.innerHTML =
    '<strong><span class="text-xl">Sunrise:</span></strong> ' + resultObj.sunrise + '<br/>';
    if (resultObj.sunset) {
      bodyContentEl.innerHTML +=
        '<strong><span class="text-xl">Sunset:</span></strong> ' + resultObj.sunset + '<br/>';
    } else {
      bodyContentEl.innerHTML +=
        '<strong>No subject for this entry</strong>';
    }
    resultBody.append(bodyContentEl);
  // formatting specific for holidays data
  } else if (queryType=='holidays'){
    bodyContentEl.innerHTML =
    '<strong><span class="text-xl">Holiday:</span></strong> ' + resultObj.text + '<br/>';
    var linkButtonEl = document.createElement('a'); // there is a button link to wikipedia to access more info
    linkButtonEl.textContent = 'Read More';
    linkButtonEl.setAttribute('href', resultObj.pages[0].content_urls.desktop.page);
    linkButtonEl.classList.add('bg-gray-500', 'hover:bg-gray-700', 'text-white','font-bold', 'rounded','m-3','p-2');
    resultBody.append(bodyContentEl, linkButtonEl);
  // formatting specific for the horoscope data
  } else if (queryType== 'horoscope'){
    bodyContentEl.innerHTML +=
    '<strong><span class="text-xl">Horoscope:</span></strong> ' + resultObj.description + '<br/>';
    bodyContentEl.innerHTML +=
    '<strong><span class="text-xl">Most Compatible With:</span></strong> ' + resultObj.compatibility + '<br/>';
    bodyContentEl.innerHTML +=
    '<strong><span class="text-xl">Color:</span></strong> ' + resultObj.color + '<br/>';
    bodyContentEl.innerHTML +=
    '<strong><span class="text-xl">Lucky Number:</span></strong> ' + resultObj.lucky_number + '<br/>';
    
    resultBody.append(bodyContentEl);
    } else {
      bodyContentEl.innerHTML +=
        '<strong>No subject for this entry</strong>';
    
    
  }

  bodyContentEl.classList.add('m-2');

  resultContentEl.append(resultCard);
}

function searchApi(queryDate, queryType) {
  var queryString = 'https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/';
  var queryHelper = {}
  // Dates needed for output formatting
  var wikiDate = moment(queryDate,"MM/DD/YYYY").format("MM/DD");
  var sunDate = moment(queryDate,"MM/DD/YYYY").format("YYYY-MM-DD");
  var resultWikiDate = moment(queryDate,"MM/DD/YYYY").format("MMMM Do");
  var resultSunDate = moment(queryDate,"MM/DD/YYYY").format("MMMM Do, YYYY");
  
  // format the querystring to the specific API
  if(queryType=="sunrise"){
      queryString = "https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400&date=";
      queryString += sunDate;
      // changes to match json api result
      queryType="results";
      // update showing results for
      resultTextEl.textContent = "Sunrise/Sunset on "+resultSunDate;
  } else if (queryType=="horoscope"){
      queryString = "https://aztro.sameerkumar.website/?sign=";
      queryString += getZodiac(queryDate)+"&day=today";
      queryHelper = {method:"POST"}; // needed to get horoscope
      // update showing results for
      resultTextEl.textContent = getZodiac(queryDate).charAt(0).toUpperCase() + getZodiac(queryDate).slice(1)+" Zodiac Sign";
  } else if (queryType=="events"){
      queryType = 'selected';
      queryString += queryType+"/"+wikiDate;
      // update showing results for
      resultTextEl.textContent = "Events on "+resultWikiDate;
  } else{
      queryString += queryType+"/"+wikiDate;
      // update showing results for
      resultTextEl.textContent = queryType.charAt(0).toUpperCase() + queryType.slice(1)+" on "+resultWikiDate;
  }
  fetch(queryString, queryHelper)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (data) {
      // write query to page so user knows what they are viewing
      console.log(data);
      if (!data) { // if nothing is found
        console.log('No results found!');
        resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
      } else if(queryType=="horoscope"){ // formatting the return results specific for the API
          resultContentEl.textContent = '';
          printResults(data,queryType);
      } else if(queryType=="results"){
          resultContentEl.textContent = '';
          printResults(data[queryType],queryType);
      } else{
          resultContentEl.textContent = '';
          // Only want to display 15 results at most
          var dataLength = data[queryType].length;
          var selectionArray = [];
          if(dataLength>15){
          // randomizer so the results are unique for each search if there are more than 15
            while(selectionArray.length<15){
              var r = Math.floor(Math.random()*dataLength);
              if(selectionArray.indexOf(r) === -1) selectionArray.push(r);
            }
            selectionArray.forEach(indexValue =>{
              printResults(data[queryType][indexValue],queryType);
            })
          } else {
            resultContentEl.textContent = '';
            for(i=0;i<data[queryType].length;i++){
              printResults(data[queryType][i],queryType);
            }
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

  // review local Storage
  var priorSearch = localStorage.getItem('dates');

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }
  // render prior search
  if(localStorage.getItem('dates')){
    renderPriorSearch();
    if(searchInputVal!=priorSearch.date || formatInputVal != priorSearch.searchParams){
      localStorage.setItem('dates', JSON.stringify({date: searchInputVal, searchParams: formatInputVal,  readMore:'' }));
    }
    //renderPriorSearch();
  }
  // update local with new search
  
// run search
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
    changeYear: true,
    yearRange:"-110:+0",
    maxDate:"+0D"
  });
} );

function renderPriorSearch () {
  // clear existing
  $('.past-search').remove();
  // create new elements
  var priorQuery = localStorage.getItem('dates');
  priorQuery = JSON.parse(priorQuery);

  var priorQueryDate = priorQuery.date;
  var priorQueryType = priorQuery.searchParams.charAt(0).toUpperCase() + priorQuery.searchParams.slice(1);
  var newSearch = $('<div>').addClass('past-search rounded-full border-2 m-2 p-2 bg-zinc-700 text-white');
  newSearch.text(priorQueryDate+' - '+priorQueryType)
  // append element to prior search
  priorSearchDiv.append(newSearch);
  // add eventlistener
  $('.past-search').on('click',function(){
    renderPriorSearch();
    searchApi(priorQueryDate,priorQueryType)
  });
}

getParams();





