var currentWeather = document.getElementById("current-weather");
// Container for current weather
var searchForm = document.getElementById("weather-search");
// Form selecter for button
var citySearch = document.getElementById("city-search");
// City name input
var APIKey = "3729e3db3ada7a7b6743c34ca3dd9b0b";
// My unique key for use of API
var currentCity = document.getElementById("current-city");
// Row for text displaying city name in output
var currentTemp = document.getElementById("current-temp");
// Row for text displaying current temperature in output
var currentWind = document.getElementById("current-wind");
// Row for text displaying current wind speed and direction in output
var currentHumidity = document.getElementById("current-humidity");
// Row for text displaying current humidity in output
var currentUV = document.getElementById("current-uv");
// Row for text displaying current UV Index in output
var currentUVHeading = document.getElementById("current-uv-heading");
var conditonIcon = $("#condition-icon");
// Selector for img containing weather condition icon
var forecastDate1 = document.getElementById("date-1");
var forecastDailyMin1 = document.getElementById("min-temp-1");
var forecastDailyMax1 = document.getElementById("max-temp-1");
var forecastDailyWind1 = document.getElementById("wind-1");
var forecastDailyHumid1 = document.getElementById("humidity-1");
var forecastDailyIcon1 = $("#icon-1");
var forecastDate2 = document.getElementById("date-2");
var forecastDailyMin2 = document.getElementById("min-temp-2");
var forecastDailyMax2 = document.getElementById("max-temp-2");
var forecastDailyWind2 = document.getElementById("wind-2");
var forecastDailyHumid2 = document.getElementById("humidity-2");
var forecastDailyIcon2 = $("#icon-2");
var forecastDate3 = document.getElementById("date-3");
var forecastDailyMin3 = document.getElementById("min-temp-3");
var forecastDailyMax3 = document.getElementById("max-temp-3");
var forecastDailyWind3 = document.getElementById("wind-3");
var forecastDailyHumid3 = document.getElementById("humidity-3");
var forecastDailyIcon3 = $("#icon-3");
var forecastDate4 = document.getElementById("date-4");
var forecastDailyMin4 = document.getElementById("min-temp-4");
var forecastDailyMax4 = document.getElementById("max-temp-4");
var forecastDailyWind4 = document.getElementById("wind-4");
var forecastDailyHumid4 = document.getElementById("humidity-4");
var forecastDailyIcon4 = $("#icon-4");
var forecastDate5 = document.getElementById("date-5");
var forecastDailyMin5 = document.getElementById("min-temp-5");
var forecastDailyMax5 = document.getElementById("max-temp-5");
var forecastDailyWind5 = document.getElementById("wind-5");
var forecastDailyHumid5 = document.getElementById("humidity-5");
var forecastDailyIcon5 = $("#icon-5");
var forecastHeading = document.getElementById("heading");
let previousSearches =
  JSON.parse(localStorage.getItem("previousSearches")) || [];
function saveToLS(city, countryCode) {
  const cityFormatted = `${city}, ${countryCode}`;
  if (previousSearches.includes(cityFormatted) === false) {
    previousSearches.unshift(cityFormatted);
    if (previousSearches.length > 10) {
      previousSearches.splice(-1, 1);
    }

    if (localStorage.getItem("previousSearches") === null) {
      localStorage.setItem(
        "previousSearches",
        JSON.stringify(previousSearches)
      );
    } else {
      localStorage.removeItem("previousSearches");
      localStorage.setItem(
        "previousSearches",
        JSON.stringify(previousSearches)
      );
    }
  }
}
const recentSearchButtons = $("#recent-searches");

var directionVarArray = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
  "N",
];
// Array for cardinal wind dir. rather than bearing

function kelvinToCelsius(kelvin) {
  return kelvin - 273.15;
}
// converting default temperature, in Kelvin, to degrees Celsius

function mpsToKph(mps) {
  return mps * 3.6;
}
// converting default wind speed, in m/s, to km/h

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
// api link for all weather data other than UV index

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

