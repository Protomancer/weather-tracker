/*First variable is the chosen city from the search field*/
let yourCity ="";
/*more global variables for the buttons and weather parameters*/
let findCity = $("#find-city");
let findButton = $("#find-city-button");
let wipeButton = $("#wipe-data");
let cityNow = $("#chosen-city");
let tempNow = $("#chosen-city-temp");
let humidNow= $("#chosen-city-humidity");
let windSpeedNow=$("#city-wind");
let uvNow= $("#city-uv");
let cityFinder=[];
/*looks through the storage for the  city*/
function seek(c){
    for (let i=0; i<cityFinder.length; i++){
        if(c.toUpperCase()===cityFinder[i]){
            return -1;
        }
    }
    return 1;
}
/*attach my API key to the script*/
let APIKey="b90035bb90f2061cad2c779598a0e8e9";
/* Pulls the weather data from the city chosen in the search field to display in main box*/
function showWeather(event){
    event.preventDefault();
    if(findCity.val().trim()!==""){
        yourCity=findCity.val().trim();
        weatherNow(yourCity);
    }
}
/*uses ajax to pull current weather data for chosen city from openweathermap*/
function weatherNow(city){
    let queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){
        console.log(response);
        /* Pulling weather icon from openweathermap*/
        let displayIcon= response.weather[0].icon;
        let weatherIcon="https://openweathermap.org/img/wn/"+displayIcon +"@2x.png";
        /*current date from response*/
        let dateNow=new Date(response.dt*1000).toLocaleDateString();
        /*pulls name and date from ajax response*/
        $(cityNow).html(response.name +"("+dateNow+")" + "<img src="+weatherIcon+">");
        /*pulls temps from ajax response and converts them to display*/
        let temps = (response.main.temp - 273.15) * 1.80 + 32;
        $(tempNow).html((temps).toFixed(2)+"&#8457");
        /*pulls humidity from the ajax response and displays*/
        $(humidNow).html(response.main.humidity+"%");
        /*pulls wind speed from the ajax response and displays*/
        let windNow=response.wind.speed;
        let windInMph=(windNow*2.237).toFixed(1);
        $(windSpeedNow).html(windInMph+"MPH");
        /*pulls UV Index data from the response and attaches it to the location and displays it*/
        showUvIndex(response.coord.lon,response.coord.lat);
        cityForecast(response.id);
        if(response.cod==200){
            cityFinder=JSON.parse(localStorage.getItem("chosenCity"));
            console.log(cityFinder);
            if (cityFinder==null){
                cityFinder=[];
                cityFinder.push(city.toUpperCase()
                );
                localStorage.setItem("chosenCity",JSON.stringify(cityFinder));
                appendList(city);
            }
            else {
                if(seek(city)>0){
                    cityFinder.push(city.toUpperCase());
                    localStorage.setItem("chosenCity",JSON.stringify(cityFinder));
                    appendList(city);
                }
            }
        }

    });
}
/*pulls the UV index and returns it*/
function showUvIndex(ln,lt){
    let uviURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    $.ajax({
            url:uviURL,
            method:"GET"
            }).then(function(response){
                $(uvNow).html(response.value);
            });
}
/*this grabs the ajax data to populate and display the 5 day forecast*/
function cityForecast(cityid){
    let dayDone= false;
    let searchForcastUrl="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    $.ajax({
        url:searchForcastUrl,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<5;i++){
            let dateNow= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            let iconSearch= response.list[((i+1)*8)-1].weather[0].icon;
            let weatherIcons="https://openweathermap.org/img/wn/"+iconSearch+".png";
            let tempPull= response.list[((i+1)*8)-1].main.temp;
            let temps=(((tempPull-273.5)*1.80)+32).toFixed(2);
            let humidPull= response.list[((i+1)*8)-1].main.humidity;
        
            $("#day"+i).html(dateNow);
            $("#icon"+i).html("<img src="+weatherIcons+">");
            $("#dayTemp"+i).html(temps+"&#8457");
            $("#dayHumid"+i).html(humidPull+"%");
        }
        
    });
}
/*add a list dropdown when you have chosen a city*/
function appendList(c){
    let dropList= $("<li>"+c.toUpperCase()+"</li>");
    $(dropList).attr("class","list-group-item");
    $(dropList).attr("data-value",c.toUpperCase());
    $(".list-group").append(dropList);
}
/*pulls the previous cities info when you click on the list*/
function pullPastSearches(event){
    let addListBack=event.target;
    if (event.target.matches("li")){
        yourCity=addListBack.textContent.trim();
        weatherNow(yourCity);
    }
}
/*shows the past cities in the list below the search*/
function showPastCity(){
    $("ul").empty();
    let cityFinder = JSON.parse(localStorage.getItem("chosenCity"));
    if(cityFinder!==null){
        cityFinder=JSON.parse(localStorage.getItem("chosenCity"));
        for(i=0; i<cityFinder.length;i++){
            appendList(cityFinder[i]);
        }
        yourCity=cityFinder[i-1];
        weatherNow(yourCity);
    }
} 
/*clears the search history*/
function histWipe(event){
    event.preventDefault();
    cityFinder=[];
    localStorage.removeItem("chosenCity");
    document.location.reload();
}
/*Click tracking*/
$("#find-city-button").on("click",showWeather);
$(document).on("click",pullPastSearches);
$(window).on("load",showPastCity);
$("#wipe-data").on("click",histWipe);
