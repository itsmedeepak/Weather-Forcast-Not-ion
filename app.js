const dateEl = document.querySelector(".day");
const timeEl = document.querySelector(".time");
const time_zone = document.querySelector(".time-zone");
const country = document.querySelector(".country");
const co_ordinates = document.querySelector(".co-ordinates");
const currWeatherInfo = document.querySelector(".side-left-down");
const weatherForcast = document.querySelector(".future-forcast");
const currentTempEl = document.getElementById("current-temp");
const weatherForecastEl = document.getElementById('weather-forecast');

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "33234c0b48ef3c48449d0da2e72c566a";

setInterval(() => {
  const time = new Date();
  const day = time.getDay();
  const month = time.getMonth();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const date = time.getDate();
  const hrIn12Fmt = hour >= 13 ? hour % 12 : hour;
  const ampm = hour >= 12 ? "PM" : "AM";
  const inStrdate = " " + date + " " + months[month];
  timeEl.innerHTML =
    (hrIn12Fmt < 10 ? "0" + hrIn12Fmt : hrIn12Fmt) +
    ":" +
    (minute < 10 ? "0" + minute : minute) +
    " " +
    `<span class="am-pm">${ampm}</span>`;
  dateEl.innerHTML = days[day] + `<span class="date">${inStrdate}</span>`;
}, 1000);

getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
}
function showWeatherData(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
  time_zone.innerHTML = data.timezone;
  //const rise=window.moment(sunrise * 1000).format('HH:mm a');
  co_ordinates.innerHTML = data.lat + "N " + data.lon + "E";
  currWeatherInfo.innerHTML = `<div>Humidity <span class="data">${humidity}%</span></div>
                                <div>Pressure <span class="data">${pressure}</span></div>
                                <div>Wind Speed <span class="data">${wind_speed}</span></div>
                                <div>Sunrise <span class="data">${window
                                  .moment(sunrise * 1000)
                                  .format("HH:mm a")}</span></div>
                                <div>Sunset <span class="data">${window
                                  .moment(sunset * 1000)
                                  .format("HH:mm a")}</span></div>`;

  let otherDayForcast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTempEl.innerHTML = `
                                            <img src="http://openweathermap.org/img/wn//${
                                              day.weather[0].icon
                                            }@4x.png" alt="weather icon" class="w-icon">
                                            <div class="other">
                                                <div class="day-item-today">${window
                                                  .moment(day.dt * 1000)
                                                  .format("dddd")}</div>
                                                <div class="temp">Night - ${
                                                  day.temp.night
                                                }&#176;C</div>
                                                <div class="temp">Day - ${
                                                  day.temp.day
                                                }&#176;C</div>
                                            </div>
                                            
                                        `;
    } else {
      otherDayForcast += `
                            <div class="weather-forecast-item">
                                <div class="day-item">${window
                                    .moment(day.dt * 1000)
                                    .format("ddd")}</div>
                                <img src="http://openweathermap.org/img/wn/${
                                    day.weather[0].icon
                                }@2x.png" alt="weather icon" class="w-icon">
                                <div class="temp">Night - ${
                                    day.temp.night
                                }&#176;C</div>
                                <div class="temp">Day - ${
                                    day.temp.day
                                }&#176;C</div>
                            </div> `;



    }
  });

  weatherForecastEl.innerHTML = otherDayForcast;
}
