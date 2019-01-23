const cSUCCESS =1;
const cFAIL =-1;
const cTIMEOUT=-3;
const cREFUSECONNECTION=-4;
var host = window.location.hostname;

if(host=='localhost')
    host+=":8080";

function httpConnect(callBack,serverAddress){
    try{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', "//"+host+"/Configurations/Connection", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            var result=JSON.parse(this.responseText).result;
            callBack(result);
        };
        xhr.ontimeout=function(){
            callBack(cTIMEOUT);
        }
        xhr.send(JSON.stringify({'serverAddress':serverAddress}));
    }catch(err){
        console.log(err);
    }
}

function httpCheckIdentity(callBack,language,branchIdentity){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "//"+host+"/Configurations/"+language+"/"+branchIdentity, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            var data =JSON.parse(this.responseText).result;
            var fetchingResult =JSON.parse(this.responseText).fetchingResult;
            callBack(fetchingResult,data);
        };
        xhr.send();
}

function httpChangeLanguage(callBack,language){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "//"+host+"/Configurations/"+language, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        var result=JSON.parse(this.responseText).result;
        if(result==cSUCCESS){
            callBack(result);
        }else{
            callBack(cFAIL);
        }
    }
    xhr.send();
}

function httpSaveSettings(callBack,settings){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "//"+host+"/Configurations/", true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = function () {
        var result=JSON.parse(this.responseText).result;
        if(result==cSUCCESS)
            callBack(result)
        else
            callBack(cFAIL)
    };
    xhr.send(JSON.stringify(settings));
}