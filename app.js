//class
class HtmlUI {
  constructor() {
    this.ApiKey = "ab9ff9073b16eb9f1153ac21e0e27822";
  }

  //creat url waether and response data
  async queryApiWeather(city) {
    const WeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.ApiKey}`;
    await fetch(WeatherURL)
      .then((response) => response.json())
      .then((data) => {
        this.displayWeather(data);
      });
  }

  async queryApiForecast(city) {
    const forecaseURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.ApiKey}`;
    await fetch(forecaseURL)
      .then((response) => response.json())
      .then((data) => {
        this.displayHourlyForecast(data.list);
      });
  }

  displayWeather(data) {
    const tempDivInfo = document.getElementById("temp-div");
    const weatherInfoDiv = document.getElementById("weather-info");
    const weatherIcon = document.getElementById("weather-icon");


    this.removeSpiner();
    if (data.cod === "404") {
      this.printMessage("please enter currect city", "danger-message");
    } else {
      const cityName = data.name;
      const temperature = Math.round(data.main.temp - 273.15);
      const description = data.weather[0].description;
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

      const temperatureHTML = `
        <p>${temperature}°C</p>
        `;
      const weatherHTML = `
        <p>${cityName}</p>
        <p>${description}</p>
        `;
      tempDivInfo.innerHTML = temperatureHTML;
      weatherInfoDiv.innerHTML = weatherHTML;
      weatherIcon.src = iconUrl;
      weatherIcon.alt = description;
      weatherIcon.style.display = "block";
    }
  }

  displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById("hourly-forecast");
    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach((item) => {
      const dateTime = new Date(item.dt * 1000);
      const hour = dateTime.getHours();
      const temperature = Math.round(item.main.temp - 273.15);
      const iconCode = item.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

      const hourlyItemHtml = `
            <div class="hourly-item">
            <span>${hour}:00</span>
            <img src="${iconUrl}" alt="Hourly Weather Icon">
            <span>${temperature}°C</span>
            </div>
        `;
      hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
  }

  printMessage(message, className) {
    const div = document.createElement("div");
    div.className = className;
    div.appendChild(document.createTextNode(message));
    document.querySelector("#message").appendChild(div);
    searchBtn.disabled = true;

    setTimeout(() => {
      div.remove();
      searchBtn.disabled = false;
    }, 3000);
  }

  removePrevData(){
    const tempDivInfo = document.getElementById("temp-div");
    const weatherInfoDiv = document.getElementById("weather-info");
    const hourlyForecastDiv = document.getElementById("hourly-forecast");
    tempDivInfo.innerHTML = "";
    hourlyForecastDiv.innerHTML = "";
    weatherInfoDiv.innerHTML = "";
  }

  showSpiner() {
    const spinnerDiv = document.getElementById("spinner");
    spinnerDiv.className = "lds-default";
  }

  removeSpiner() {
    const spinnerDiv = document.getElementById("spinner");
    spinnerDiv.classList.remove("lds-default");
  }
}

//variable
const htmlUI = new HtmlUI();
const searchBtn = document.querySelector("#search-btn");

//addEventListener
eventListener();
function eventListener() {
  searchBtn.addEventListener("click", () => {
    const city = document.querySelector("#city").value;
    if (city == "") {
      htmlUI.printMessage("please fill out", "danger-message");
    } else {
      htmlUI.removePrevData()
      htmlUI.showSpiner();
      htmlUI.queryApiWeather(city);
      htmlUI.queryApiForecast(city);
    }
  });
}