function renderRecentSearches() {
  recentSearchButtons.empty();
  const recentLabel = $("<h4>");
  recentLabel.text("Recent Searches:");
  for (let i = 0; i < previousSearches.length; i++) {
    const recentButton = $("<button>");
    recentButton.text(previousSearches[i]);
    recentButton.on("click", recentButtonSearch);
    recentSearchButtons.append(recentButton);
  }
}
// api link for UV index

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = citySearch.value;
  if (city !== "") {
    getCurrentWeather(city).then(function (data) {
      console.log(data);

      saveToLS(data.name, data.sys.country);

      renderRecentSearches();

      var iconUrl =
        "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";

      function bearingToCardinal(bearing) {
        var direcitonVar = (bearing / 22.5).toFixed();
        return directionVarArray[direcitonVar];
      }

      currentCity.textContent =
        "Current weather in " +
        data.name +
        ", " +
        data.sys.country +
        " (last updated at " +
        moment(data.dt * 1000).format("h:mmA [on] ddd Do MMM YYYY") +
        ")" +
        " | " +
        data.weather[0].main +
        " | ";
      currentTemp.textContent =
        "Temperature: " + kelvinToCelsius(data.main.temp).toFixed(2) + "°C";
      currentWind.textContent =
        "Wind: " +
        mpsToKph(data.wind.speed).toFixed(1) +
        "km/h " +
        bearingToCardinal(data.wind.deg);
      currentHumidity.textContent = "Humidity: " + data.main.humidity + "%";

      conditonIcon.attr("src", iconUrl);
      conditonIcon.attr("alt", "Weather Icon");

      getUVI(data.coord.lat, data.coord.lon).then(function (data) {
        console.log(data);
        var uviValue = data.current.uvi;
        currentUVHeading.textContent = "UV Index: ";
        currentUV.textContent = uviValue.toFixed(1);
        if (uviValue < 3) {
          currentUV.style.backgroundColor = "#a0d396";
        } else if (uviValue < 6) {
          currentUV.style.backgroundColor = "#fff980";
        } else {
          currentUV.style.backgroundColor = "#ed9786";
        }

        var dailyIconUrl1 =
          "http://openweathermap.org/img/wn/" +
          data.daily[0].weather[0].icon +
          ".png";
        var dailyIconUrl2 =
          "http://openweathermap.org/img/wn/" +
          data.daily[1].weather[0].icon +
          ".png";
        var dailyIconUrl3 =
          "http://openweathermap.org/img/wn/" +
          data.daily[2].weather[0].icon +
          ".png";
        var dailyIconUrl4 =
          "http://openweathermap.org/img/wn/" +
          data.daily[3].weather[0].icon +
          ".png";
        var dailyIconUrl5 =
          "http://openweathermap.org/img/wn/" +
          data.daily[4].weather[0].icon +
          ".png";

        forecastHeading.textContent = "5-Day Forecast";

        forecastDate1.textContent =
          moment(data.daily[0].dt * 1000).format("Do MMM") + " | ";
        forecastDailyIcon1.attr("src", dailyIconUrl1);
        forecastDailyIcon1.attr("alt", data.daily[0].weather[0].main);
        forecastDailyMin1.textContent =
          "Min: " + kelvinToCelsius(data.daily[0].temp.min).toFixed(2);
        +"°C";
        forecastDailyMax1.textContent =
          "Max: " + kelvinToCelsius(data.daily[0].temp.max).toFixed(2);
        +"°C";
        forecastDailyHumid1.textContent =
          "Humidity: " + data.daily[0].humidity + "%";
        forecastDailyWind1.textContent =
          "Wind: " +
          mpsToKph(data.daily[0].wind_speed).toFixed(1) +
          "km/h " +
          bearingToCardinal(data.daily[0].wind_deg);

        forecastDate2.textContent =
          moment(data.daily[1].dt * 1000).format("Do MMM") + " | ";
        forecastDailyIcon2.attr("src", dailyIconUrl2);
        forecastDailyIcon2.attr("alt", data.daily[1].weather[0].main);
        forecastDailyMin2.textContent =
          "Min: " + kelvinToCelsius(data.daily[1].temp.min).toFixed(2);
        +"°C";
        forecastDailyMax2.textContent =
          "Max: " + kelvinToCelsius(data.daily[1].temp.max).toFixed(2);
        +"°C";
        forecastDailyHumid2.textContent =
          "Humidity: " + data.daily[1].humidity + "%";
        forecastDailyWind2.textContent =
          "Wind: " +
          mpsToKph(data.daily[1].wind_speed).toFixed(1) +
          "km/h " +
          bearingToCardinal(data.daily[1].wind_deg);

        forecastDate3.textContent =
          moment(data.daily[2].dt * 1000).format("Do MMM") + " | ";
        forecastDailyIcon3.attr("src", dailyIconUrl3);
        forecastDailyIcon3.attr("alt", data.daily[2].weather[0].main);
        forecastDailyMin3.textContent =
          "Min: " + kelvinToCelsius(data.daily[2].temp.min).toFixed(2);
        +"°C";
        forecastDailyMax3.textContent =
          "Max: " + kelvinToCelsius(data.daily[2].temp.max).toFixed(2);
        +"°C";
        forecastDailyHumid3.textContent =
          "Humidity: " + data.daily[2].humidity + "%";
        forecastDailyWind3.textContent =
          "Wind: " +
          mpsToKph(data.daily[2].wind_speed).toFixed(1) +
          "km/h " +
          bearingToCardinal(data.daily[2].wind_deg);

        forecastDate4.textContent =
          moment(data.daily[3].dt * 1000).format("Do MMM") + " | ";
        forecastDailyIcon4.attr("src", dailyIconUrl4);
        forecastDailyIcon4.attr("alt", data.daily[3].weather[0].main);
        forecastDailyMin4.textContent =
          "Min: " + kelvinToCelsius(data.daily[3].temp.min).toFixed(2);
        +"°C";
        forecastDailyMax4.textContent =
          "Max: " + kelvinToCelsius(data.daily[3].temp.max).toFixed(2);
        +"°C";
        forecastDailyHumid4.textContent =
          "Humidity: " + data.daily[3].humidity + "%";
        forecastDailyWind4.textContent =
          "Wind: " +
          mpsToKph(data.daily[3].wind_speed).toFixed(1) +
          "km/h " +
          bearingToCardinal(data.daily[3].wind_deg);

        forecastDate5.textContent =
          moment(data.daily[4].dt * 1000).format("Do MMM") + " | ";
        forecastDailyIcon5.attr("src", dailyIconUrl5);
        forecastDailyIcon5.attr("alt", data.daily[4].weather[0].main);
        forecastDailyMin5.textContent =
          "Min: " + kelvinToCelsius(data.daily[4].temp.min).toFixed(2);
        +"°C";
        forecastDailyMax5.textContent =
          "Max: " + kelvinToCelsius(data.daily[4].temp.max).toFixed(2);
        +"°C";
        forecastDailyHumid5.textContent =
          "Humidity: " + data.daily[4].humidity + "%";
        forecastDailyWind5.textContent =
          "Wind: " +
          mpsToKph(data.daily[4].wind_speed).toFixed(1) +
          "km/h " +
          bearingToCardinal(data.daily[4].wind_deg);
      });
    });
  }
});

