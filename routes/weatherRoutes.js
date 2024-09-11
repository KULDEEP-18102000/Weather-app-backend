const router = require("express").Router();
const weatherController=require('../controllers/weatherController')

router.get('/getCurrentWeather',weatherController.getCurrentWeather)

router.get('/getForecast',weatherController.getForecast)

router.get('/getHistoricData',weatherController.getHistoricalData)

router.get('/getFiveDaysForecastData',weatherController.getFiveDaysForeCastData)

router.post('/getDailyChartData',weatherController.getDailyChartData)


module.exports = router;