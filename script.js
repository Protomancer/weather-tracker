/*Making a variable to hold the searched city*/
let yourCity="";

/* The rest of the global variables*/
let searchTrack = $('#city-search-field');
let trackButton = $('#city-search-button');
let historyWipe = $('#history-wipe');
let cityNow = $('#city-now');
let tempNow = $('#temp');
let humidNow = $('#humidity');
let windNow = $('#wind');
let uvNow = $('#uv-index');
let citySeeker=[];
/*will search the cities in the database storage*/
function seek(c){
    for (let i=0; i<citySeeker.length; i++){
        if(c.toUpperCase()===citySeeker[i]){
            return -1;       
        }
    }
    return 1;
}
/*Given api key*/
let APIkey= 'b90035bb90f2061cad2c779598a0e8e9';
/*will display weather for the chosen city from input*/
function showWeather(event){
    event.preventDefault();
    if(searchTrack.val().trim()!==''){
        yourCity=searchTrack.val().trim();
        cityNow(yourCity);
    }
}
/*AJAX call function*/
function weatherNow(yourCity){
    /*should pull the data for chosen city from the following url variable*/
    let queryURL= 'https://api.openweathermap.org/data/2.5/weather?' + yourCity + '&appid='+ APIkey;
    $.ajax({
        url:queryURL,
        method:'GET',
    }).then(function(response){
        /*should parse the response for current weather data*/
        console.log(response);
        /*Icon info from open weather*/
        let weathericon= response.weather[0].icon;
        let iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        /*mozilla date format*/
        let date=new Date(response.dt*1000).toLocaleDateString();
        /*parse response and concat date and icon*/
        $(cityNow).html(response.name + '('+date+')' + '<img src='+iconurl+'>');
    }
}