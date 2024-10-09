const { timeStamp } = require('console');
const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true ,
    },
    email:{
        type:String,
        require:true,
        uniuqe:true
    },
    password:{
        type:String,
        require:true, 
    },
    avatar:{
        type:String,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw2VLF-1FtNhlNpu6wOZ8Wqd&ust=1727862597130000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCNDgqfbz7IgDFQAAAAAdAAAAABAE"
    }
},{timestamps: true})

const User=mongoose.model('User',userSchema)
module.exports = User ;
