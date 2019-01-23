var service=require('../Services/Service.js');
const cSUCCESS =1;
const cFAIL =-1;
const cREFUSECONNECTION=-4;
module.exports = class Settings{

    constructor(){
        this.branch=null;
        this.halls=[];
        this.counters=[];
    }

    setBranch(branch){
        this.branch=branch;
    }

    setHalls(halls){
        this.halls=halls;
    }

    setCounters(counters){
        this.counters=counters;
    }

    getBranch(){
        return this.branch;
    }

    getHalls(){
        return this.halls;
    }

    getCounters(){
        return this.counters;
    }

    fetchSettings(callBack,branchIdentity){
        service.getBranch((result,branch)=>{
            if(result==cSUCCESS){
                this.branch=branch;
                service.fetchHalls((result,halls)=>{
                    if(result==cSUCCESS){
                        this.halls=halls;
                        service.fetchCounters((result,counters)=>{
                            if(result==cSUCCESS){
                                this.counters=counters
                                callBack(cSUCCESS)
                            }else{
                                callBack(cFAIL)
                            }
                        },branch.ID)
                    }else{
                        callBack(cFAIL)
                    }
                },branch.ID)
            }else if(result==cFAIL){
                callBack(cFAIL)
            }else{
                callBack(cREFUSECONNECTION);
            }
        },branchIdentity)
    }
}