renderRecentSearches();

function recentButtonSearch(event) {
  event.preventDefault();
  console.log("Test:", event.target);
  let city = event.target.textContent;
  console.log(city);
  if (city !== "") {
    getCurrentWeather(city).then(function (data) {
      console.log(data);

      var iconUrl =
        "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";

      function bearingToCardinal(bearing) {
        var direcitonVar = (bearing / 22.5).toFixed();
        return directionVarArray[direcitonVar];
      }

      currentCity.textContent =
        "Current weather in " +
        data.name +
        ", " +
        data.sys.country +
        " (last updated at " +
        moment(data.dt * 1000).format("h:mmA [on] ddd Do MMM YYYY") +
        ")" +
        " | " +
        data.weather[0].main +
        " | ";
      currentTemp.textContent =
        "Temperature: " + kelvinToCelsius(data.main.temp).toFixed(2) + "°C";
      currentWind.textContent =
        "Wind: " +
        mpsToKph(data.wind.speed).toFixed(1) +
        "km/h " +
        bearingToCardinal(data.wind.deg);
      currentHumidity.textContent = "Humidity: " + data.main.humidity + "%";

      conditonIcon.attr("src", iconUrl);
      conditonIcon.attr("alt", "Weather Icon");

      getUVI(data.coord.lat, data.coord.lon).then(function (data) {
        console.log(data);
        var uviValue = data.current.uvi;
        currentUVHeading.textContent = "UV Index: ";
        currentUV.textContent = uviValue.toFixed(1);
        if (uviValue < 3) {
          currentUV.style.backgroundColor = "#a0d396";
        } else if (uviValue < 6) {
          currentUV.style.backgroundColor = "#fff980";
        } else {
          currentUV.style.backgroundColor = "#ed9786";
        }

        var dailyIconUrl1 =
          "http://openweathermap.org/img/wn/" +
          data.daily[0].weather[0].icon +
          ".png";
        var dailyIconUrl2 =
          "http://openweathermap.org/img/wn/" +
          data.daily[1].weather[0].icon +
          ".png";
        var dailyIconUrl3 =
          "http://openweathermap.org/img/wn/" +
          data.daily[2].weather[0].icon +
          ".png";
        var dailyIconUrl4 =
          "http://openweathermap.org/img/wn/" +
          data.daily[3].weather[0].icon +
          ".png";
        var dailyIconUrl5 =
          "http://openweathermap.org/img/wn/" +
          data.daily[4].weather[0].icon +
          ".png";

        forecastHeading.textContent = "5-Day Forecast";

        forecastDate1.textContent =
          moment(data.daily[0].dt * 1000).format("Do MMM") + " | ";
        forecastDailyIcon1.attr("src", dailyIconUrl1);
        forecastDailyIcon1.attr("alt", data.daily[0].weather[0].main);
        forecastDailyMin1.textContent =
          "Min: " + kelvinToCelsius(data.daily[0].temp.min).toFixed(2);
        +"°C";
        forecastDailyMax1.textContent =
          "Max: " + kelvinToCelsius(data.daily[0].temp.max).toFixed(2);
        +"°C";
        forecastDailyHumid1.textContent =
          "Humidity: " + data.daily[0].humidity + "%";
        forecastDailyWind1.textContent =
          "Wind: " +
          mpsToKph(data.daily[0].wind_speed).toFixed(1) +
          "km/h " +
          bearingToCardinal(data.daily[0].wind_deg);

        forecastDate2.textContent =
          moment(data.daily[1].dt * 1000).format("Do MMM") + " | ";
        forecastDailyIcon2.attr("src", dailyIconUrl2);
        forecastDailyIcon2.attr("alt", data.daily[1].weather[0].main);
        forecastDailyMin2.textContent =
          "Min: " + kelvinToCelsius(data.daily[1].temp.min).toFixed(2);
        +"°C";
        forecastDailyMax2.textContent =
          "Max: " + kelvinToCelsius(data.daily[1].temp.max).toFixed(2);
        +"°C";
        forecastDailyHumid2.textContent =
          "Humidity: " + data.daily[1].humidity + "%";
        forecastDailyWind2.textContent =
          "Wind: " +
          mpsToKph(data.daily[1].wind_speed).toFixed(1) +
          "km/h " +
          bearingToCardinal(data.daily[1].wind_deg);

        forecastDate3.textContent =
          moment(data.daily[2].dt * 1000).format("Do MMM") + " | ";
        forecastDailyIcon3.attr("src", dailyIconUrl3);
        forecastDailyIcon3.attr("alt", data.daily[2].weather[0].main);
        forecastDailyMin3.textContent =
          "Min: " + kelvinToCelsius(data.daily[2].temp.min).toFixed(2);
        +"°C";
        forecastDailyMax3.textContent =
          "Max: " + kelvinToCelsius(data.daily[2].temp.max).toFixed(2);
        +"°C";
        forecastDailyHumid3.textContent =
          "Humidity: " + data.daily[2].humidity + "%";
        forecastDailyWind3.textContent =
          "Wind: " +
          mpsToKph(data.daily[2].wind_speed).toFixed(1) +
          "km/h " +
          bearingToCardinal(data.daily[2].wind_deg);

        forecastDate4.textContent =
          moment(data.daily[3].dt * 1000).format("Do MMM") + " | ";
        forecastDailyIcon4.attr("src", dailyIconUrl4);
        forecastDailyIcon4.attr("alt", data.daily[3].weather[0].main);
        forecastDailyMin4.textContent =
          "Min: " + kelvinToCelsius(data.daily[3].temp.min).toFixed(2);
        +"°C";
        forecastDailyMax4.textContent =
          "Max: " + kelvinToCelsius(data.daily[3].temp.max).toFixed(2);
        +"°C";
        forecastDailyHumid4.textContent =
          "Humidity: " + data.daily[3].humidity + "%";
        forecastDailyWind4.textContent =
          "Wind: " +
          mpsToKph(data.daily[3].wind_speed).toFixed(1) +
          "km/h " +
          bearingToCardinal(data.daily[3].wind_deg);

        forecastDate5.textContent =
          moment(data.daily[4].dt * 1000).format("Do MMM") + " | ";
        forecastDailyIcon5.attr("src", dailyIconUrl5);
        forecastDailyIcon5.attr("alt", data.daily[4].weather[0].main);
        forecastDailyMin5.textContent =
          "Min: " + kelvinToCelsius(data.daily[4].temp.min).toFixed(2);
        +"°C";
        forecastDailyMax5.textContent =
          "Max: " + kelvinToCelsius(data.daily[4].temp.max).toFixed(2);
        +"°C";
        forecastDailyHumid5.textContent =
          "Humidity: " + data.daily[4].humidity + "%";
        forecastDailyWind5.textContent =
          "Wind: " +
          mpsToKph(data.daily[4].wind_speed).toFixed(1) +
          "km/h " +
          bearingToCardinal(data.daily[4].wind_deg);
      });
    });
  }
}
