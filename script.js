const API_KEY = "aa9006fc532642930f66a5aabaa21014";

const getCurrentWeather = async (pos) => {
    console.log(pos);
    let resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos[0]}&lon=${pos[1]}&appid=${API_KEY}&units=metric`);
    return resp.json();
}
const getHourlyWeather = async(pos)=>{
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    let resp = await (await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${pos[0]}&lon=${pos[1]}&appid=${API_KEY}&units=metric`)).json();
    return resp.list.map(item=>{
        const {main:{temp},weather:[{icon}],dt_txt} = item;
        let arr = dt_txt.split(" ");
        date  = new Date(arr[0]);
        let day = days[date.getDay()];
        let time = dt_txt.split(" ")[1];
        time = day+'\n'+time; 
        return {temp,icon,time};
    });
}
const loadCurrentForecast = ({name,main:{temp,temp_min,temp_max,feels_like,humidity},weather:[{description}]})=>{
    const currentForecast = document.querySelector("#current-forecast");
    console.log(name);
    currentForecast.querySelector(".city_name").textContent = name;
    currentForecast.querySelector(".temp").textContent = temp+String.fromCharCode(176)+"C";
    currentForecast.querySelector(".high-low").textContent = `H : ${temp_min+String.fromCharCode(176)+"C"} L : ${temp_max+String.fromCharCode(176)+"C"}`;
    currentForecast.querySelector(".desc").textContent = description;
    const feelsLike = document.querySelector("#feels-like");
    const humi = document.querySelector("#humidity");
    feelsLike.querySelector(".temp").textContent = feels_like+String.fromCharCode(176)+"C";
    humi.querySelector(".value").textContent = humidity;
}
const loadHourlyData = (hourlyData)=>{
    const hourlyForecast = document.querySelector("#hourly-container");
    let hourSkel = hourlyForecast.querySelector(".single-hour");
    hourSkel.querySelector(".he2").textContent = hourlyData[0].time;
    hourSkel.querySelector(".temp").textContent = hourlyData[0].temp+String.fromCharCode(176)+"C";
    hourSkel.querySelector(".icon").src = `http://openweathermap.org/img/w/${hourlyData[0].icon}.png`;
    console.log(hourSkel);
    for(let i=1;i<6;i++)
    {
        let newHour = document.createElement("article");
        newHour.className = "single-hour";
        newHour.innerHTML = `<h2 class="he2">Now</h2>
                            <img src="" alt="" class="icon">
                            <p class="temp">temp</p>`;
        newHour.querySelector(".he2").textContent = hourlyData[i].time;
        newHour.querySelector(".temp").textContent = hourlyData[i].temp+String.fromCharCode(176)+"C";
        newHour.querySelector(".icon").src = `http://openweathermap.org/img/w/${hourlyData[i].icon}.png`;
        hourlyForecast.appendChild(newHour);
    }
}
const getLocation = async()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(geoSuccess);
    }
}
async function geoSuccess(position){
    const currentData = await getCurrentWeather([position.coords.latitude,position.coords.longitude]);
    loadCurrentForecast(currentData);
    const hourlyData = await getHourlyWeather([position.coords.latitude,position.coords.longitude]);
    console.log(hourlyData);
    loadHourlyData(hourlyData);
}
document.addEventListener("DOMContentLoaded",async()=>{
    getLocation();
});