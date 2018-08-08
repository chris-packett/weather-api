const APP_ID = '&appid=794b4117ce09d9700cccaa55ba8d7d33'
let LAT
let LON
let FETCH_URL

const craftURL = (isCityOrZip, isLatAndLon) => {
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

/**
 * @param {} params - defines what url to create
 */
const searchAPI = (params) => {
  params = params || {isCityOrZip: true}
  fetch(craftURL(params.isCityOrZip, params.isLatAndLon))
    .then((res) => res.json())
    .then((data) => {
      const tempInF = data.main.temp
      const secondsTillSunset = data.sys.sunset - data.dt
      const hoursTillSunset = Math.floor(secondsTillSunset / 3600)
      const minutesTillSunset = Math.floor(((secondsTillSunset / 3600) - hoursTillSunset) * 60)
      let temperatureMessage = `Temperature in Fahrenheit: ${tempInF}`
      let sunsetMessage = `Time until sunset: ${hoursTillSunset} hours, ${minutesTillSunset} minutes`
      addContentToUl(temperatureMessage)
      addContentToUl(sunsetMessage)

    })
}

const populateOnPageLoad = () => {
  if (localStorage.getItem('last_query')) {
    const _last_query = localStorage.getItem('last_query')
    const _baseURL = 'http://api.openweathermap.org/data/2.5/weather?'
    const _city_or_zip_parameter = 'q='
    const _fahrenheit_units = '&units=imperial'
    let _last_fetch_url = _baseURL + _city_or_zip_parameter + _last_query + _fahrenheit_units + APP_ID
  
    fetch(_last_fetch_url)
      .then((res) => res.json())
      .then((data) => {
        const nameOfPlace = data.name
        const tempInF = data.main.temp
        const secondsTillSunset = data.sys.sunset - data.dt
        const hoursTillSunset = Math.floor(secondsTillSunset / 3600)
        const minutesTillSunset = Math.floor(((secondsTillSunset / 3600) - hoursTillSunset) * 60)
        let previousEntryMessage = `Below is information for ${nameOfPlace} based on your last visit!`
        let temperatureMessage = `Temperature in Fahrenheit: ${tempInF}`
        let sunsetMessage = `Time until sunset: ${hoursTillSunset} hours, ${minutesTillSunset} minutes`
        addContentToUl(previousEntryMessage)
        addContentToUl(temperatureMessage)
        addContentToUl(sunsetMessage)
      })
  }
}

const addContentToUl = (message) => {
  let weatherOutputParent = document.querySelector('.weather-output')
  let _li = document.createElement('li')
  _li.textContent = message
  weatherOutputParent.appendChild(_li)
}

class Geolocation {
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition)
    } else {
      console.log("Geolocation is not supported by this browser.")
    }
  }

  showPosition(position) {
    LAT = position.coords.latitude
    LON = position.coords.longitude
    console.log(LAT, LON)
    searchAPI({ isLatAndLon: true })
  }
}

class UserInput {

}

class UrlStructure {
  
}

class DOMInteraction {

}

const getUserLocation = () => {
  const userLocation = new Geolocation
  userLocation.getLocation()
}

const getUserInput = () => {
  const userLocation = new UserInput
  userLocation.getLocation()
}

document.addEventListener('DOMContentLoaded', populateOnPageLoad)
document.querySelector('.get-city-or-zip').addEventListener('click', () => { searchAPI() })
document.querySelector('.get-lat-and-lon').addEventListener('click', getUserLocation)

