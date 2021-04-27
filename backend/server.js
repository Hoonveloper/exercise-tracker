const express =require('express');
const cors= require('cors');
const mongoose =require('mongoose'); //서버와 db 연결 .
var logger = require('morgan');


require('dotenv').config();
const port =process.env.port || 5000;
const app =express();
const uri = process.env.ATLAS_URI;
mongoose.connect(uri , {useNewUrlParser:true ,useCreateIndex:true ,useUnifiedTopology: true });
const connection =mongoose.connection;

app.use(logger('dev'));
connection.once('open', () => {
    console.log("mongodb db connection established ");

})
const exerciseRouter =require('./routes/exercises');
const userRouter =require("./routes/users");
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use('/exercises', exerciseRouter);
app.use('/users',userRouter);



app.listen(port, () => {
    console.log(`server started ${port}`);

})