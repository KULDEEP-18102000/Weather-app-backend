const axios=require('axios')
const Weather=require('../models/weather')

function convertTimeFormat(timeStr) {
    // Split the input string to get hours and minutes
    let [hours, minutes] = timeStr.split(':').map(Number);

    // Determine AM or PM
    let period = hours < 12 ? 'AM' : 'PM';

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12 || 12;  // 0 or 12 becomes 12

    // Format the time string
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
}


function checkDateRange(fromDate,toDate,date) {
    const fromDateObj = new Date(fromDate);
const toDateObj = new Date(toDate);
const dateObj = new Date(date);

// Check if date falls between fromDate and toDate
if (dateObj >= fromDateObj && dateObj <= toDateObj) {
//   console.log('The date is within the range.');
  return true
} else {
//   console.log('The date is not within the range.');
return false
}
}

function getConsecutiveDates(numDays) {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < numDays; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]); // Convert to yyyy-mm-dd format
    }
    
    return dates;
  }

exports.getCurrentWeather=async(req,res)=>{
    try {
        // console.log("reached here")
        // console.log(req.query)
        const response=await axios.get(`http://api.weatherapi.com/v1/current.json?q=${req.query.city}&key=48b51d40de9d4535990120450240909`)
        // console.log(currentWeatherData)
        let last_updated=response.data.current.last_updated
        let date=last_updated.split(" ")[0]
        let time=last_updated.split(" ")[1]

        let currentWeatherData=new Object()
        currentWeatherData.conditionIcon=response.data.current.condition.icon
        currentWeatherData.condition=response.data.current.condition.text
        currentWeatherData.temp_c=response.data.current.temp_c
        currentWeatherData.date=date
        currentWeatherData.time=time
        currentWeatherData.region=response.data.location.region
        currentWeatherData.city=req.query.city
        currentWeatherData.country=response.data.location.country
        currentWeatherData.feelslike_c=response.data.current.feelslike_c
        const weather=await Weather.findOne({"date":currentWeatherData.date,"time":currentWeatherData.time,"region":currentWeatherData.region})
        if(!weather){
            const insertedWeather=await Weather.create(currentWeatherData)
        }
        // console.log("inserted weather--",weather)
        res.status(200).json(currentWeatherData)
    } catch (error) {
        res.status(500).json({
            "error":error
        })
    }
}

exports.getForecast=async(req,res)=>{
    try {
        console.log(req.query)
        const response=await axios.get(`http://api.weatherapi.com/v1/history.json?q=${req.query.city}&key=48b51d40de9d4535990120450240909&dt=${req.query.date}`)
        const hours=response.data.forecast.forecastday[0].hour
        const forecase_data=[]
        for (let index = 0; index < hours.length; index++) {
            let obj=new Object()
            const element = hours[index];
            const time=convertTimeFormat(element.time.split(" ")[1])
            const temp_c=element.temp_c
            obj.time=time
            obj.temp_c=temp_c
            forecase_data.push(obj)
        }
        // console.log(forecase_data)
        res.status(200).json(forecase_data)
    } catch (error) {
        console.log(error)
    }
}

exports.getHistoricalData=async(req,res)=>{
    try {
        const {city,fromDate,toDate}=req.query
        let data
        if(city==null & fromDate==null & toDate==null){
            console.log("if")
            data=await Weather.find()
        // console.log(data)
        }else{
            console.log("else")
            data=await Weather.find({"city":city})
            console.log(data)
            data=data.filter((data)=>{
                if(checkDateRange(fromDate,toDate,data.date)==true){
                    return data
                }
            })
        }
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
    }
}

exports.getFiveDaysForeCastData=async(req,res)=>{
    try {
        const dates=getConsecutiveDates(5)
        // console.log(dates)
        const data=[]
        for (let index = 0; index < dates.length; index++) {
            const obj=new Object()
            const date = dates[index];
            const response=await axios.get(`http://api.weatherapi.com/v1/history.json?q=${req.query.city}&key=48b51d40de9d4535990120450240909&dt=${date}`)
            // console.log(response.data)
            
            obj.temperature=response.data.forecast.forecastday[0].day.avgtemp_c
            obj.condition=response.data.forecast.forecastday[0].day.condition.text
            obj.date=date

            data.push(obj)
        }
        // const data=dates.map(async(date)=>{
        //     const response=await axios.get(`http://api.weatherapi.com/v1/history.json?q=${req.query.city}&key=48b51d40de9d4535990120450240909&dt=${date}`)
        //     console.log(response)
        //     return response.data
        // })
        // console.log(data)
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
    }
}

exports.getDailyChartData=async(req,res)=>{
    try {
        const city_names=req.body.locations
    //    const city_names=['Delhi','Moscow','Paris','New York','Sydney','Riyadh']
       const temperatures=[]
       for (let index = 0; index < city_names.length; index++) {
        const city = city_names[index];
        
        const today = new Date();
      const date = new Date(today);
    //   date.setDate(today.getDate() - i);
    let today_date=date.toISOString().split('T')[0]; // Convert to yyyy-mm-dd format
    // console.log(today_date)

    const response=await axios.get(`http://api.weatherapi.com/v1/history.json?q=${city}&key=48b51d40de9d4535990120450240909&dt=${today_date}`)
            // console.log(response.data)

            temperatures.push(response.data.forecast.forecastday[0].day.avgtemp_c)
       }
    //    console.log(temperatures)
       const obj=new Object()
       obj.labels=city_names
       obj.datasets= [ { data: temperatures } ]

    //    console.log(obj)
        res.status(200).json(obj)
    } catch (error) {
        console.log(error)
    }
}