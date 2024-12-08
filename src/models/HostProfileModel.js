const  mongoose=require('mongoose');
const DataSchema=mongoose.Schema({
  email:{type:String},
  fullName:{type:String},
  title:{type:String},
  companyName:{type:String},
  mobile:{type:String},
  timeZone:{type:String},
  createdDate:{type:Date,default:Date.now()}
},{versionKey:false});
const HostProfileModel=mongoose.model('hostProfiles',DataSchema);
module.exports=HostProfileModel
