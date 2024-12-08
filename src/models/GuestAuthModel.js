const  mongoose=require('mongoose');
const DataSchema=mongoose.Schema({
    email:{type:String,unique:true},
    password:{type:String},
    createdDate:{type:Date,default:Date.now()}
},{versionKey:false});
const GuestAuthModel=mongoose.model('guestAuths',DataSchema);
module.exports=GuestAuthModel
