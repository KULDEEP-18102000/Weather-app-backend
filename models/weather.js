const mongoose=require('mongoose')

const Schema=mongoose.Schema

const weatherSchema=new Schema({
    condition:{
        type:String,
        required:true
    },
    temp_c:{
        type:Number,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    region:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    feelslike_c:{
        type:Number,
        required:true
    }
})

module.exports=mongoose.model('Weather',weatherSchema)