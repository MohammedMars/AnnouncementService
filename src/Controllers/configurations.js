const cSUCCESS =1;
const cFAIL =-1;
var express = require('express');
var router = express.Router();
var announcement = require('../Models/Announcement.js');
var Config = require('../Models/Configuration.js');
const Log=require('../../log/Log.js');
var Settings = require('../Models/Settings.js');
var settings;
var language="en";

function getPageview(req, res) {
  try{
      Config.getPage((result,page)=>{
        if(result==cSUCCESS)
          res.render('index',{page:page});
        else if(result==cFAIL)
          Log.ErrorLogging("Can't Load the Page");
          res.end();
      },language)
    }catch(err){
      Log.ErrorLogging(err);
    }
}

function ChangePageLanguage (req, res) {
  try{
    language= req.params.language;
    Config.getPage((result)=>{
      if(result==cSUCCESS)
         res.send({result:result});
      else if(result==cFAIL){
        Log.ErrorLogging("Can't Find the Language");
         res.send({result:result});
      }
      res.end();
    },language)
  }catch(err){
    Log.ErrorLogging(err);
  }
}

function saveConfigurations(req,res){
  try{
    settings=req.body;
      Config.saveSettings((result)=>{
        if(result==cSUCCESS){
          res.send({result:cSUCCESS});
          announcement.Start();
        }else if (result==cFAIL){
          Log.ErrorLogging("The Configuration Dose not save");
          res.send({result:cFAIL});
        }
      },settings)
  }catch(err){
    Log.ErrorLogging(err);
  }
}

function checkConnections (req,res){
  try{
    var serverAddress=req.body.serverAddress;
    Config.ping((result)=>{
      res.send({result:result});
    },serverAddress)
  }catch(err){
    Log.ErrorLogging(err);
  }
}

function checkBranchIdentity(req,res){
  try{
    var branchIdentity=req.params.branchIdentity;
        var settingsModel = new Settings();
        settingsModel.fetchSettings((result)=>{
          if(result==cSUCCESS)
            res.send({fetchingResult:result,result:settingsModel});
          else
            res.send({fetchingResult:result,result:null});
        },branchIdentity)
    }catch(err){
      Log.ErrorLogging(err);
    }
}
//Get Page view
router.get('/',getPageview);

//Change Page Language
router.get('/:language',ChangePageLanguage)

//Save Configurations
router.post('/',saveConfigurations);

//Check Configurations
router.post('/Connection',checkConnections);

//Check Branch Identity
router.get('/:language/:branchIdentity',checkBranchIdentity);

module.exports = router;
