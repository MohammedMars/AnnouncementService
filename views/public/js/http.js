const cSUCCESS =1;
const cFAIL =-1;
const cTIMEOUT=-3;
var host = window.location.hostname;


//xmlhttpRequest
function httpConnect(callBack,serverAddress){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "//"+host+":8080/Configurations/Connection", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.timeout=10000;
    xhr.onload = function () {
        var result=JSON.parse(this.responseText).result;
        callBack(result);
    };
    xhr.ontimeout=function(){
        callBack(cTIMEOUT);
    }
    xhr.send(JSON.stringify({'serverAddress':serverAddress}));
}

function httpCheckIdentity(callBack,language,branchIdentity){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "//"+host+":8080/Configurations/"+language+"/"+branchIdentity, true);
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
    xhr.open('GET', "//"+host+":8080/Configurations/"+language, true);
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
    xhr.open('POST', "//"+host+":8080/Configurations/", true);
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