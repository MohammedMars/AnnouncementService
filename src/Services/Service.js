const Log=require('../../log/Log.js');
const cSUCCESS =1;
const cFAIL =-1;
const cTIMEOUT=-3;
var Url;
var request = require('request');

function startUp(callBack,settings){
    try{
        Url=settings.serverAddress;
        callBack(cSUCCESS);
    }catch(err){
        Log.ErrorLogging(err);
        callBack(cFAIL);
    }
}

function ping(callBack,url){
    try{
        Url =url;
        var Message = {
            time: Date.now(),
            topicName: 'ExternalData/read',
            payload: {
                EntityName: "branch",
                orgid: "1"
            }
        };
        var args ={url:Url+"/PostMessage",json:true,body:Message};
        console.log(args.url);
        request.post(args,(err,response,body)=>{
            if(err){
                Log.ErrorLogging(err);
                callBack(cFAIL);
            }
            if(response){
                if(response.statusCode==200){
                    callBack(cSUCCESS);
                }else if(response.statusCode==408)
                    callBack(cTIMEOUT);
            }else{
                callBack(cFAIL);
            }
        })
    }catch(err){
        Log.ErrorLogging(err);
        callBack(cFAIL);
    }
}

function fetchBranches(callBack){
    try{
        var Message = {
            time: Date.now(),
            topicName: 'ExternalData/read',
            payload: {
                EntityName: "branch",
                orgid: "1"
            }
        };
        var args ={url:Url+"/PostMessage",json:true,body:Message};
        console.log("fetchBranches : "+args.url);
        request.post(args,(err,response,body)=>{
            if(err){
                Log.ErrorLogging(err);
                callBack(cFAIL,null);
            }
            var Branches=body.payload.branches;
            callBack(cSUCCESS,Branches);
        })
    }catch(err){
        Log.ErrorLogging(err);
        callBack(cFAIL,null);
    }
}

function fetchCounters(callBack,branchId){
    try{
        var Message = {
            topicName: 'ExternalData/read',
            payload: {
                EntityName: "counter",
                BranchID: branchId,
                orgid: "1",
                types: ["0", "3"]
            }
        };
        var args ={url:Url+"/PostMessage",json:true,body:Message};
        console.log(args.url);
        request.post(args,(err,response,body)=>{
            if(err){
                Log.ErrorLogging(err);
                callBack(cFAIL,null);
            }
            var Counters=body.payload.counters;
            callBack(cSUCCESS,Counters);
        })
    }catch(err){
        Log.ErrorLogging(err);
        callBack(cFAIL,null);
    }
}

function fetchHalls(callBack,branchId){
    try{
        var Message = {
            topicName: 'ExternalData/read',
            payload: {
                EntityName: "hall",
                orgid: "1",
                BranchID: branchId,
            }
        };
        var args ={url:Url+"/PostMessage",json:true,body:Message};
        console.log(args.url);
        request.post(args,(err,response,body)=>{
            if(err){
                Log.ErrorLogging(err);
                callBack(cFAIL,null);
            }
            var Halls=body.payload.halls;
            callBack(cSUCCESS,Halls);
        })
    }catch(err){
        Log.ErrorLogging(err);
        callBack(cFAIL,null);
    }
}

function getBranch(callBack,branchIdentity){
    try{
        var result=cFAIL;
        var branch=null;
        this.fetchBranches((Result,branches)=>{
            if(Result==cSUCCESS){
                for(let i =0 ; i< branches.length;i++){
                    if(branchIdentity==branches[i].Identity){
                        result=cSUCCESS;
                        branch=branches[i];
                        break;
                    }
                }
                if(result==cSUCCESS){
                    callBack(cSUCCESS,branch);
                }else{
                    callBack(cFAIL,null);
                }
            }else{
                callBack(cFAIL,null);
            }
        })
    }catch(err){
        Log.ErrorLogging(err);
    }
}

module.exports={
    startUp:startUp,
    ping:ping,
    fetchBranches:fetchBranches,
    fetchCounters:fetchCounters,
    fetchHalls:fetchHalls,
    getBranch:getBranch
}
