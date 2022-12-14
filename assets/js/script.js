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
let forecastHeaderEl = $('#forecastTitle')

// Set global variables
let APIKey = '4311ce3063db32c4ad7d1694e9068e53';
let city ='';
let lat;
let lon;
let loadedCity =[];

// Function to locate city and fetch data lon & lat data on click
function findCity(event){
    city = searchInput.val().trim() || event.target.innerHTML;
    city = city.toLowerCase();
    city = city.charAt(0).toUpperCase()+city.slice(1);
    console.log(city);
    let queryUrl =  "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    if (city)
    fetch(queryUrl)
    .then(function(response){
        if (!response.ok) {
            alert('Unknown city. \nPlease enter a valid city name')
        }
        return response.json();
    })
    .then(function(data){
        lat = data.coord.lat;
        lon = data.coord.lon;  
        getCityWeather();  
        getFutureForecast(); 
        addSearchHistory();
    })      
    searchInput.val('');
}

// Function to get city current weather using lat and lon from searchCity
function getCityWeather(){
    let queryUrl =  'https://api.openweathermap.org/data/2.5/weather?lat='+ lat +'&lon='+ lon +'&appid='+APIKey;
    fetch(queryUrl)
    .then(function(response){
        if (!response.ok) {
            alert('Error: ' + response)
        }
        return response.json();
    })
    .then(function(data){
        // Makes city first letter capitalized
        city = city.toLowerCase();
        city = city.charAt(0).toUpperCase()+city.slice(1);
        
        // Set current date and y/m/d format
        let currentDate = new Date();
        let newDateFormat = currentDate.getFullYear() + '/' +(currentDate.getMonth()+1) + '/' + currentDate.getDate();
        
        // capture iconID
        let iconId = data.weather[0].icon;
        
        iconEl.attr('src', 'https://openweathermap.org/img/wn/' + iconId+ '@2x.png').addClass('custom-icon').attr('alt', 'weather icon');
        cityNameEl.text(city + ' ' + '(' + newDateFormat+')');
        cityTempEl.text('Temp: ' + Math.round(data.main.temp-273.15) + ' ??C');
        cityWindEl.text('Wind: ' + data.wind.speed + ' MPH');
        cityHumidityEl.text('Humidity: ' + data.main.humidity + ' %');  
    })
}

// Function: Fetch API data and details to display future 5-day forecast 
function getFutureForecast() {
    weatherForcastEl.text('');
    let queryUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon='+ lon +'&appid='+APIKey;
    fetch(queryUrl)
    .then(function(response){
        if (!response.ok) {
            alert('Error: ' + response)
        }
        return response.json()
    })
    .then (function(data){
        // Establish array of listed forecasts to grab same time each day over five-days
        let resultList = [data.list[3], data.list[11], data.list[19], data.list[27], data.list[35]];
        forecastHeaderEl.text('5-Day Forecast: ') 

        // Create forecast elements and text content
        for(let i=0; i<resultList.length; i++) {
            let forecastDay = $('<div>').addClass('custom-card col-sm-3')
            let forecastDate = $('<p>').addClass('custom-subtitle')
            let forecastIcon = $('<img>').addClass('custom-icon').attr('alt', 'weather icon');
            let forecastTemp = $('<p>');
            let forecastWind = $('<p>');
            let forecastHumidity = $('<p>');

            // get weather icon ID from data results
            let forecastIconId = resultList[i].weather[0].icon

            // get date of weather forcast in format (yyy/mm/dd)
            let upcomingDate = resultList[i].dt_txt.split(' ');

            // add text content to forecast card elements
            forecastDate.text(upcomingDate[0]);
            forecastIcon.attr('src','https://openweathermap.org/img/wn/' + forecastIconId+ '@2x.png')
            forecastTemp.text('Temp: '+ (Math.round(resultList[i].main.temp - 273.15)) + '??C');
            forecastWind.text('Wind: ' + resultList[i].wind.speed + ' MPH');
            forecastHumidity.text('Humidity: ' + resultList[i].main.humidity + ' %');

            // Append forecast elements to parent weatherForecastEl
            forecastDay.append(
                forecastDate,
                forecastIcon,
                forecastTemp,
                forecastWind,
                forecastHumidity
                )
            weatherForcastEl.append(forecastDay);
        }
    });
}

// Create search hitory buttons and set local storage
function addSearchHistory() {
    if(!loadedCity.includes(city)) {
        loadedCity.push(city);
        localStorage.setItem('loadedCity', JSON.stringify(loadedCity));
        let pastSearchButton = $('<button>');
        pastSearchButton.addClass('btn btn-secondary w-100 m-2')
        pastSearchButton.text(city);
        searchHistoryEl.append(pastSearchButton);
    }  
}

// Load past search results and maintain search history buttons
function loadHistory() {
    loadedCity = JSON.parse(localStorage.getItem('loadedCity')) || [];
    if(loadedCity!==null) {
        for (i = 0; i<loadedCity.length; i++) {
            let pastSearchButton = $('<button>');
            pastSearchButton.addClass('btn btn-secondary w-100 m-2')
            pastSearchButton.text(loadedCity[i]);
            searchHistoryEl.append(pastSearchButton);
        };
    } 
}

loadHistory();
searchButton.on('click', findCity);
searchHistoryEl.on('click', findCity);



