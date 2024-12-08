const GuestAuthModel = require("../models/GuestAuthModel")
const jwt = require("jsonwebtoken")
const OtpModel = require("../models/OtpModel")
const TaskModel = require("../models/TaskModel")
const SendEmailUtility = require("../utility/SendEmailUtility");
const GuestProfileModel = require('../models/GuestProfileModel');

exports.Registration=async (req,res)=>{

    let reqBody = req.body;
    try{
        let result = await GuestAuthModel.create(reqBody);
        res.status(200).json({status: "success", data: result})

    }catch(e){
        res.status(400).json({status: "fail", data: 'This email is already registered! Try again with different email'});
    }

}

exports.Login=async (req,res)=>{

    let reqBody = req.body;


    try{
        let result = await GuestAuthModel.find(reqBody).count();
        if(result===1){
            let Payload = {
                exp:Math.floor(Date.now()/1000)+(24*60*60),
                data: reqBody['email']
            }

            let userDetails = await GuestAuthModel.findOne(reqBody).select('-password');

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
    let result = await GuestProfileModel.create(reqBody);
    res.status(200).json({status: "success", data: result})

  }catch(e){
    res.status(400).json({status: "fail", data: 'This email is already registered! Try again with different email'});
  }

}

exports.BookedByUser = async (req, res) => {
  let guestEmail = req.params.email;

  try {
    let result = await GuestProfileModel.findOne({ email: guestEmail });

    if (result) {
      return res.status(200).json({ status: "success", data: result });
    } else {
      return res.status(404).json({ status: "fail", data: 'No registration found with this email.' });
    }
  } catch (e) {
    res.status(500).json({ status: "fail", data: 'An error occurred. Please try again.' });
  }
};

