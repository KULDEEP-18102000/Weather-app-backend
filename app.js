const express=require('express')
const app=express()
const fs = require('fs');
const path=require('path')
const { MongoClient } = require('mongodb');
// const connectToDB=require('./utils/database')
const weatherRoutes=require('./routes/weatherRoutes')

const dotenv = require('dotenv');
dotenv.config();

const cors=require('cors')

const BodyParser=require('body-parser')

const mongoose=require('mongoose')


app.use(cors())

app.use(BodyParser.json({extended:false}))

app.use('/weather',weatherRoutes)


  mongoose
  .connect('mongodb://localhost:27017/Weather', {
    useNewUrlParser: true,  // Use the new URL parser for MongoDB
    useUnifiedTopology: true,  // Use the unified topology for the MongoDB driver
  })
  .then(() => {
    console.log("DB Connection successful");
    app.listen(3000, () => {
      console.log("Server listening on port 3000");
    });
  })
  .catch((error) => {
    console.error("DB Connection error:", error);
  });