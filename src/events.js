var EventEmitter = require('events');
var emitter = new EventEmitter();
const chalk = require('chalk');
var io = require('socket.io-client');
var announcement = require('./Models/Announcement');
var service={"CONNECTED":'CONNECTED',"DISCONNECTED":'DISCONNECTED',"READY":'READY' ,"NOTREADY":'NOTREADY'};
var serviceStat;
var serverAddress;



emitter.on('Start',function(message){
    serviceStat=service.DISCONNECTED;
    announcement.Start((serverAddress)=>{
        if(serverAddress){
            emitter.emit('READY',serverAddress);
            serviceState=service.READY;
        }else{
            emitter.emit('NOTREADY',"Set Configurations");
            serviceState=service.NOTREADY;
        }
    });
});

emitter.on('NOTREADY',function(message){
    announcement.setConfigurations();
})

emitter.on('READY', function (url) {
    var socket = io.connect(url,{reconnection:true});
    socket.on('connect', function () {
        serviceState=service.CONNECTED;
        serverAddress=url;
        console.log(chalk.green('Connected to '+url));
        socket.on('Queuing/branchUpdates', function (message){
          announcement.Play(()=>{
          },message);
        })
    });
    socket.on('disconnect',function(){
        console.log(chalk.red(serverAddress + " Disconnected"));
    });
});

module.exports=emitter;