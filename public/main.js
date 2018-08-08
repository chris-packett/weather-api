const APP_ID = '&appid=794b4117ce09d9700cccaa55ba8d7d33'
let LAT
let LON
let FETCH_URL

class Search {
  constructor () {
    this.baseURL = 'http://api.openweathermap.org/data/2.5/weather?'
    this.city_or_zip_parameter = 'q='
    this.lat_parameter = 'lat='
    this.lon_parameter = '&lon='
    this.fahrenheit_units = '&units=imperial'
    this.input_value = document.querySelector('.input').value
    localStorage.setItem('last_query', this.input_value)
  }

  /**
  ** @param {} params - defines what url to create
  **/
  searchAPI (params) {
    params = params || { isCityOrZip: true }
    fetch(this.craftURL(params.isCityOrZip, params.isLatAndLon))
    .then((res) => res.json())
    .then((data) => {
      const nameOfPlace = data.name
      const tempInF = data.main.temp
      const secondsTillSunset = data.sys.sunset - data.dt
      const hoursTillSunset = Math.floor(secondsTillSunset / 3600)
      const minutesTillSunset = Math.floor(((secondsTillSunset / 3600) - hoursTillSunset) * 60)
      let previousEntryMessage = `Below is information for ${nameOfPlace}`
      let temperatureMessage = `Temperature in Fahrenheit: ${tempInF}`
      let sunsetMessage = `Time until sunset: ${hoursTillSunset} hours, ${minutesTillSunset} minutes`
      const allMessages = new DOMInteraction()
      allMessages.addContentToUl(previousEntryMessage)
      allMessages.addContentToUl(temperatureMessage)
      allMessages.addContentToUl(sunsetMessage)
    })
  }

  craftURL (isCityOrZip, isLatAndLon) {
    if (isCityOrZip) {
      FETCH_URL = this.baseURL + this.city_or_zip_parameter + this.input_value + this.fahrenheit_units + APP_ID
      return FETCH_URL
    }
    else if (isLatAndLon) {
      FETCH_URL = this.baseURL + this.lat_parameter + LAT + this.lon_parameter + LON + this.fahrenheit_units + APP_ID
      return FETCH_URL
    }
  }
}

class PageLoad {
  constructor (lastQuery) {
    this.last_query = localStorage.getItem(lastQuery)
    this.baseURL = 'http://api.openweathermap.org/data/2.5/weather?'
    this.city_or_zip_parameter = 'q='
    this.fahrenheit_units = '&units=imperial'
    this.last_fetch_URL = `${this.baseURL}${this.city_or_zip_parameter}${this.last_query}${this.fahrenheit_units}${APP_ID}`
  }

  populateOnPageLoad () {
    if (this.last_query) {
      fetch(this.last_fetch_URL)
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
        const allMessages = new DOMInteraction()
        allMessages.addContentToUl(previousEntryMessage)
        allMessages.addContentToUl(temperatureMessage)
        allMessages.addContentToUl(sunsetMessage)
      })
    }
  }
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
    const userLocationSearch = new Search()
    userLocationSearch.searchAPI({ isLatAndLon: true })
  }
}

class DOMInteraction {
  addContentToUl(message) {
    let weatherOutputParent = document.querySelector('.weather-output')
    let _li = document.createElement('li')
    _li.textContent = message
    weatherOutputParent.appendChild(_li)
  }
}

const getPreviousResults = () => {
  const previousLocation = new PageLoad('last_query')
  previousLocation.populateOnPageLoad()
}

const getUserLocationByGeo = () => {
  const userLocationSearch = new Geolocation()
  userLocationSearch.getLocation()
}

const getUserLocationByCityOrZip = () => {
  const userLocationSearch = new Search()
  userLocationSearch.searchAPI()
}

document.addEventListener('DOMContentLoaded', getPreviousResults)
document.querySelector('.get-lat-and-lon').addEventListener('click', getUserLocationByGeo)
document.querySelector('.get-city-or-zip').addEventListener('click', getUserLocationByCityOrZip)

