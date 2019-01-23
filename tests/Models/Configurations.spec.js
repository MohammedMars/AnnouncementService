const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();
const cSUCCESS=1;
const cFAIL=-1;
const service = require('../../src/Services/Service.js');
var rewire = require('rewire');
var fs = require('fs');
var fsReadDir;
var captions=
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
const Announcement_NotExported = rewire('../../src/Models/Configuration.js');
describe('Configurations Test Cases',function(){
    after(()=>{
        sinon.restore();
    })
    describe('read And Cache All Captions ',function(){
        before(()=>{
            fsReadDir= sinon.stub(fs,"readdir");
        });
        it('Test Case 1 : When The Captions File Is Not Exist',function(){
            fsReadDir.yields(new Error("Can't find the path"),{});
            var SetCaptions = Announcement_NotExported.__get__("SetCaptions");
            SetCaptions((result)=>{
                result.should.equal(cFAIL);
            })
        });
        it('Test Case 2 : When The Captions File Is Exist',function(){
            fsReadDir.yields(null,captions);
            var SetCaptions = Announcement_NotExported.__get__("SetCaptions");
            SetCaptions((result)=>{
                result.should.equal(cSUCCESS);
            })
        });
        it('Test Case 2 : When The Captions File Is Exist but empty',function(){
            fsReadDir.yields(null,{});
            var SetCaptions = Announcement_NotExported.__get__("SetCaptions");
            SetCaptions((result)=>{
                result.should.equal(cSUCCESS);
            })
        });
    });
    
    describe('Check The Connection on The End Point',function(){
        var stubPing,ping;
        before(()=>{
            stubPing=sinon.stub(service,"ping");
            ping= Announcement_NotExported.ping;
        })
        it('Test Case 1 : When The Connection Success',function(){
            stubPing.yields(cSUCCESS);
            ping((result)=>{
                result.should.equal(cSUCCESS);
            })
        });
        it('Test Case 2 : When The Connection Fail',function(){
            stubPing.yields(cFAIL);
            ping((result)=>{
                result.should.equal(cFAIL);
            })
        });
    });
    
    describe('Save The Setting in The Current Directory',function(){
        var fsWrite,saveSettings;
        before(()=>{
            fsWrite = sinon.stub(fs,"writeFile");
            saveSettings = Announcement_NotExported.saveSettings;
        })
        it('Test Case 1 : When The Saving Complete Successfully',function(){
            fsWrite.yields(null);
            saveSettings((result)=>{
                result.should.equal(cSUCCESS);
            })
        });
        it('Test Case 2 : When The Saving Does Not Complete Successfully',function(){
            fsWrite.yields(new Error("Can't find the path"));
            saveSettings((result)=>{
                result.should.equal(cFAIL);
            })
        });
    });
    
    describe('Fetch And Cache  All The Branches',function(){
        it('Test Case 1 : Fetch And Cache  All The Branches',function(done){
            sinon.stub(service,"fetchBranches").yields(cSUCCESS,{branches : []});
            var fetchBranches = Announcement_NotExported.__get__("fetchBranches");
            fetchBranches((result,branches)=>{
                result.should.equal(cSUCCESS);
                should.exist(branches);
                done();
            })
        });
    });
    
    describe('Fetch And Cache  All The Halls',function(){
        it('Test Case 1 : Fetch And Cache  All The Halls',function(done){
            sinon.stub(service,"fetchHalls").yields(cSUCCESS,{halls : []});
            var fetchHalls = Announcement_NotExported.__get__("fetchHalls");
            fetchHalls((result)=>{
                result.should.equal(cSUCCESS);
                done();
            })
        })
    });
    
    describe('Fetch And Cache  All The Counters',function(){
        it('Test Case 1 : Fetch And Cache  All The Counters',function(done){
            sinon.stub(service,"fetchCounters").yields(cSUCCESS,{counters : []});
            var fetchCounters = Announcement_NotExported.__get__("fetchCounters");
            fetchCounters((result)=>{
                result.should.equal(cSUCCESS);
                done();
            })
        });
    });
    
    describe('Fetch And Cache  All The Configurations',function(){
        var tempFetchBranches , tempFetchHalls , tempFetchCounters , tempGetBranch ;
        var stubFetchBeanches , stubFetchHalls , stubFetchCounters , stubGetBranch;
        before(()=>{
            tempFetchBranches = Announcement_NotExported.__get__("fetchBranches");
            tempFetchHalls = Announcement_NotExported.__get__("fetchHalls");
            tempFetchCounters = Announcement_NotExported.__get__("fetchCounters");
            tempGetBranch = Announcement_NotExported.__get__("getBranch");
    
            stubFetchBeanches = sinon.stub().yields({});
            Announcement_NotExported.__set__("fetchBranches",stubFetchBeanches);
    
            stubFetchHalls = sinon.stub().yields({});
            Announcement_NotExported.__set__("fetchHalls",stubFetchHalls);
    
            stubFetchCounters = sinon.stub().yields({});
            Announcement_NotExported.__set__("fetchCounters",stubFetchCounters);
    
        });
    
        after(()=>{
            Announcement_NotExported.__set__("fetchBranches",tempFetchBranches);
            Announcement_NotExported.__set__("fetchHalls",tempFetchHalls);
            Announcement_NotExported.__set__("fetchCounters",tempFetchCounters);
            Announcement_NotExported.__set__("getBranch",tempGetBranch);
        })
        it('Test Case 1 : Fetch And Cache  All The Configurations For Existing Branch',function(){
            stubGetBranch = sinon.stub().yields(cSUCCESS,{ID:106});
            Announcement_NotExported.__set__("getBranch",stubGetBranch);
            var fetchData = Announcement_NotExported.fetchData;
            fetchData((result,data)=>{
                result.should.equal(cSUCCESS);
                data.should.include.keys('branch','halls','counters');
            })
        });
    
        it('Test Case 2 : Fetch And Cache  All The Configurations For Non Existing Branch',function(){
            stubGetBranch = sinon.stub().yields(cFAIL,null);
            Announcement_NotExported.__set__("getBranch",stubGetBranch);
            var fetchData = Announcement_NotExported.fetchData;
            fetchData((result,data)=>{
                result.should.equal(cFAIL);
            })
        });
    });
    
    describe('Get Branch From Specific Identity',function(){
        it('Test Case 1 : When Valid Branch Identity',function(){
            var getBranch =Announcement_NotExported.__get__("getBranch");
            getBranch(function(result,branch){
                result.should.equal(cSUCCESS);
                should.exist(branch);
                branch.should.include.keys('ID');
                branch.ID.should.equal(106);
            },"MAJD")
        });
        it('Test Case 2 : When Invalid Branch Identity',function(){
            var getBranch =Announcement_NotExported.__get__("getBranch");
            getBranch(function(result,branch){
                result.should.equal(cFAIL);
                should.not.exist(branch);
            },"Invalid Branch Identity")
        })
    });
    
    describe('Get Page Captions For Specific Language',function(){
        it('Test Case 1 : Whith Valid Language',function(){
            var getPage =Announcement_NotExported.getPage;
            getPage(function(result){
                result.should.equal(cSUCCESS);
            },"en")
        })
    
        it('Test Case 2 : Whith Invalid Language',function(){
            var getPage =Announcement_NotExported.getPage;
            getPage(function(result){
                result.should.equal(cFAIL);
            },"Invalid Language")
        })
    })
})
