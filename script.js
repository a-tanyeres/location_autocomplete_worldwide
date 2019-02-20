var AUTOCOMPLETION_URL = 'https://autocomplete.geocoder.api.here.com/6.2/suggest.json',
    ajaxRequest = new XMLHttpRequest(),
    query = '';

var lastForm = ''
var APPLICATION_ID = 'Krh56ba4wyrwkFP166Bs', APPLICATION_CODE = 'e-eazuI0gKg_zLwL3j979w';

const cityInput = 'auto-complete-city';
const stateInput = 'auto-complete-state';
const countryInput = 'auto-complete-country';

/**
* After the DOM has been loaded, we add the <div> who gonna recieve the informations, select effect
*/
window.addEventListener("DOMContentLoaded", function() {
  // document.head.innerHTML += '<link rel="stylesheet" id="autocomplete-css" href="/wp-include/css/autocomplete.css" type="text/css" media="all">';
  node = document.getElementById('dialogCity');
  console.log(node);
  if (node == null) {
    g = document.createElement('div');
    g.setAttribute("id", "dialogCity");
    g.setAttribute("class", "dialog-autocomplete");
    document.getElementById(cityInput).parentNode.after(g, document.getElementById(cityInput));
  }
  node = document.getElementById('dialogState');

  if (node == null) {
    g = document.createElement('div');
    g.setAttribute("id", "dialogState");
    g.setAttribute("class", "dialog-autocomplete");
    document.getElementById(stateInput).parentNode.after(g, document.getElementById(stateInput));
  }
  node = document.getElementById('dialogCountry');

  if (node == null) {
    g = document.createElement('div');
    g.setAttribute("id", "dialogCountry");
    g.setAttribute("class", "dialog-autocomplete");
    document.getElementById(countryInput).parentNode.after(g, document.getElementById(countryInput));
  }

  document.getElementById(cityInput).setAttribute('autocomplete', 'off');
  document.getElementById(stateInput).setAttribute('autocomplete', 'off');
  document.getElementById(countryInput).setAttribute('autocomplete', 'off');
  document.getElementById(cityInput).setAttribute('onkeyup', 'return autoCompleteListener(this, event);');
  document.getElementById(stateInput).setAttribute('onkeyup', 'return autoCompleteListener(this, event);');
  document.getElementById(countryInput).setAttribute('onkeyup', 'return autoCompleteListener(this, event);');
}, false);

/**
 * If the text in the text box  has changed, and is not empty,
 * send a geocoding auto-completion request to the server.
 *
 * @param {Object} textBox the textBox DOM object linked to this event
 * @param {Object} event the DOM event which fired this listener
 */
function autoCompleteListener(textBox, event) {
  if (query != textBox.value){
    if (textBox.value.length >= 1){
      this.lastForm = textBox.id
      
      /**
      * A full list of available request parameters can be found in the Geocoder Autocompletion
      * API documentation.
      *
      */
      var params = '?' +
        'query=' +  encodeURIComponent(textBox.value) +   // The search text which is the basis of the query
        '&beginHighlight=' + encodeURIComponent('<b>') + //  Mark the beginning of the match in a token. 
        '&endHighlight=' + encodeURIComponent('</b>') + //  Mark the end of the match in a token. 
        '&maxresults=5' +  // The upper limit the for number of suggestions to be included 
                          // in the response.  Default is set to 5.
        '&app_id=' + APPLICATION_ID +
        '&app_code=' + APPLICATION_CODE +
        '&resultType=areas' +
        '&language=' + navigator.language || navigator.userLanguage;
      ajaxRequest.open('GET', AUTOCOMPLETION_URL + params );
      ajaxRequest.send();
    }
  }
  query = textBox.value;
}


/**
 *  This is the event listener which processes the XMLHttpRequest response returned from the server.
 */
function onAutoCompleteSuccess() {
 /*
  * The styling of the suggestions response on the map is entirely under the developer's control.
  * A representitive styling can be found the full JS + HTML code of this example
  * in the functions below:
  */
  clearOldSuggestions();
  addSuggestionsToPanel(this.response);  // In this context, 'this' means the XMLHttpRequest itself.
}

function clearOldSuggestions() {
  var myNode = document.getElementById('dialogCity');
  while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
  }
  myNode = document.getElementById('dialogState');
  while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
  }
  myNode = document.getElementById('dialogCountry');
  while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
  }
}

function addSuggestionsToPanel(response) {
  for (var i = 0; i < response.suggestions.length; i++) {
    var city = response.suggestions[i].address.city;
    var county = response.suggestions[i].address.state;
    var country = response.suggestions[i].address.country;
    city = String(city).replace('<b>','').replace('</b>','');
    county = String(county).replace('<b>','').replace('</b>','');
    country = String(country).replace('<b>','').replace('</b>','');
    var line = "'" + city + "', '" + county + "', '" + country + "'";
    var select;
    switch(lastForm) {
      case countryInput:
        select = "dialogCountry";
        break;
      case stateInput:
        select = "dialogState";
        break;
      default:
        select = "dialogCity";
    }
    document.getElementById(select).innerHTML += '<span class="dialog-line" onclick="setSelectionToInput('+line+')"><p>' + response.suggestions[i].label + '</p></span>';
  }
}

function setSelectionToInput(city, county, country) {
  clearOldSuggestions();
  if (city != 'undefined') {
    document.getElementById(cityInput).value = city;
  } else {
    document.getElementById(cityInput).value = '';
  }

  if (county != 'undefined') {
    document.getElementById(stateInput).value = county;
  } else {
    document.getElementById(stateInput).value = '';
  }

  if (country != 'undefined') {
    document.getElementById(countryInput).value = country;
  } else {
    document.getElementById(countryInput).value = '';
  }
  
}

/**
 * This function will be called if a communication error occurs during the XMLHttpRequest
 */
function onAutoCompleteFailed() {
  alert('Ooops!');
}

// Attach the event listeners to the XMLHttpRequest object
ajaxRequest.addEventListener("load", onAutoCompleteSuccess);
ajaxRequest.addEventListener("error", onAutoCompleteFailed);
ajaxRequest.responseType = "json";


window.addEventListener('click', function(e) {
  console.log('here:'+cityInput);
  /*if (document.getElementById(cityInput).contains(e.target) && this.lastForm != cityInput ||
      document.getElementById(stateInput).contains(e.target) && this.lastForm != stateInput ||
      document.getElementById(countryInput).contains(e.target)  && this.lastForm != countryInput) {
    clearOldSuggestions();
      } else*/ if (!document.getElementById('dialogCity').contains(e.target) ||
              !document.getElementById('dialogState').contains(e.target) ||
              !document.getElementById('dialogCountry').contains(e.target)) {
                clearOldSuggestions();
  }
});