const Log=require('../../log/Log.js');
const cSUCCESS =1;
const cFAIL =-1;
const cINVALID_LANGUAGE=-2;
const player = require('node-wav-player');
const shell = require('node-powershell');
var ps;
var LinuxShell = require('shelljs');
const fs = require('fs');
var Files=[];
var settings;
var branchId;
var cCONFIGURATION_URL="http://localhost:8080/Configurations";
var service=require('../Services/Service.js');
const cFIRST_STATEMENT="Statement01";
const cSECOND_STATEMENT="Statement02";
const cWindows="win32";
const cLINUX ="linux";
const cBRANCH_LEVEL=1;
const cHALLS_LEVEL=2;
const cCOUNTER_LEVEL=3;
var command;


    module.exports.setConfigurations=function(){
        try{
            if(process.platform==cWindows){
                if(ps==null){
                    ps = new shell({
                        executionPolicy: 'Bypass',
                        noProfile: true
                    });
                }
                command = "explorer '"+cCONFIGURATION_URL+"'";
                ps.addCommand(command);
                ps.invoke();
            }else if(process.platform==cLINUX){
                command = "xdg-open "+cCONFIGURATION_URL;
                LinuxShell.exec(command,{async:true},()=>{});
            }
        }catch(err){
            Log.ErrorLogging(err);
        }
    }

    //To caching the settings and branch configurations
    module.exports.Start=function(callBack){
        try{
            if(process.platform==cWindows && ps==null){
                ps = new shell({
                    executionPolicy: 'Bypass',
                    noProfile: true
                    });
            }
            readSettings((result,dataSettings)=>{
                if(result==cSUCCESS){
                    settings=dataSettings;
                    service.startUp((result)=>{
                        if(result==cSUCCESS){
                            service.getBranch((result,branch)=>{
                                branchId=branch.ID;
                                readAllFiles(()=>{
                                    callBack(settings.serverAddress);
                                });
                            },settings.branchIdentity)
                        }
                    },settings)       
                }else if(result==cFAIL){
                    callBack(null); 
                }
            });
        }catch(err){
            Log.ErrorLogging(err);
        }
    }

    //Read the sounds file
    function readAllFiles(callBack){
        try{
            var allFiles=[];
            fs.readdir("./sounds", function(err, items) {
                if(err){
                    Log.ErrorLogging(err);
                    callBack(cFAIL,null);
                }else{
                    for (var i=0; i<items.length; i++) {
                        if(items[i].startsWith("PAnnounce_")){
                            var files =[];
                            var row=[];
                            var data =fs.readFileSync('./sounds/'+items[i],"utf16le");
                                let table = data.toString().split('\r\n');
                                for(let i=0; i<table.length;i++){
                                    row = table[i].split('\t');
                                    files.push(row);
                                }
                                allFiles.push({language : items[i].substr(10,2) , files:files , SoundsFile:table[0].trim()});
                        }    
                    }
                    Files=allFiles;
                    callBack(cSUCCESS,Files);
                }
            });
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL,null);
        }
    }
    
    function removeEmptyRecords(callBack,rows){
        try{
        if(rows){
            var records=[];
            for(let i = 0 ; i < rows.length ; i++){
                records.push(rows[i].filter(Boolean));
            }
            callBack(cSUCCESS,records);
        }else{
            callBack(cFAIL,null); 
        }
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL,null); 
        }
    }

    function getOneFileSet(callBack,language){
        try{
            if(Files){
                var rows = Files.find((item)=>{return item.language==language});
                if(rows){
                    callBack(cSUCCESS,rows.files);
                }else{
                    callBack(cINVALID_LANGUAGE,null);
                }
            }else{
                callBack(cFAIL,null);
            }
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL,null);
        }
    }

    //Prepare the sounds file for specific language 
    function getRecords(callBack,language){
        try{
            getOneFileSet((result,rows)=>{
                if(result==cSUCCESS){
                    removeEmptyRecords((result,recods)=>{
                        callBack(result,recods);
                    },rows)
                }else{
                    callBack(result,null);
                }
            },language)
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL,null);
        }
    }

    //Get the required files to announce for the specific ticket 
    function getFiles(callBack,filterdMessage){
        try{
            var customerNumber=filterdMessage.customerNumber;
            var counterNumber=filterdMessage.counterNumber;
            var language=filterdMessage.language;
            var rows=[];
            var Result=true;
            getRecords((result ,data)=>{
                if(result==cSUCCESS){
                    rows=data;
                    var files=[];
                    //customer holding number
                    files.push(cFIRST_STATEMENT);
                    var index=-1;
                    //letter
                        for(let i=1;i<rows.length;i++){
                            if(customerNumber[0].toLowerCase()==rows[i][0] || customerNumber[0].toUpperCase()==rows[i][0]  )
                                index=i;
                        }
                        if(index==-1){
                            Result=false;
                        }else{
                            var Tuple =Array();
                            Tuple=rows[index];
                            for(let j=1;j<Tuple.length;j++){
                                files.push(Tuple[j]);
                            }
                        }
                    index=-1;
                    //customerNumber
                        for(let i=0;i<rows.length;i++){
                            if(customerNumber.substring(2)==rows[i][0] && ! isNaN(customerNumber.substring(2))){
                                index=i;
                                break;
                            }
                        }
                        if(index==-1){
                            Result=false;
                        }else{
                            var Tuple2 =Array();
                            Tuple2= rows[index];
                            for(let j=1;j<Tuple2.length;j++){
                                files.push(Tuple2[j]);
                            }
                        }
                    //please go to window number
                    files.push(cSECOND_STATEMENT);
                    //counterNumber
                    index=-1;
                        for(let k=0;k<rows.length;k++){
                            if(counterNumber==rows[k][0] && ! isNaN(customerNumber.substring(2))){
                                index=k;
                                break;
                            }
                        }
                        if(index==-1){
                            Result=false;
                        }else{
                            var Tuple3 =Array();
                            Tuple3= rows[index];
                            for(let j=1;j<Tuple3.length;j++){
                                    files.push(Tuple3[j]);
                            }
                        }
                        if(Result){
                            callBack(cSUCCESS,files);
                        }else{
                            callBack(cFAIL,null);
                        }
                }else if (result==cFAIL){
                    callBack(cFAIL,null);
                }else if(result==cINVALID_LANGUAGE){
                    callBack(cINVALID_LANGUAGE,null);
                }
            },language);
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL,null);
        }
    }

    function isValidBranch(callBack,message){
        try{
            var result;
            if(message.payload.transactionsInfo[0].branch_ID == branchId){
                result=cSUCCESS;
            }else{
                result=cFAIL;
            }
            callBack(result);
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL);
        }
    }

    function isValidHalls(callBack,message){
        try{
            isValidBranch((result)=>{
                if(result==cSUCCESS){
                    var temp = settings.halls.find((item)=>{return item.ID==message.payload.transactionsInfo[0].hall_ID})
                    if(temp)
                        result=cSUCCESS;
                    else
                        result=cFAIL;
                }else{
                    result=cFAIL;
                } 
                callBack(result)
                },message)
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL);
        }
    }

    function isValidCounters(callBack,message){
        try{
            isValidBranch((result)=>{
                if(result){
                    var temp = settings.counters.find((item)=>{return item.ID==message.payload.transactionsInfo[0].counter_ID})
                    if(temp)
                        result=cSUCCESS;
                    else
                        result=cFAIL;
                }else{
                    result=cFAIL;
                }
                callBack(result)
            },message)
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL);
        }
    }

    function prepareMessage(callBack,message){
        try{
            var finalResult;
            isValidMessage((result)=>{
                if(result==cSUCCESS){
                    if(settings.level==cBRANCH_LEVEL){
                        isValidBranch((result)=>{
                            finalResult=result;
                        },message)
                    }else if(settings.level==cHALLS_LEVEL){
                        isValidHalls((result)=>{
                            finalResult=result;
                        },message)
                    }else if(settings.level==cCOUNTER_LEVEL){
                        isValidCounters((result)=>{
                            finalResult=result;
                        },message)
                    }
                }else{
                    finalResult=cFAIL;
                }
                callBack(finalResult);
            },message);
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL);
        }
    }

    //Filtering the broad cast message to check if the message for any branch
    function filter(callBack,message){
        try{
            prepareMessage((result)=>{
                if(result==cSUCCESS){
                    var letter = message.payload.transactionsInfo[0].symbol;
                    var customerNumber =letter+"-"+ message.payload.transactionsInfo[0].ticketSequence;
                    var counterId = message.payload.countersInfo[0].id;
                    var temp =settings.counters.find((item)=>{return item.ID==counterId});
                    var counterNumber=temp.Number;
                var filterdMessage={"letter":letter,"customerNumber":customerNumber,"counterNumber":counterNumber,language:"en",SoundsFileName:""}
                callBack(cSUCCESS,filterdMessage);
                }else{
                    callBack(cFAIL,null);
                }
            },message)
    }catch(err){
        Log.ErrorLogging(err);
        callBack(cFAIL,null);
    }
    }

    function isMessage(callBack,message){
        try{
            if(message.payload.transactionsInfo && message.payload.transactionsInfo.length>0){
                callBack(cSUCCESS);
            }else{
                callBack(cFAIL);
            }
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL);
        }
    }

    function isValidMessage(callBack,message){
        try{
            isMessage((result)=>{
                if(result==cSUCCESS){
                    if(message.payload.transactionsInfo[0].state==3 || message.payload.transactionsInfo[0].state==5){
                        callBack(cSUCCESS);
                    }else{
                        callBack(cFAIL);
                    }
                }else{
                    callBack(cFAIL);
                }
            },message)
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL);
        }
    }

    function getSoundsFileName(callBack,filterdMessage){
        try{
            var SoundsFileName="No File";
            for(let i=0;i<Files.length;i++){
                if(Files[i].language==filterdMessage.language){
                    SoundsFileName=Files[i].SoundsFile;
                }
            }
            callBack(SoundsFileName);
        }catch(err){
            Log.ErrorLogging(err);
            callBack(cFAIL);
        }
    }
    //Announce a filtered message
    module.exports.Play=function(callBack,message){
        try{
            filter((result,filterdMessage)=>{
                if(result==cSUCCESS){
                    getSoundsFileName((SoundsFileName)=>{
                        getFiles((innerResult,files)=>{
                            if(innerResult==cSUCCESS){
                                if(process.platform==cWindows){
                                    play_Windows(files,SoundsFileName);
                                }else{
                                    var index=0;
                                    play_XOS(files,index,SoundsFileName);
                                }
                            }
                            callBack(innerResult);
                            },filterdMessage)
                    },filterdMessage)
                }
                callBack(result);
            },message)
        }catch(err){
            Log.ErrorLogging(err);
        }
    }

    //Announce a filtered message for Windows platform
    function play_Windows(files,SoundsFileName){
        try{
            let command = "";
                for(let i=0;i<files.length;i++){
                    command+="(New-Object Media.SoundPlayer '"+'./sounds/'+SoundsFileName+'/'+files[i]+".wav'"+").PlaySync()\n";
                }
                ps.addCommand(command);
                ps.invoke();    
        }catch(err){
            Log.ErrorLogging(err);
        }        
    }

    //Announce a filtered message for Linux or mac platform
    function play_XOS(file,index,SoundsFileName){
        try{
            player.play({
            path: './sounds/'+SoundsFileName+'/'+file[index++]+'.wav',sync:true
            }).then(() => {
                if(index<file.length)
                    play_XOS(file,index,SoundsFileName); //Recursive call 
                else{
                    //Stop
                }
            }).catch((error) => {
                Log.ErrorLogging(error);
            });
        }catch(err){
            Log.ErrorLogging(error);
        }
    }

    //Read the branch settings
    function readSettings(callBack){
        try{
            fs.exists('./settings.json',(exists)=>{
                if(exists==true){
                    fs.readFile('./settings.json',(err,data)=>{
                        if(data){
                            if(data.toString().length>1){
                                settings = JSON.parse(data.toString());
                                callBack(cSUCCESS,settings);
                            }else{
                                settings = null;
                                callBack(cFAIL,settings);
                            }
                        }else{
                            settings = null;
                            callBack(cFAIL,settings);
                        }
                        });    
                }else{
                    Log.ErrorLogging("Can't find the path of settings file");
                    callBack(cFAIL,null);
                } 
            })
        }catch(err){
            Log.ErrorLogging(err);
        }
    }

