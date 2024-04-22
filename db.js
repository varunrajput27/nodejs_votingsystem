const mongoose=require('mongoose');
require('dotenv').config();

//define the mongodb connection url
//const mongoURL='mongodb://localhost:27017/voting' //replace 'mybdatabase with your database'
//const mongoURL='mongodb+srv://varunrajput27:Kusum27@hotels.9simfhh.mongodb.net/'//
//const mongoURL=process.env.DB_URL;
const mongoURL=process.env.DB_URLLOCAL;

 //set up mongodb connection
mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
 })

//get the default connection
//mongoose maintain a default connection object representing thr mongodb connection
 const db=mongoose.connection;

 //define event listenerd for thr databse connection
 db.on('connected',()=>{
    console.log("connected to mongodb server");
 })
 db.on('disconnected',()=>{
    console.log("mongodb disconnected");
 })
 db.on('error',()=>{
    console.log(" error in mongodb connection");
 })

 // export the database coneection
 module.exports=db;