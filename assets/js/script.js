var currentWeather = document.getElementById("current-weather");
var searchForm = document.getElementById("weather-search");
var citySearch = document.getElementById("city-search");
var APIKey = "3729e3db3ada7a7b6743c34ca3dd9b0b";
var currentCity = document.getElementById("current-city");
var currentTemp = document.getElementById("current-temp");
var currentWind = document.getElementById("current-wind");
var currentHumidity = document.getElementById("current-humidity");
var currentUV = document.getElementById("current-uv");
function kelvinToCelsius(kelvin) {
  return kelvin - 273.15;
}
function mpsToKph(mps) {
  return mps * 3.6;
}

function getCurrentWeather(city) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;
  return fetch(queryURL).then(function (response) {
    return response.json();
  });
}
function getUVI(lat, lon) {
  var UVIURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    APIKey;
  return fetch(UVIURL).then(function (response) {
    return response.json();
  });
}

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var city = citySearch.value;
  getCurrentWeather(city).then(function (data) {
    console.log(data);

    currentCity.textContent =
      "Current weather in " + data.name + ", " + data.sys.country;
    currentTemp.textContent =
      "Temperature: " + kelvinToCelsius(data.main.temp).toFixed(2) + "°C";
    currentWind.textContent =
      "Wind (Bearing): " +
      mpsToKph(data.wind.speed).toFixed(1) +
      "km/h (" +
      data.wind.deg +
      "°)";
    currentHumidity.textContent = "Humidity: " + data.main.humidity + "%";

    getUVI(data.coord.lat, data.coord.lon).then(function (data) {
      console.log(data);
    });
  });
});
