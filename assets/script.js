function createCityList(citySearchList) {
  $("#city-list").empty();

  const keys = Object.keys(citySearchList);
  for (let i = 0; i < keys.length; i++) {
    const cityListEntry = $("<button>");
    cityListEntry.addClass("list-group-item list-group-item-action");

    const splitStr = keys[i].toLowerCase().split(" ");
    for (let j = 0; j < splitStr.length; j++) {
      splitStr[j] =
        splitStr[j].charAt(0).toUpperCase() + splitStr[j].substring(1);
    }
    const titleCasedCity = splitStr.join(" ");
    cityListEntry.text(titleCasedCity);

    $("#city-list").append(cityListEntry);
  }
}

function populateCityWeather(city, citySearchList) {
  createCityList(citySearchList);

  const queryURL =
    "https://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=72dbf9aff8ceebcab2fbefa370cc2b2b&q=" +
    city;
  console.log(queryURL)

  const queryURL2 =
    "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=72dbf9aff8ceebcab2fbefa370cc2b2b&q=" +
    city;

  let latitude;

  let longitude;

  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function (weather) {

      console.log(queryURL);

      console.log(weather);

      let nowMoment = moment();

      const displayMoment = $("<h3>");
      $("#city-name").empty();
      $("#city-name").append(
        displayMoment.text("(" + nowMoment.format("M/D/YYYY") + ")")
      );

      let cityName = $("<h3>").text(weather.name);
      $("#city-name").prepend(cityName);

      let weatherIcon = $("<img>");
      weatherIcon.attr(
        "src",
        "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
      );
      $("#current-icon").empty();
      $("#current-icon").append(weatherIcon);

      $("#current-temp").text("Temperature: " + weather.main.temp + " °F");
      $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
      $("#current-wind").text("Wind Speed: " + weather.wind.speed + " MPH");

      latitude = weather.coord.lat;
      longitude = weather.coord.lon;

      const queryURL3 =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=72dbf9aff8ceebcab2fbefa370cc2b2b&q=" +
        "&lat=" +
        latitude +
        "&lon=" +
        longitude;

      $.ajax({
        url: queryURL3,
        method: "GET"
      }).then(function (uvIndex) {
        console.log(uvIndex);

        let uvIndexDisplay = $("<button>");
        uvIndexDisplay.addClass("btn btn-danger");

        $("#current-uv").text("UV Index: ");
        $("#current-uv").append(uvIndexDisplay.text(uvIndex[0].value));
        console.log(uvIndex[0].value);

        $.ajax({
          url: queryURL2,
          method: "GET"
        }).then(function (forecast) {
          console.log(queryURL2);

          console.log(forecast);
          for (let i = 6; i < forecast.list.length; i += 8) {

            let forecastDate = $("<h5>");

            let forecastPosition = (i + 2) / 8;

            console.log("#forecast-date" + forecastPosition);

            $("#forecast-date" + forecastPosition).empty();
            $("#forecast-date" + forecastPosition).append(
              forecastDate.text(nowMoment.add(1, "days").format("M/D/YYYY"))
            );

            let forecastIcon = $("<img>");
            forecastIcon.attr(
              "src",
              "https://openweathermap.org/img/w/" +
              forecast.list[i].weather[0].icon +
              ".png"
            );

            $("#forecast-icon" + forecastPosition).empty();
            $("#forecast-icon" + forecastPosition).append(forecastIcon);

            console.log(forecast.list[i].weather[0].icon);

            $("#forecast-temp" + forecastPosition).text(
              "Temp: " + forecast.list[i].main.temp + " °F"
            );
            $("#forecast-humidity" + forecastPosition).text(
              "Humidity: " + forecast.list[i].main.humidity + "%"
            );

            $(".forecast").attr("style", "background-color:dodgerblue; color:white");
          }
        });
      });
    });
}

$(document).ready(function () {
  let citySearchListStringified = localStorage.getItem("citySearchList");

  let citySearchList = JSON.parse(citySearchListStringified);

  if (citySearchList == null) {
    citySearchList = {};
  }

  createCityList(citySearchList);

  $("#current-weather").hide();
  $("#forecast-weather").hide();



  $("#search-button").on("click", function (event) {
    event.preventDefault();
    let city = $("#city-input")
      .val()
      .trim()
      .toLowerCase();

    if (city != "") {

      citySearchList[city] = true;
      localStorage.setItem("citySearchList", JSON.stringify(citySearchList));

      populateCityWeather(city, citySearchList);

      $("#current-weather").show();
      $("#forecast-weather").show();
    }


  });

  $("#city-list").on("click", "button", function (event) {
    event.preventDefault();
    let city = $(this).text();

    populateCityWeather(city, citySearchList);

    $("#current-weather").show();
    $("#forecast-weather").show();
  });
});

