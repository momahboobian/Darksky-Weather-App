window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const apiKey = "9e563647fc52a78089ac99ba9bc93afc";
      const { longitude, latitude } = position.coords;
      // Fetch the current weather data
      const currentWeatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
      fetch(currentWeatherApi)
        .then((response) => {
          return response.json();
        })
        .then((currentData) => {
          console.log(currentData);
          // update the DOM with the temperature value
          const { temp } = currentData.main;
          tempAndConversion(temp);
          const country = currentData.sys.country;
          const city = currentData.name;
          const iconCode = currentData.weather[0].icon;
          const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
          const tempElement = document.querySelector(".temp");
          const { main, description } = currentData.weather[0];

          const countryElement = document.querySelector(".city-country");
          countryElement.textContent = `${city}, ${country}`;

          const iconElement = document.querySelector(".weather-icon img");
          // iconElement.src = iconUrl;
          iconElement.src = "/src/weather-icons/animated/cloudy.svg";

          // const conditionElement = document.querySelector(".condition");
          // conditionElement.textContent = `Condition: ${main}`;

          const descriptionElement = document.querySelector(".description");
          descriptionElement.textContent = `${description}`;

          // Fetch the 5-day forecast data
          const forecastApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
          fetch(forecastApi)
            .then((response) => {
              return response.json();
            })
            .then((forecastData) => {
              console.log(forecastData);
              forecastFunc(forecastData);
            });
        });
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
});
// temp conversion
function tempAndConversion(temp) {
  const tempElement = document.querySelector(".temp");

  let tempUnit = "celsius";
  let tempValue = Math.round(temp - 273.15);
  tempElement.textContent = `${tempValue}?? C`;

  tempElement.addEventListener("click", () => {
    if (tempUnit === "celsius") {
      tempUnit = "fahrenheit";
      tempValue = Math.round((tempValue * 9) / 5 + 32);
      tempElement.textContent = `${tempValue}?? F`;
    } else if (tempUnit === "fahrenheit") {
      tempUnit = "kelvin";
      tempValue = Math.round((tempValue + 459.67) * (5 / 9));
      tempElement.textContent = `${tempValue}?? K`;
    } else {
      tempUnit = "celsius";
      tempValue = Math.round(temp - 273.15);
      tempElement.textContent = `${tempValue}?? C`;
    }
  });
}

function forecastFunc(data) {
  const forecastList = data.list;

  // Get the next 4 days' forecast data (ignoring the current day)
  const nextFourDays = forecastList.slice(1, 5);

  const forecastDiv = document.getElementById("forecast");

  // Loop through the forecast data for the next 4 days and display it on the page
  nextFourDays.forEach((day) => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-US", {
      weekday: "long",
    });
    // const icon = day.weather[0].icon;
    const temp = Math.round(day.main.temp);

    const iconElement = document.createElement("img");
    iconElement.classList.add("icon");
    // iconElement.src = `https://openweathermap.org/img/w/${icon}.png`;
    iconElement.src = `/src/weather-icons/animated/cloudy-day-3.svg`;

    const dayElement = document.createElement("div");
    dayElement.classList.add("day");

    const tempElement = document.createElement("div");
    tempElement.classList.add("temp");
    tempElement.textContent = `${temp}??C`;

    const dayDateElement = document.createElement("div");

    const dayNameElement = document.createElement("p");
    dayNameElement.classList.add("day-name");
    dayNameElement.textContent = dayName;

    const dateElement = document.createElement("p");
    dateElement.classList.add("date");
    dateElement.textContent = date.toLocaleDateString("en-US");

    dayElement.appendChild(iconElement);
    dayElement.appendChild(tempElement);

    dayDateElement.appendChild(dayNameElement);
    dayDateElement.appendChild(dateElement);

    dayElement.appendChild(dayDateElement);

    forecastDiv.appendChild(dayElement);
  });
}
