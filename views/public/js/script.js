const cBRANCH_LEVEL=1;
const cHALLS_LEVEL=2;
const cCOUNTER_LEVEL=3;
var branch;
var counters=[];
var addedCounters=[];
var halls=[];
var addedHalls=[];
var language;;
var vaildBranchIdentity=false;
var settings ;
var isConnect=false;
var EMPTY="";
var level=cBRANCH_LEVEL;
var connectionCheck1;
var connectionCheck2;
var connectionCheck3;
var connectionCheck4;
var connectionCheck5;
var connectionCheck6;
var connectionCheck7;
var IdentityCheck1;
var IdentityCheck2;

function loadingDataAndEvent(){
    connectionCheck1=document.getElementById('connectionCheck1').innerHTML;
    connectionCheck2=document.getElementById('connectionCheck2').innerHTML;
    connectionCheck3=document.getElementById('connectionCheck3').innerHTML;
    connectionCheck4=document.getElementById('connectionCheck4').innerHTML;
    connectionCheck5=document.getElementById('connectionCheck5').innerHTML;
    connectionCheck6=document.getElementById('connectionCheck6').innerHTML;
    connectionCheck7=document.getElementById('connectionCheck7').innerHTML;
    IdentityCheck1=document.getElementById('IdentityCheck1').innerHTML;
    IdentityCheck2=document.getElementById('IdentityCheck2').innerHTML;
    IdentityCheck3=document.getElementById('IdentityCheck3').innerHTML;
    language=document.getElementById('pageLanguage').innerHTML;
    var options =document.getElementById('language').options;
    for(var i=0;i<options.length;i++){
        if(options[i].value==language){
            document.getElementById('language').selectedIndex=i;
            break;
        }
    }
    var input = document.getElementById("branchIdentity");
    input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("myBtn").click();
    }
    });
    var input2 = document.getElementById("serverAddress");
    input2.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("myBtn").click();
    }
    });
}

function start(){
    loadingDataAndEvent();
    var radio1 = document.getElementById('allHalls');
    var radio2 = document.getElementById('specificHalls');
    var radio3 = document.getElementById('specificCounters');
    if(radio1.checked==true){
        document.getElementById('counterBox').style.display ='none';
        document.getElementById('hallBox').style.display ='none';
        counters=counters.concat(addedCounters);
        halls=halls.concat(addedHalls);
        level=cBRANCH_LEVEL;
    }else if(radio2.checked==true){
        document.getElementById('hallBox').style.display ='block';
        document.getElementById('counterBox').style.display ='none';
        level=cHALLS_LEVEL;
    }else if(radio3.checked==true){
        document.getElementById('counterBox').style.display ='block';
        document.getElementById('hallBox').style.display ='none';
        level=cCOUNTER_LEVEL;
    }
}

function connect(){
    isConnect=false;
    document.getElementById('connectionState').innerHTML=connectionCheck7;
    document.getElementById('loadingImage').style.display="inline";
    var serverAddress =document.getElementById('serverAddress').value;
    if(serverAddress.length>0){
        if(isVaildHostName(serverAddress) || serverAddress=="http://localhost"){
            httpConnect((result)=>{
                if(result==cSUCCESS){
                    document.getElementById('connectionState').innerHTML=connectionCheck1;
                    isConnect=true;
                    checkIdentity();
                }else if(result==cFAIL){
                    document.getElementById('connectionState').innerHTML=connectionCheck3;
                    isConnect=false;
                }else if(result==cTIMEOUT){
                    document.getElementById('connectionState').innerHTML=connectionCheck4;
                    isConnect=false;
                }
                document.getElementById('loadingImage').style.display="none";
            },serverAddress);
        }else{
            document.getElementById('connectionState').innerHTML=connectionCheck5;
            document.getElementById('loadingImage').style.display="none";
        }
    }else{
        document.getElementById('connectionState').innerHTML=connectionCheck6;
        document.getElementById('loadingImage').style.display="none";
    }
}

function checkIdentity(){
    var branchIdentity =document.getElementById('branchIdentity').value;
    var identityValidation=document.getElementById('identityValidation');
    document.getElementById('loadingImage2').style.display="inline";
    identityValidation.innerHTML="";
    if(branchIdentity.length>0){
        document.getElementById('allHalls').checked=true;
        start();
        addedCounters=[];
        addedHalls=[];
        httpCheckIdentity((fetchingResult,data)=>{
            if(fetchingResult==cSUCCESS){
                branch=data.branch;
                counters=data.counters;
                halls=data.halls;
                fillCounters();
                fillHalls();
                vaildBranchIdentity=true;
                document.getElementById('specificHalls').disabled=false;
                document.getElementById('specificCounters').disabled=false;
            }else{
                counters=[];
                halls=[];
                branch=null;
                fillCounters();
                fillHalls();
                vaildBranchIdentity=false;
                document.getElementById('specificHalls').disabled=true;
                document.getElementById('specificCounters').disabled=true;
                if(fetchingResult==cFAIL){
                    identityValidation.innerHTML=IdentityCheck1;
                }else if(fetchingResult==cREFUSECONNECTION){
                    identityValidation.innerHTML=IdentityCheck3;
                }
            }
            document.getElementById('loadingImage2').style.display="none";
        },language,branchIdentity)
    }else{
        identityValidation.innerHTML=IdentityCheck2;
        document.getElementById('loadingImage2').style.display="none";
    }
}

function isVaildHostName(Hostname){
    var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    return regex.test(Hostname);
}

