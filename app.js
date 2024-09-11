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



// mongoose
  // .connect('mongodb+srv://jadonkuldeepsingh2:cK85oQfwJfbt1yML@cluster0.izbkthq.mongodb.net/', {
    // useNewUrlParser: true, // The underlying MongoDB driver has deprecated their current connection string parser. Because this is a major change, they added the useNewUrlParser flag to allow users to fall back to the old parser if they find a bug in the new parser.
    // useCreateIndex: true, // Again previously MongoDB used an ensureIndex function call to ensure that Indexes exist and, if they didn't, to create one. This too was deprecated in favour of createIndex . the useCreateIndex option ensures that you are using the new function calls.
    // useFindAndModify: false, // findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead.
    // useUnifiedTopology: true, // Set to true to opt in to using the MongoDB driver's new connection management engine. You should set this option to true , except for the unlikely case that it prevents you from maintaining a stable connection.
  // })
  // .then((con) => {
    // console.log("DB Connection successful");
    // app.listen(3000)
    // console.log("server listening on port 3000")
  // });


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