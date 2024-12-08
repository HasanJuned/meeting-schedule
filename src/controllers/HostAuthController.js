const HostAuthModel = require("../models/HostAuthModel")
const HostProfileModel = require("../models/HostProfileModel")
const jwt = require("jsonwebtoken")
const OtpModel = require("../models/OtpModel")
const TaskModel = require("../models/TaskModel")
const SendEmailUtility = require("../utility/SendEmailUtility");

exports.Registration=async (req,res)=>{

  let reqBody = req.body;
  try{
    let result = await HostAuthModel.create(reqBody);
    res.status(200).json({status: "success", data: result})

  }catch(e){
    res.status(400).json({status: "fail", data: 'This email is already registered! Try again with different email'});
  }

}

exports.Login=async (req,res)=>{

  let reqBody = req.body;


  try{
    let result = await HostAuthModel.find(reqBody).count();
    if(result===1){
      let Payload = {
        exp:Math.floor(Date.now()/1000)+(24*60*60),
        data: reqBody['email']
      }

      let userDetails = await HostAuthModel.findOne(reqBody).select('-password');

      let token = jwt.sign(Payload, 'SecretKey123456789');
      res.status(200).json({status: "success", data: userDetails, token: token});


    }else{
      res.status(404).json({status: "fail", data: "No user found, Check email and password and try again!"})
    }

  }catch(e){
    res.status(200).json({status: "fail", data: e.message})
  }

}

exports.Profile=async (req,res)=>{

  let reqBody = req.body;
  try{
    let result = await HostProfileModel.create(reqBody);
    res.status(200).json({status: "success", data: result})

  }catch(e){
    res.status(400).json({status: "fail", data: 'This email is already registered! Try again with different email'});
  }

}

