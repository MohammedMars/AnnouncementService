const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();
var request = require('request');
const cSUCCESS=1;
const cFAIL=-1;
const cTIMEOUT=-3;
const cREFUSECONNECTION=-4;
const Service = require('../../src/Services/Service');
describe('Service Test Cases',function(){
    var postRequest;
    before((done)=>{
        postRequest = sinon.stub(request,"post");
        done();
    });

    describe('Start Up',function(){
        var settings ;
        before((done)=>{
            settings ={"serverAddress":"http://localhost","branchIdentity":"MAJD","halls":[{"ID":838,"Name_L1":"Hall 1","Name_L2":"Hall 1","Name_L3":"Hall 1","Name_L4":"Hall 1","Color":"#000000","GuidingText_L1":null,"GuidingText_L2":null,"GuidingText_L3":null,"GuidingText_L4":null},{"ID":842,"Name_L1":"Hall 3","Name_L2":"قاعة 3","Name_L3":"Hall 3","Name_L4":"","Color":"#000000","GuidingText_L1":null,"GuidingText_L2":null,"GuidingText_L3":null,"GuidingText_L4":null},{"ID":878,"Name_L1":"hall2","Name_L2":"hall2","Name_L3":"hall2","Name_L4":"","Color":"#000000","GuidingText_L1":null,"GuidingText_L2":null,"GuidingText_L3":null,"GuidingText_L4":null}],"counters":[{"ID":122,"Name_L1":"Counter 3 No call","Name_L2":"Counter 3 No call","Name_L3":"Counter 3 No call","Name_L4":"","Number":3},{"ID":605,"Name_L1":"Counter 5","Name_L2":"Counter 5","Name_L3":"Counter 5","Name_L4":"","Number":5},{"ID":606,"Name_L1":"Counter 6","Name_L2":"Counter 6","Name_L3":"Counter 6","Name_L4":"","Number":6},{"ID":607,"Name_L1":"Counter 7","Name_L2":"Counter 7","Name_L3":"Counter 7","Name_L4":"","Number":7},{"ID":608,"Name_L1":"Counter 8","Name_L2":"Counter 8","Name_L3":"Counter 8","Name_L4":"","Number":8},{"ID":609,"Name_L1":"Counter 9","Name_L2":"Counter 9","Name_L3":"Counter 9","Name_L4":"","Number":9},{"ID":610,"Name_L1":"Counter 10","Name_L2":"Counter 10","Name_L3":"Counter 10","Name_L4":"","Number":10},{"ID":611,"Name_L1":"Counter 11","Name_L2":"Counter 11","Name_L3":"Counter 11","Name_L4":"","Number":11},{"ID":120,"Name_L1":"Counter 1","Name_L2":"النافذة 1","Name_L3":"Counter 1","Name_L4":"","Number":1},{"ID":121,"Name_L1":"Counter 2","Name_L2":"النافذة 2","Name_L3":"Counter 2","Name_L4":"","Number":2},{"ID":120,"Name_L1":"Counter 1","Name_L2":"النافذة 1","Name_L3":"Counter 1","Name_L4":"","Number":1},{"ID":121,"Name_L1":"Counter 2","Name_L2":"النافذة 2","Name_L3":"Counter 2","Name_L4":"","Number":2}],"level":1}
            done();
        });

        it('Test Case 1 : With Settings',function(done){
            Service.startUp((result)=>{
                result.should.equal(cSUCCESS);
            },settings);
            done();
        });
        it('Test Case 2 : With Settings',function(done){
            Service.startUp((result)=>{
                result.should.equal(cFAIL);
            },null);
            done();
        })
    })

    describe('Check Connection API',function(){
        it('Test Case 1 : When Successfull Connection',function(done){
            var response={
                statusCode:200
            }
            var body={

            }
            postRequest.yields(null,response,body);
            Service.ping(function(result){
                result.should.equal(cSUCCESS);
                done();
            },"Url")
        });
        it('Test Case 2 : When Request is Timeout',function(done){
            var response={
                statusCode:408
            }
            var body={

            }
            postRequest.yields(null,response,body);
            Service.ping(function(result){
                result.should.equal(cTIMEOUT);
                done();
            },"Url")
        });
        it('Test Case 3 : When Unsuccessfull Connection',function(done){
            var response={
                statusCode:408
            }
            var body={

            }
            postRequest.yields(new Error("Invalid Url"),response,body);
            Service.ping(function(result){
                result.should.equal(cFAIL);
                done();
            },"Invalid Url")
        });

    })

    describe('Fetch Branches API',function(){
        var branches = [
            {
                "ID": 106,
                "Identity": "MAJD",
                "Name_L1": "Amman",
                "Name_L2": "عمان",
                "Name_L3": "amman",
                "Name_L4": ""
            },
            {
                "ID": 133,
                "Identity": "MMJ",
                "Name_L1": "Gardenz",
                "Name_L2": "جاردنز",
                "Name_L3": "",
                "Name_L4": ""
            },
            {
                "ID": 347,
                "Identity": "BR101",
                "Name_L1": "Cardiff",
                "Name_L2": "كارديف",
                "Name_L3": "",
                "Name_L4": "Cardiff"
            },
            {
                "ID": 348,
                "Identity": "BR01",
                "Name_L1": "Main Branch",
                "Name_L2": "الفرع الرئيسي",
                "Name_L3": "",
                "Name_L4": "Main Branch"
            },
            {
                "ID": 349,
                "Identity": "BR02",
                "Name_L1": "Grangetown",
                "Name_L2": "غرينجتاون",
                "Name_L3": "",
                "Name_L4": "Grangetown"
            },
            {
                "ID": 350,
                "Identity": "BR03",
                "Name_L1": "City Centre",
                "Name_L2": "وسط المدينة",
                "Name_L3": "",
                "Name_L4": "City Centre"
            },
            {
                "ID": 351,
                "Identity": "BR04",
                "Name_L1": "Maiden",
                "Name_L2": "ميدن",
                "Name_L3": "",
                "Name_L4": "Maiden"
            },
            {
                "ID": 352,
                "Identity": "BR05",
                "Name_L1": "Fratton",
                "Name_L2": "فراتون",
                "Name_L3": "",
                "Name_L4": "Fratton"
            },
            {
                "ID": 353,
                "Identity": "BR34",
                "Name_L1": "Leeds",
                "Name_L2": "ليدز",
                "Name_L3": "",
                "Name_L4": "Leeds"
            },
            {
                "ID": 354,
                "Identity": "BrJA",
                "Name_L1": "Jebel Ali",
                "Name_L2": "جبل علي",
                "Name_L3": "",
                "Name_L4": "Jebel Ali"
            },
            {
                "ID": 355,
                "Identity": "HWTeam",
                "Name_L1": "HWTeam",
                "Name_L2": "HWTeam",
                "Name_L3": "",
                "Name_L4": "HWTeam"
            },
            {
                "ID": 356,
                "Identity": "Amman",
                "Name_L1": "Amman Branch",
                "Name_L2": "فرع عمان",
                "Name_L3": "",
                "Name_L4": "Amman Branch"
            },
            {
                "ID": 358,
                "Identity": "Zain_Airport",
                "Name_L1": "Zain_Airport",
                "Name_L2": "Zain_Airport",
                "Name_L3": "",
                "Name_L4": "Zain_Airport"
            },
            {
                "ID": 569,
                "Identity": "win7",
                "Name_L1": "win7",
                "Name_L2": "win7",
                "Name_L3": "",
                "Name_L4": ""
            },
            {
                "ID": 571,
                "Identity": "xp",
                "Name_L1": "xp",
                "Name_L2": "xp",
                "Name_L3": "",
                "Name_L4": ""
            }
        ]        
        it('Test Case 1 : When Successfull Fetching',function(){
            var response={}
            var body={payload:{branches:branches}}
            postRequest.yields(null,response,body);
            Service.fetchBranches(function(result,branches){
                result.should.equal(cSUCCESS);
                should.exist(branches);
            })
        });
        it('Test Case 2 : When Unuccessfull Fetching',function(){
            var response={}
            var body={payload:{branches:null}}
            postRequest.yields(new Error("Can't Fetching The Branches"),response,body);
            Service.fetchBranches(function(result,branches){
                result.should.equal(cFAIL);
                should.not.exist(branches);
            })
        });

        it('Test Case 3 : When No Branches',function(){
            var response={}
            var body={payload:{branches:[]}}
            postRequest.yields(null,response,body);
            Service.fetchBranches(function(result,branches){
                result.should.equal(cSUCCESS);
                branches.length.should.equal(0);
            })
        });
    });

    describe('Fetch Counters API',function(){
        var counters = [
            {
                "ID": 120,
                "Name_L1": "Counter 1",
                "Name_L2": "النافذة 1",
                "Name_L3": "Counter 1",
                "Name_L4": "",
                "Number": 1
            },
            {
                "ID": 121,
                "Name_L1": "Counter 2",
                "Name_L2": "النافذة 2",
                "Name_L3": "Counter 2",
                "Name_L4": "",
                "Number": 2
            },
            {
                "ID": 122,
                "Name_L1": "Counter 3 No call",
                "Name_L2": "Counter 3 No call",
                "Name_L3": "Counter 3 No call",
                "Name_L4": "",
                "Number": 3
            },
            {
                "ID": 123,
                "Name_L1": "Counter 4 ticketing",
                "Name_L2": "Counter 4 ticketing",
                "Name_L3": "Counter 4 ticketing",
                "Name_L4": "",
                "Number": 4
            },
            {
                "ID": 605,
                "Name_L1": "Counter 5",
                "Name_L2": "Counter 5",
                "Name_L3": "Counter 5",
                "Name_L4": "",
                "Number": 5
            },
            {
                "ID": 606,
                "Name_L1": "Counter 6",
                "Name_L2": "Counter 6",
                "Name_L3": "Counter 6",
                "Name_L4": "",
                "Number": 6
            },
            {
                "ID": 607,
                "Name_L1": "Counter 7",
                "Name_L2": "Counter 7",
                "Name_L3": "Counter 7",
                "Name_L4": "",
                "Number": 7
            },
            {
                "ID": 608,
                "Name_L1": "Counter 8",
                "Name_L2": "Counter 8",
                "Name_L3": "Counter 8",
                "Name_L4": "",
                "Number": 8
            },
            {
                "ID": 609,
                "Name_L1": "Counter 9",
                "Name_L2": "Counter 9",
                "Name_L3": "Counter 9",
                "Name_L4": "",
                "Number": 9
            },
            {
                "ID": 610,
                "Name_L1": "Counter 10",
                "Name_L2": "Counter 10",
                "Name_L3": "Counter 10",
                "Name_L4": "",
                "Number": 10
            },
            {
                "ID": 611,
                "Name_L1": "Counter 11",
                "Name_L2": "Counter 11",
                "Name_L3": "Counter 11",
                "Name_L4": "",
                "Number": 11
            },
            {
                "ID": 612,
                "Name_L1": "Ticketing wITH uSER",
                "Name_L2": "Ticketing wITH uSER",
                "Name_L3": "Ticketing wITH uSER",
                "Name_L4": "",
                "Number": 12
            },
            {
                "ID": 721,
                "Name_L1": "ticketing",
                "Name_L2": "ticketing",
                "Name_L3": "ticketing",
                "Name_L4": "",
                "Number": 199
            },
            {
                "ID": 724,
                "Name_L1": "Ticketing2",
                "Name_L2": "Ticketing2",
                "Name_L3": "Ticketing2",
                "Name_L4": "",
                "Number": 200
            },
            {
                "ID": 725,
                "Name_L1": "Ticketing3",
                "Name_L2": "Ticketing3",
                "Name_L3": "Ticketing3",
                "Name_L4": "",
                "Number": 201
            }
        ]
        it('Test Case 1 : When Successfull Fetching',function(){
            var response={}
            var body={payload:{counters:counters}}
            postRequest.yields(null,response,body);
            Service.fetchCounters(function(result,counters){
                result.should.equal(cSUCCESS);
                should.exist(counters);
            })
        });
        it('Test Case 2 : When Unuccessfull Fetching',function(){
            var response={}
            var body={payload:{counters:null}}
            postRequest.yields(new Error("Can't Fetching The Counters"),response,body);
            Service.fetchCounters(function(result,counters){
                result.should.equal(cFAIL);
                should.not.exist(counters);
            })
        });

        it('Test Case 3 : When No Counters',function(){
            var response={}
            var body={payload:{counters:[]}}
            postRequest.yields(null,response,body);
            Service.fetchCounters(function(result,counters){
                result.should.equal(cSUCCESS);
                counters.length.should.equal(0);
            })
        });
    });

    describe('Fetch Halls API',function(){
        var halls = [
            {
                "ID": 838,
                "Name_L1": "Hall 1",
                "Name_L2": "Hall 1",
                "Name_L3": "Hall 1",
                "Name_L4": "Hall 1",
                "Color": "#000000",
                "GuidingText_L1": null,
                "GuidingText_L2": null,
                "GuidingText_L3": null,
                "GuidingText_L4": null
            },
            {
                "ID": 842,
                "Name_L1": "Hall 3",
                "Name_L2": "قاعة 3",
                "Name_L3": "Hall 3",
                "Name_L4": "",
                "Color": "#000000",
                "GuidingText_L1": null,
                "GuidingText_L2": null,
                "GuidingText_L3": null,
                "GuidingText_L4": null
            },
            {
                "ID": 878,
                "Name_L1": "hall2",
                "Name_L2": "hall2",
                "Name_L3": "hall2",
                "Name_L4": "",
                "Color": "#000000",
                "GuidingText_L1": null,
                "GuidingText_L2": null,
                "GuidingText_L3": null,
                "GuidingText_L4": null
            }
        ]
        it('Test Case 1 : When Successfull Fetching',function(){
            var response={}
            var body={payload:{halls:halls}}
            postRequest.yields(null,response,body);
            Service.fetchHalls(function(result,halls){
                result.should.equal(cSUCCESS);
                should.exist(halls);
            })
        });
        it('Test Case 2 : When Unuccessfull Fetching',function(){
            var response={}
            var body={payload:{halls:null}}
            postRequest.yields(new Error("Can't Fetching The Halls"),response,body);
            Service.fetchHalls(function(result,halls){
                result.should.equal(cFAIL);
                should.not.exist(halls);
            })
        });

        it('Test Case 3 : When No Halls',function(){
            var response={}
            var body={payload:{halls:[]}}
            postRequest.yields(null,response,body);
            Service.fetchHalls(function(result,halls){
                result.should.equal(cSUCCESS);
                halls.length.should.equal(0);
            })
        });
    });

    describe('Get Branch API',function(){
        var fetchBranches;
        var branches;
        before((done)=>{
            branches = [
                {
                    "ID": 106,
                    "Identity": "MAJD",
                    "Name_L1": "Amman",
                    "Name_L2": "عمان",
                    "Name_L3": "amman",
                    "Name_L4": ""
                },
                {
                    "ID": 133,
                    "Identity": "MMJ",
                    "Name_L1": "Gardenz",
                    "Name_L2": "جاردنز",
                    "Name_L3": "",
                    "Name_L4": ""
                },
                {
                    "ID": 347,
                    "Identity": "BR101",
                    "Name_L1": "Cardiff",
                    "Name_L2": "كارديف",
                    "Name_L3": "",
                    "Name_L4": "Cardiff"
                },
                {
                    "ID": 348,
                    "Identity": "BR01",
                    "Name_L1": "Main Branch",
                    "Name_L2": "الفرع الرئيسي",
                    "Name_L3": "",
                    "Name_L4": "Main Branch"
                },
                {
                    "ID": 349,
                    "Identity": "BR02",
                    "Name_L1": "Grangetown",
                    "Name_L2": "غرينجتاون",
                    "Name_L3": "",
                    "Name_L4": "Grangetown"
                },
                {
                    "ID": 350,
                    "Identity": "BR03",
                    "Name_L1": "City Centre",
                    "Name_L2": "وسط المدينة",
                    "Name_L3": "",
                    "Name_L4": "City Centre"
                },
                {
                    "ID": 351,
                    "Identity": "BR04",
                    "Name_L1": "Maiden",
                    "Name_L2": "ميدن",
                    "Name_L3": "",
                    "Name_L4": "Maiden"
                },
                {
                    "ID": 352,
                    "Identity": "BR05",
                    "Name_L1": "Fratton",
                    "Name_L2": "فراتون",
                    "Name_L3": "",
                    "Name_L4": "Fratton"
                },
                {
                    "ID": 353,
                    "Identity": "BR34",
                    "Name_L1": "Leeds",
                    "Name_L2": "ليدز",
                    "Name_L3": "",
                    "Name_L4": "Leeds"
                },
                {
                    "ID": 354,
                    "Identity": "BrJA",
                    "Name_L1": "Jebel Ali",
                    "Name_L2": "جبل علي",
                    "Name_L3": "",
                    "Name_L4": "Jebel Ali"
                },
                {
                    "ID": 355,
                    "Identity": "HWTeam",
                    "Name_L1": "HWTeam",
                    "Name_L2": "HWTeam",
                    "Name_L3": "",
                    "Name_L4": "HWTeam"
                },
                {
                    "ID": 356,
                    "Identity": "Amman",
                    "Name_L1": "Amman Branch",
                    "Name_L2": "فرع عمان",
                    "Name_L3": "",
                    "Name_L4": "Amman Branch"
                },
                {
                    "ID": 358,
                    "Identity": "Zain_Airport",
                    "Name_L1": "Zain_Airport",
                    "Name_L2": "Zain_Airport",
                    "Name_L3": "",
                    "Name_L4": "Zain_Airport"
                },
                {
                    "ID": 569,
                    "Identity": "win7",
                    "Name_L1": "win7",
                    "Name_L2": "win7",
                    "Name_L3": "",
                    "Name_L4": ""
                },
                {
                    "ID": 571,
                    "Identity": "xp",
                    "Name_L1": "xp",
                    "Name_L2": "xp",
                    "Name_L3": "",
                    "Name_L4": ""
                }
            ]        
            fetchBranches = sinon.stub(Service,"fetchBranches");
            done();
        })

        it('Test Case 1 : when Valid Branch Identity',function(done){
            fetchBranches.yields(cSUCCESS,branches);
            Service.getBranch(function(result,branch){
                result.should.equal(cSUCCESS);
                should.exist(branch);
                done();
            },"MAJD")
        });

        it('Test Case 2 : when Invalid Branch Identity',function(done){
            fetchBranches.yields(cSUCCESS,branches);
            Service.getBranch(function(result,branch){
                result.should.equal(cFAIL);
                should.not.exist(branch);
                done();
            },"Invalid Branch Identity")
        });

        it("Test Case 3 : when Can't Fetching Branches",function(done){
            fetchBranches.yields(cFAIL,null);
            Service.getBranch(function(result,branch){
                result.should.equal(cREFUSECONNECTION);
                should.not.exist(branch);
                done();
            },"Invalid Branch Identity")
        });

        it("Test Case 4 : when No Branches",function(done){
            fetchBranches.yields(cSUCCESS,[]);
            Service.getBranch(function(result,branch){
                result.should.equal(cFAIL);
                should.not.exist(branch);
                done();
            },"Invalid Branch Identity")
        });
    });
});