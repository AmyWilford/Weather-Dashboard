// set variables to access HTML elements
let searchInput = $('#searchInput');
let searchButton = $('#searchButton');
let searchHistoryEl = $('#searchHistory');
let cityNameEl= $('#cityName');
let cityTempEl = $('#cityTemp');
let cityWindEl = $('#cityWind');
let cityHumidityEl = $('#cityHumidity');
let weatherTodayEl = $('#weatherToday');
let weatherForcastEl = $('#weatherForecast');
let iconEl = $('#icon');

let APIKey = '4311ce3063db32c4ad7d1694e9068e53';
let city ='';
let lat;
let lon;

// Function to locate city and fetch data on click
function findCity(){
    city = searchInput.val().trim();
    let queryUrl =  "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    if (!city) {
        alert ('Please enter a City name')
    } else {
    fetch(queryUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        lat = data.coord.lat;
        lon = data.coord.lon;
        console.log(lat +' | '+ lon);    
        getCityWeather()   
        getFutureForecast() 
    })      
    searchInput.val('');
    }
}
// Function to get city weather | Using current weather API and publish to page
function getCityWeather(){
    console.log(lat);
    console.log(lon);
    let queryUrl =  'https://api.openweathermap.org/data/2.5/weather?lat='+ lat +'&lon='+ lon +'&appid='+APIKey;
    fetch(queryUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log('Current Weather ===========')
        console.log(data);
        // Makes city first letter capitalized
        city = city.toLowerCase();
        city = city.charAt(0).toUpperCase()+city.slice(1);
        
        // Set current date and y/m/d format
        let currentDate = new Date();
        let newDateFormat = currentDate.getFullYear() + '/' +(currentDate.getMonth()+1) + '/' + currentDate.getDate();
        
        // capture iconID
        let iconId = data.weather[0].icon;
        
        iconEl.attr('src', 'https://openweathermap.org/img/wn/' + iconId+ '@2x.png');
        cityNameEl.text(city + ' ' + '(' + newDateFormat+')');
        cityTempEl.text('Temp: ' + Math.round(data.main.temp-273.15) + ' °C');
        cityWindEl.text('Wind: ' + data.wind.speed + ' MPH');
        cityHumidityEl.text('Humidity: ' + data.main.humidity + ' %');
        
        addSearchHistory();
        
    })
}

// Function: Fetch API data and details to daily display & 5-day forecast
function getFutureForecast() {
    let queryUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon='+ lon +'&appid='+APIKey;
    fetch(queryUrl)
    .then(function(response){
        return response.json()
    })
    .then (function(data){
        console.log('Future Forecast ===========')
        console.log(data);
        let resultList = data.list;
        console.log(resultList);

        let forecastDay = $('<div>').addClass('custom-card col-2')
        let forecastDate = $('<p>');
        let forecastIcon = $('<img>');
        let forecastTemp = $('<p>');
        let forecastWind = $('<p>');
        let forecastHumidity = $('<p>');

        // forecastIconId = 
        // forecastDate = data.

        forecastDate.text();
        // forecastIcon.attr('src','https://openweathermap.org/img/wn/' + forecastIconId+ '@2x.png')
        forecastTemp.text('Temp: '+ (Math.round(resultList[0].main.temp - 273.15)) + '°C');
        forecastWind.text('Wind: ' + resultList[0].wind.speed + ' MPH');
        forecastHumidity.text('Humidity: ' + resultList[0].main.humidity + ' %');


        forecastDay.append(
            forecastDate,
            forecastIcon,
            forecastTemp,
            forecastWind,
            forecastHumidity
            )
        weatherForcastEl.append(forecastDay);
        // for (i=0; i<5 ; i++){
        //     let forecastDate = $('<p>');
        //     let forecastIcon = $('<img>');
        //     let forecastTemp = $('<p>');
        //     let forecastWind = $('<p>');
        //     let forecastHumidity = $('<p>');

        //     // forecastIconId = 
        //     // forecastDate = data.
    
        //     forecastDate.text();
        //     forecastIcon.attr('src','https://openweathermap.org/img/wn/' + forecastIconId+ '@2x.png')
        //     forecastTemp.text();
        //     forecastWind.text();
    
        //     weatherForcastEl.append(
        //         forecastDate,
        //         forecastIcon,
        //         forecastTemp,
        //         forecastWind,
        //         forecastHumidity
        //     )
        // }
    })
}

// Search Button Event Listener: on click - fetch data from API and return 
    // > display on screen 
    // >append weather data to section
    // > append 5-day forecast cards)



// on Search Button - localStorage.setItems  > append search history buttons

function addSearchHistory() {
    let pastSearchButton = $('<button>');
    pastSearchButton.addClass('btn btn-secondary w-100 m-2')
    pastSearchButton.attr('data-city', city);
    pastSearchButton.text(city);
    searchHistoryEl.append(pastSearchButton);

    // localStorage.setItem(city, data)

}

function loadHistory() {
    localStorage.setItem(city, data)

}

// on SearchHistory Button Click - localStorage.getItems > change display

searchButton.on('click', findCity);
