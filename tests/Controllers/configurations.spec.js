const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();
var rewire = require('rewire');
var ConfigController = rewire('../../src/Controllers/configurations.js');
const cSUCCESS=1;
const cFAIL=-1;
var Settings = require('../../src/Models/Settings.js');
const Config = require('../../src/Models/Configuration.js');
const announcement = require('../../src/Models/Announcement');
var page=
{
    "language":"en",
    "style":"ltr",
    "pageTitle":"Configurations",
    "title":"Automatic Announcement Settings",
    "subTitle":"Service Settings",
    "firstInput":"Server Address",
    "secondInput":"Branch Identity",
    "firstButton":"Connect",
    "firstRadio":"Branch Entire",
    "secondRadio":"Specific Halls",
    "thirdRadio":"Specific Counters",
    "firstHallBlockTitle":"Avaliable Halls",
    "secondHallBlockTitle":"Added Halls",
    "firstHallBlockSubTitle":"Add",
    "secondHallBlockSubTitle":"Remove",
    "firstCounterBlockTitle":"Avaliable Counters",
    "secondCounterBlockTitle":"Added Counters",
    "firstCounterBlockSubTitle":"Add",
    "secondCounterBlockSubTitle":"Remove",
    "secondButton":"Save",
    "thirdButton":"Close",
    "connectionCheck1":"Connected",
    "connectionCheck2":"No Connection",
    "connectionCheck3":"Check The End Point Connection",
    "connectionCheck4":"Request Timeout",
    "connectionCheck5":"Invaild Server Address !",
    "connectionCheck6":"Please fill the Server Address",
    "IdentityCheck1":"Invalid Branch Identity",
    "IdentityCheck2":"Please fill the Branch Identity",
    "endPageSubTitle":"Well Done !",
    "endPageMessage":"You successfully save the announcement settings",
    "endPageButton1":"BACK",
    "endPageButton2":"CLOSE"
}
describe('Configurations Controller Test Cases',function(){
    var getPage;
    before((done)=>{
        getPage =sinon.stub(Config,"getPage");
        done();
    });

    describe('Get Page View',function(){
        it('Test Case 1 : With Valid Captions',function(){
            getPage.yields(cSUCCESS,page);
            var getPageView = ConfigController.__get__("getPageview");
            req={};
            res={
                render:sinon.spy(),
                end:sinon.spy()
            }
            getPageView(req,res);
            res.render.calledOnce.should.be.true;
            res.render.firstCall.args[0].should.equal('index');
        });
        it('Test Case 2 : With Invalid Captions',function(){
            getPage.yields(cFAIL,page);
            var getPageView = ConfigController.__get__("getPageview");
            req={};
            res={
                render:sinon.spy(),
                end:sinon.spy()
            }
            getPageView(req,res);
            res.render.callCount.should.equal(0);
        });
    });

    describe('Change Page Language ',function(){
        it('Test Case 1 : With Valid Language',function(){
            getPage.yields(cSUCCESS,page);
            var ChangePageLanguage = ConfigController.__get__("ChangePageLanguage");
            req={
                params:{
                    language:"en"
                }
            };
            res={
                send:sinon.spy(),
            }
            ChangePageLanguage(req,res);
            res.send.firstCall.args[0].result.should.equal(cSUCCESS);
        });
        it('Test Case 2 : With Invalid Language',function(){
            getPage.yields(cFAIL);
            var ChangePageLanguage = ConfigController.__get__("ChangePageLanguage");
            req={
                params:{
                    language:"ex"
                }
            };
            res={
                send:sinon.spy(),
            }
            ChangePageLanguage(req,res);
            res.send.firstCall.args[0].result.should.equal(cFAIL);
        });
    });

    describe('Save Configurations',function(){
        var saveConfig;
        var start;
        before((done)=>{
            start=sinon.stub(announcement,"Start");
            saveConfig=sinon.stub(Config,"saveSettings");
            done();
        })
        it('When Success Saving',function(){
            saveConfig.yields(cSUCCESS);
            var saveConfigurations = ConfigController.__get__("saveConfigurations");
            req={
                body:{
                    
                }
            };
            res={
                send:sinon.spy(),
            }
            saveConfigurations(req,res);
            res.send.firstCall.args[0].result.should.equal(cSUCCESS);
        });
        it('When Failure Saving',function(){
            saveConfig.yields(cFAIL);
            var saveConfigurations = ConfigController.__get__("saveConfigurations");
            req={
                body:{
                    
                }
            };
            res={
                send:sinon.spy(),
            }
            saveConfigurations(req,res);
            res.send.firstCall.args[0].result.should.equal(cFAIL);
        })
    });

    describe('Chack Connection',function(){
        var ping;
        before((done)=>{
            ping=sinon.stub(Config,"ping");
            done();
        })
        it('When Successfully Connection',function(){
            ping.yields(cSUCCESS);
            var checkConnections = ConfigController.__get__("checkConnections");
            req={
                body:{
                    serverAddress:"http://localhost:3000"
                }
            };
            res={
                send:sinon.spy(),
            }
            checkConnections(req,res);
            res.send.firstCall.args[0].result.should.equal(cSUCCESS);
        });
        it('When Unsuccessfully Connections',function(){
            ping.yields(cFAIL);
            var checkConnections = ConfigController.__get__("checkConnections");
            req={
                body:{
                    serverAddress:"http://localhost:3000"
                }
            };
            res={
                send:sinon.spy(),
            }
            checkConnections(req,res);
            res.send.firstCall.args[0].result.should.equal(cFAIL);
        });
    });

    describe('Chack Branch Identity',function(){
        var fetchSettings;
        before((done)=>{
            fetchSettings=sinon.stub(Settings.prototype,"fetchSettings");
            done();
        });
        
        it('When Valid Branch Identity',function(){
            fetchSettings.yields(cSUCCESS);
            var checkBranchIdentity = ConfigController.__get__("checkBranchIdentity");
            req={
                params:{
                    branchIdentity:"MAJD"
                }
            };
            res={
                send:sinon.spy(),
            }
            checkBranchIdentity(req,res);
            res.send.firstCall.args[0].fetchingResult.should.equal(cSUCCESS);
            should.exist(res.send.firstCall.args[0].result);
        });

        it('When Invalid Branch Identity',function(){
            fetchSettings.yields(cFAIL);
            var checkBranchIdentity = ConfigController.__get__("checkBranchIdentity");
            req={
                params:{
                    branchIdentity:"Invalid Branch Identity"
                }
            };
            res={
                send:sinon.spy(),
            }
            checkBranchIdentity(req,res);
            res.send.firstCall.args[0].fetchingResult.should.equal(cFAIL);
            should.not.exist(res.send.firstCall.args[0].result);
        });
    });

});