function fillCounters(){
    var Result="";
    var name="";
    var addButton = document.getElementById('addButton').innerHTML;
    var removeButton = document.getElementById('removeButton').innerHTML;
    for(let i =0 ; i<counters.length;i++){
        if(language=="ar"){
            name=counters[i].Name_L2;
        }else{
            name=counters[i].Name_L1;
        }
        Result+=`
        <li class="list-group-item">
                <div class="col-md-4 col-sm-4" style="margin-top: 12px">`+name+`</div>
                <div class="col-md-5 col-sm-4"></div>
                <div class="col-md-3 col-sm-4"><button onClick='addCounter(`+i+`)' type="button" class="btn btn-success btn-rounded">`+addButton+`</button></div>
        </li>`;
    }
    document.getElementById('counters').innerHTML=Result;
    var Result="";
    for(let i =0 ; i<addedCounters.length;i++){
        if(language=="ar"){
            name=addedCounters[i].Name_L2;
        }else{
            name=addedCounters[i].Name_L1;
        }
        Result+=`
        <li class="list-group-item">
             <div class="col-md-4 col-sm-3" style="margin-top: 12px">`+name+`</div>
            <div class="col-md-5 col-sm-4"></div>
            <div class="col-md-3 col-sm-3"><button onClick='removeCounter(`+i+`)' type="button" class="btn btn-danger btn-rounded">`+removeButton+`</button></div>
        </li>`;
    }
    document.getElementById('addedCounters').innerHTML=Result;
}

function addCounter(index){
    addedCounters.push(counters[index]);
    counters.splice(index,1);
    fillCounters();
}

function removeCounter(index){
    counters.push(addedCounters[index]);
    addedCounters.splice(index,1);
    fillCounters();
}

function fillHalls(){
    var Result="";
    var addButton = document.getElementById('addButton').innerHTML;
    var removeButton = document.getElementById('removeButton').innerHTML;
    for(let i =0 ; i<halls.length;i++){
        if(language=="ar"){
            name=halls[i].Name_L2;
        }else{
            name=halls[i].Name_L1;
        }
        Result+=`
        <li class="list-group-item">
            <div class="col-md-4 col-sm-4" style="margin-top: 12px">`+name+`</div>
            <div class="col-md-5 col-sm-4"></div>
            <div class="col-md-3 col-sm-4"><button onClick='addHall(`+i+`)' type="button" class="btn btn-success btn-rounded">`+addButton+`</button></div>
        </li>`;
    }
    document.getElementById('halls').innerHTML=Result;
    var Result="";
    for(let i =0 ; i<addedHalls.length;i++){
        if(language=="ar"){
            name=addedHalls[i].Name_L2;
        }else{
            name=addedHalls[i].Name_L1;
        }
        Result+=`<li class="list-group-item">
            <div class="col-md-4 col-sm-3" style="margin-top: 12px">`+name+`</div>
            <div class="col-md-5 col-sm-4"></div>
            <div class="col-md-3 col-sm-3"><button onClick='removeHall(`+i+`)' type="button" class="btn btn-danger btn-rounded">`+removeButton+`</button></div>
        </li>`;
    }
    document.getElementById('addedHalls').innerHTML=Result;
}

function addHall(index){
    addedHalls.push(halls[index]);
    halls.splice(index,1);
    fillHalls();
}

function removeHall(index){
    halls.push(addedHalls[index]);
    addedHalls.splice(index,1);
    fillHalls();
}

function changeLanguage(){
    var selected = document.getElementById("language").value;
    if(selected=="ar"){
        language="ar";
    }else {
        language="en";
    }
    httpChangeLanguage((result)=>{
        if(result==cSUCCESS){
            location.reload(true);
        }else{
            alert("Can't Find the language");
        }
    },language)
    fillCounters();
    fillHalls();
    fillBranchDetails();
}

function saveSettings(){
    var serverAddress=document.getElementById('serverAddress').value;
    var branchIdentity=document.getElementById('branchIdentity').value;
    var Halls=[];
    var Counters=[];

    if(level==cBRANCH_LEVEL){
        Halls=halls.concat(addedHalls);
        Counters=counters.concat(addedCounters);
    }else if(level==cHALLS_LEVEL){
        Halls=addedHalls;
        Counters=counters.concat(addedCounters);
    }else if(level==cCOUNTER_LEVEL){
        Counters=addedCounters;
        Halls=halls.concat(addedHalls);
    }

    var settings={
        'serverAddress':serverAddress,
        'branchIdentity':branchIdentity,
        'halls':Halls,
        'counters':Counters,
        'level':level
    };

    if(serverAddress!=EMPTY ){
        if(isConnect){
            if(branchIdentity!=EMPTY){
                if(vaildBranchIdentity){
                    httpSaveSettings((result)=>{
                            if(result==cSUCCESS)
                            Finish();
                        else
                            alert("The Configuration Dose not save")
                        },settings)
                }else{
                    document.getElementById('identityValidation').innerHTML=IdentityCheck1;
                }
            }else{
                document.getElementById('identityValidation').innerHTML=IdentityCheck2;
            }
        }
    }else{
        document.getElementById('connectionState').innerHTML=connectionCheck6;
    }
}

function Finish(){
    document.getElementById('mainView').style.display="none";
    document.getElementById('endPage').style.display="block";
}

function Back(){
    document.getElementById('mainView').style.display="block";
    document.getElementById('endPage').style.display="none";
}
window.addEventListener('load',start,false);