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
let city ='';
let lat ='';
let lon = '';

// to find city...is this close?
function findCity(){
    city = searchInput.val().trim();
    let queryUrl = "http://api.openweathermap.org/geo/1.0/direct?q"+cityName + ","+ stateCode+ "," + countryCode+"&limit={limit}&appid="+APIKey;
    fetch(queryUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        lat = data.coord.lat;
        lon = data.coord.lon;
        console.log(lat +' | '+ lon);

        function searchCity(){
            console.log(lat);
            console.log(lon);
            let queryUrl =  'https://api.openweathermap.org/data/2.5/weather?lat='+ lat +'&lon='+ lon +'&appid='+APIKey;
            fetch(queryUrl)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                console.log(data);
            })
        }
        searchCity();
    })
}
// How do I get the lat and lon from the previous fetch into below fetch
// Function to get 


searchButton.on('click', findCity);


// Function: Fetch API data and details to daily display & 5-day forecast

// Search Button Event Listener: on click - fetch data from API and return 
    // > display on screen 
    // >append weather data to section
    // > append 5-day forecast cards)

// on Search Button - localStorage.setItems  > append search history buttons

// on SearchHistory Butotn Click - localStorage.getItems > change display

