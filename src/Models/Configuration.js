const Log=require('../../log/Log.js');
const cSUCCESS =1;
const cFAIL =-1;
const fs = require('fs');
var service=require('../Services/Service.js');
var Counters;
var Halls;
var Branches;
var Pages;

//For manage the announcement service configuration.

    //caching the languages for the view
    function SetCaptions(callBack){
        try{
            var allPages=[];
            fs.readdir("./captions", function(err, items) {
                if(err){
                    callBack(cFAIL);
                    Log.ErrorLogging(err);
                }else{
                    for (var i=0; i<items.length; i++) {
                        if(items[i].startsWith("caption_")){
                            var page =fs.readFileSync('./captions/'+items[i],"utf8");
                            allPages.push(JSON.parse(page));
                        }    
                    }
                    Pages=allPages;
                    callBack(cSUCCESS);
                }
            });
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL);
        }
    }

    //for check the connection
    module.exports.ping=function(callBack,url){
        try{
            service.ping((result)=>{
                callBack(result);
            },url);
            //Service
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL);
        }
    }

    //Save the setting for branch
    module.exports.saveSettings=function(callBack,data){
        try{
            fs.writeFile('./settings.json',JSON.stringify(data),(err)=>{
                if(err){
                    Log.ErrorLogging(err);
                    callBack(cFAIL);
                }else{
                    callBack(cSUCCESS);
                }
            });
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL);
        }
    }

    //Caching all the branches  
    function fetchBranches(callBack){
        try{
            service.fetchBranches((result,branches)=>{
                Branches=branches;
                callBack(cSUCCESS,Branches);
            })
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL,null);
        }
    }

    //Caching all the counters for specific branch
    function fetchCounters(callBack,branchId){
        try{
            service.fetchCounters((result,counters)=>{
                Counters=counters;
                callBack(cSUCCESS,Counters);
            },branchId)
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL,null);
        }
    }

    //Caching all the halls for specific branch
    function fetchHalls(callBack,branchId){
        try{
            service.fetchHalls((result,halls)=>{
                Halls=halls;
                callBack(cSUCCESS,Halls);
            },branchId)
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL,null);
        }
    }

    //Fetch the specific branch info and his counters and halls
    module.exports.fetchData=function(callBack,branchIdentity){
        try{
            fetchBranches((result,branches)=>{
                getBranch((result,branch)=>{
                    if(result==cSUCCESS){
                        fetchHalls(()=>{
                            fetchCounters(()=>{
                                callBack(cSUCCESS,{branch:branch,halls:Halls,counters:Counters});
                            },branch.ID)
                        },branch.ID)
                    }else{
                        callBack(cFAIL,null);
                    }
                },branchIdentity)
            });
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL,null);
        }
    }

    //Get info about specific branch
    function getBranch(callBack,branchIdentity){
        try{
            var result=cFAIL;
            var branch=null;
                for(let i = 0 ; i<Branches.length ; i++){
                    if(branchIdentity==Branches[i].Identity){
                        branch=Branches[i];
                        result=cSUCCESS;
                        break;
                    }
                }
                callBack(result,branch);
        }catch(err){
            Log.ErrorLogging(err);
        }
    }
    //Get the page view for specific language
    module.exports.getPage=function(callBack,language){
        try{
            var result=cFAIL;
            var page=null;
            for(let i = 0 ; i<Pages.length ; i++){
                if(Pages[i].language == language){
                    result=cSUCCESS;
                    page=Pages[i];
                }
            }
            callBack(result,page);
        }catch(err){
            Log.ErrorLogging(err);
        }

    }

    SetCaptions((result)=>{
    });