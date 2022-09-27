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
let storedCities =[];

// Function to locate city and fetch data on click
function findCity(event){
    city = searchInput.val().trim() || event.target.innerHTML
    console.log(city);
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
        getCityWeather();  
        getFutureForecast(); 
        addSearchHistory();
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
        
        iconEl.attr('src', 'https://openweathermap.org/img/wn/' + iconId+ '@2x.png').addClass('custom-icon')
        cityNameEl.text(city + ' ' + '(' + newDateFormat+')');
        cityTempEl.text('Temp: ' + Math.round(data.main.temp-273.15) + ' °C');
        cityWindEl.text('Wind: ' + data.wind.speed + ' MPH');
        cityHumidityEl.text('Humidity: ' + data.main.humidity + ' %');
        
    })
}

// Function: Fetch API data and details to daily display & 5-day forecast 
// TODO: Find every day - not 3 hour increments
function getFutureForecast() {
    // set empty string for forecast section
    let queryUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon='+ lon +'&appid='+APIKey;
    fetch(queryUrl)
    .then(function(response){
        return response.json()
    })
    .then (function(data){
        console.log('Future Forecast ===========')
        console.log(data);
        let resultList = [data.list[4], data.list[12], data.list[20], data.list[28], data.list[36]];
    
        console.log(resultList);

        for(let i=0; i<resultList.length; i++) {
        let forecastDay = $('<div>').addClass('custom-card col-2')
        let forecastDate = $('<p>').addClass('custom-subtitle')
        let forecastIcon = $('<img>').addClass('custom-icon');
        let forecastTemp = $('<p>');
        let forecastWind = $('<p>');
        let forecastHumidity = $('<p>');
        let forecastIconId = resultList[i].weather[0].icon
        let upcomingDate = resultList[i].dt_txt.split(' ');
        

        forecastDate.text(upcomingDate[0]);
        forecastIcon.attr('src','https://openweathermap.org/img/wn/' + forecastIconId+ '@2x.png')
        forecastTemp.text('Temp: '+ (Math.round(resultList[i].main.temp - 273.15)) + '°C');
        forecastWind.text('Wind: ' + resultList[i].wind.speed + ' MPH');
        forecastHumidity.text('Humidity: ' + resultList[i].main.humidity + ' %');


        forecastDay.append(
            forecastDate,
            forecastIcon,
            forecastTemp,
            forecastWind,
            forecastHumidity
            )
        weatherForcastEl.append(forecastDay);
        }
    
    })
}





// Create search hitory buttons 
function addSearchHistory() {
    
    if(!storedCities.includes(city)) {
        storedCities.push(city);
        localStorage.setItem('storedCities', JSON.stringify(storedCities));
    //    let pastSearchButton = $('<button>');
    //     pastSearchButton.addClass('btn btn-secondary w-100 m-2')
    //     // pastSearchButton.attr('data-city', city);
    //     pastSearchButton.text(city);
    //     searchHistoryEl.append(pastSearchButton);
    } 
}

// Load past search results on button click
function loadHistory() {
    // getItem - I'm just retrienving the ket in a string, and it needs to be parsed because it's an object.
    let retrievedCity = JSON.parse(localStorage.getItem('storedCities'));
    console.log(retrievedCity);
    for (i = 0; i<retrievedCity.length; i++) {
        let pastSearchButton = $('<button>');
        pastSearchButton.addClass('btn btn-secondary w-100 m-2')
        // pastSearchButton.attr('data-city', city);
        pastSearchButton.text(retrievedCity[i]);
        searchHistoryEl.append(pastSearchButton);
    }
}


searchButton.on('click', findCity);
searchHistoryEl.on('click', findCity);

loadHistory();