const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const userSchema= new Schema({
    username:{
        type:String,
        require:true,
        unique:true,
        trim:true,
        minlength:3
    },
},{

    timestamps:true,
});


const User =mongoose.model('User', userSchema); //user은 그냥 이름임. mongoose.model이 호출 될 때 스키마가 등록됨. 

module.exports =User;