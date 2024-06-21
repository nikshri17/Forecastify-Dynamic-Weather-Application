const userLocation = document.getElementById("userLocation"),
    converter = document.getElementById("converter"),
    weatherIcon = document.querySelector(".weatherIcon"),
    temperature = document.querySelector(".temperature"),
    feelsLike = document.querySelector(".feelsLike"),
    description = document.querySelector(".description"),
    date = document.querySelector(".date"),
    city = document.querySelector(".city"),

    HValue = document.getElementById("HValue"),
    WValue = document.getElementById("WValue"),
    SRValue = document.getElementById("SRValue"),
    SSValue = document.getElementById("SSValue"),
    CValue = document.getElementById("CValue"),
    UVValue = document.getElementById("UVValue"),
    PValue = document.getElementById("PValue"),

    Forecast = document.querySelector(".Forecast");
    const data = null;

weather_api_endpoint = 'https://api.openweathermap.org/data/2.5/weather?appid=a5bb4718b30b6f58f58697997567fffa&q=';
weather_data_endpoint = 'https://api.openweathermap.org/data/2.5/onecall?appid=a5bb4718b30b6f58f58697997567fffa&exclude=minutely&units=metric';
    
function findUserLocation() {
    Forecast.innerHTML ="";
    fetch(weather_api_endpoint + userLocation.value)
    .then((response)=>response.json())
    .then((data)=>{
        if(data.cod != "" && data.cod != 200){
            alert(data.message);
            return;
        }
        console.log(data.coord.lon,data.coord.lat);
        console.log(data);

        city.innerHTML = data.name + ", " + data.sys.country
        weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`

        fetch(
            `${weather_data_endpoint}&lon=${data.coord.lon}&lat=${data.coord.lat}`
        )
        .then((response)=>response.json())
        .then((data)=>{
            console.log(data);

            temperature.innerHTML = tempConverter(data.current.temp);
            feelsLike.innerHTML = "Feels like " + data.current.feels_like;
            description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> &nbsp;` + data.current.weather[0].description

            const options={
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            }
            date.innerHTML = getLongFormatDateTime(
                data.current.dt, data.timezone_offset, options
            )

            HValue.innerHTML = Math.round(data.current.humidity)+"<span>%</span>"
            WValue.innerHTML = Math.round(data.current.wind_speed)+"<span>m/s</span>"
            const options1 = {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            };
            SRValue.innerHTML = getLongFormatDateTime(
                data.current.sunrise, data.timezone_offset, options1
            )
            SSValue.innerHTML = getLongFormatDateTime(
                data.current.sunset, data.timezone_offset, options1
            )
            CValue.innerHTML = data.current.clouds+"<span>%</span>"
            UVValue.innerHTML = data.current.uvi
            PValue.innerHTML = Math.round(data.current.humidity)+"<span>%</span>"
            
            data.daily.forEach((weather) => {
                let div = document.createElement("div");
                const options = {
                    weekday:'long',
                    month:'long',
                    day:"numeric"
                };
                let daily = getLongFormatDateTime(weather.dt, 0, options).split(" at ");
                div.innerHTML = daily[0];
                div.innerHTML += `<img src ="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" />`
                div.innerHTML += `<p class="forecast-desc">${weather.weather[0].description}`
                div.innerHTML += `<span><span>${tempConverter(weather.temp.min)}</span>
                &nbsp<span>${tempConverter(weather.temp.max)}</span></span>`
                Forecast.append(div);
            });
            
        });
    });
}
// for sunset and sunrise
function formatUnixTime(dtValue, offSet, options={}){
    const date = new Date((dtValue+offSet)*1000)
    return date.toLocaleTimeString([], { timeZone: "UTC", ...options})
}
function getLongFormatDateTime(dtValue,offSet,options){
    // const date = new Date(dtValue * 1000);
    // return date.toLocaleDateString("en-US", options);
    return formatUnixTime(dtValue,offSet,options)
}
function tempConverter(temp){
    let tempValue = Math.round(temp);
    let message=""
    if(converter.value=="°C"){
        message = tempValue+"<span>"+"\xB0C</span>"
    }
    else{
        let cToF = (tempValue*9)/5+32
        message = cToF+"<span>"+"\xB0F</span>"
    }
    return message;
}