const APP_ID = '&appid=794b4117ce09d9700cccaa55ba8d7d33'
let LAT
let LON
let isCityOrZip = true
let isLatAndLon = false
let FETCH_URL
const SECONDS_IN_AN_HOUR = 3600
const MINUTES_IN_AN_HOUR = 60

const craftURL = () => {
  const _baseURL = 'http://api.openweathermap.org/data/2.5/weather?'
  const _city_or_zip_parameter = 'q='
  const _lat_parameter = 'lat='
  const _lon_parameter = '&lon='
  const _fahrenheit_units = '&units=imperial'
  let inputValue = document.querySelector('.input').value
  localStorage.setItem('last_query', inputValue)
  if (isCityOrZip) {
    let FETCH_URL = _baseURL + _city_or_zip_parameter + inputValue + _fahrenheit_units + APP_ID
    return FETCH_URL
  }
  else if (isLatAndLon) {
    let FETCH_URL = _baseURL + _lat_parameter + LAT + _lon_parameter + LON + _fahrenheit_units + APP_ID
    return FETCH_URL
  }
}

const addContentToUl = (message) => {
  let weatherOutputParent = document.querySelector('.weather-output')
  let _li = document.createElement('li')
  _li.textContent = message
  weatherOutputParent.appendChild(_li)
}

const searchAPI = () => {
  fetch(craftURL())
    .then((res) => res.json())
    .then((data) => {
      const tempInF = data.main.temp
      const secondsTillSunset = data.sys.sunset - data.dt
      const hoursTillSunset = Math.floor(secondsTillSunset / SECONDS_IN_AN_HOUR)
      const minutesTillSunset = Math.floor(((secondsTillSunset / SECONDS_IN_AN_HOUR) - hoursTillSunset) * MINUTES_IN_AN_HOUR)
      let temperatureMessage = `Temperature in Fahrenheit: ${tempInF}`
      let sunsetMessage = `Time until sunset: ${hoursTillSunset} hours, ${minutesTillSunset} minutes`
      addContentToUl(temperatureMessage)
      addContentToUl(sunsetMessage)

    })
}

const getLocation = () => {
  isLatAndLon = true
  isCityOrZip = false
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition)
  } else {
    console.log("Geolocation is not supported by this browser.")
  }
}

const showPosition = (position) => {
  LAT = position.coords.latitude
  LON = position.coords.longitude
  console.log(LAT, LON)
  searchAPI()
  isLatAndLon = false
  isCityOrZip = true
}

document.querySelector('.get-city-or-zip').addEventListener('click', searchAPI)
document.querySelector('.get-lat-and-lon').addEventListener('click', getLocation)

