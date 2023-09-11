let yourweathertab = document.querySelector("[data-your-weather]")
let searchweathertab = document.querySelector("[data-search-weather]")
let searchform = document.querySelector("[data-search-form]")
let grantlocationcontainer = document.querySelector("[data-grant-container]")
let weathercontainer = document.querySelector("[data-weather-container]")
let gifcontainer = document.querySelector("[data-gif-container]")
let grantAccessBtn = document.querySelector("[data-grant-access-btn]")
let searchinput = document.querySelector("[data-search-input]")


let currenttab = yourweathertab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";


currenttab.classList.add("changes")


function swaptab(clickedtab) {
    if(currenttab != clickedtab) {
        currenttab.classList.remove("changes")
        currenttab = clickedtab;
        currenttab.classList.add("changes")

        if(!searchform.classList.contains("active")) {
            searchform.classList.add("active")
            grantlocationcontainer.classList.remove("active")
            weathercontainer.classList.remove("active")
        }
        else{
            searchform.classList.remove("active")
            weathercontainer.classList.remove("active")
            getfromsessionstorage();
        }
    }
}


yourweathertab.addEventListener("click",function() {
    swaptab(yourweathertab)
})
searchweathertab.addEventListener("click",function() {
    swaptab(searchweathertab);
} )


function getfromsessionstorage() {
    let localcoordinates = sessionStorage.getItem("user-items") 
    if(!localcoordinates) {
        grantlocationcontainer.classList.add("active")
    }
    else{
        let coordinates = JSON.parse(localcoordinates);
        fetchweatherinfo(coordinates)
    }
}

async function fetchweatherinfo(coordinates) {
    const {lat,lon} = coordinates;
    gifcontainer.classList.add("active")
    grantlocationcontainer.classList.remove("active")

    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        let result = await response.json()
        gifcontainer.classList.remove("active")
        weathercontainer.classList.add("active")
        renderweatherinfo(result)
    }
    catch(e) {
        alert(e.message)
        weathercontainer.classList.remove("active")
    }
}

function renderweatherinfo(weatherInfo) {

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

grantAccessBtn.addEventListener("click",getlocation)

function getlocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showposition)
    }
}

function showposition(position) {
    let usercoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }

    console.log(usercoordinates)

    sessionStorage.setItem("user-items",JSON.stringify(usercoordinates))
    fetchweatherinfo(usercoordinates)
}


searchform.addEventListener("submit",function(e) {
    e.preventDefault();
    let cityName = searchinput.value 

    if(cityName === "")
    return
    else{
        fetchsearchweatherinfo(cityName)
    }
})

async function fetchsearchweatherinfo(city) {
    gifcontainer.classList.add("active")
    grantlocationcontainer.classList.remove("active")
    weathercontainer.classList.remove("active")

    
    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        let result = await response.json()
        gifcontainer.classList.remove("active")
        weathercontainer.classList.add("active")
        renderweatherinfo(result)
    }
    catch(e) {
        alert(e.message)
      weathercontainer.classList.remove("active");
    }

}