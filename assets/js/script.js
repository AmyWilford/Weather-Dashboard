// set variables to access HTML elements
let searchInput = $('#searchInput');
let searchButton = $('#searchButton');
let searchHistoryEl = $('#searchHistory');
let cityNameEl= $('#cityName');
let cityTempEl = $('#cityTemp');
let cityWindEl = $('#cityWind');
let cityHumidity = $('#cityHumidity');
let cityUVIndex = $('#cityUVIndex')
let weatherTodayEl = $('#weatherToday');
let weatherForcastEl = $('#weatherForecast');

let APIKey = '4311ce3063db32c4ad7d1694e9068e53';
let city ='Toronto';
let queryUrl =  "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;


function getApi(){
    fetch(queryUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
    })
}
// Function to get City
function getCity() {
   city = searchInput.val();
    console.log(city);
}
searchButton.on('click', getApi);


// Function: Fetch API data and details to daily display & 5-day forecast

// Search Button Event Listener: on click - fetch data from API and return

// on Search Button - localStorage.setItems 
// on Search BUtton - localStorage.getItems > append Buttons

