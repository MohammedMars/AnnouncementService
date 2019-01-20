var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var configurationsRouter = require('./src/Controllers/configurations.js');
var io = require('socket.io-client');
var socket = io.connect("https://pretty-firefox-79.localtunnel.me/", {reconnection: true});
var app = express();
var ejs = require('ejs');
const isLocal = typeof process.pkg === 'undefined'
const appDir = isLocal ? process.cwd() : path.dirname(process.execPath)
const Port = process.env.PORT || 8080;
var service={"INITIALIZED":'INITIALIZED' , "CONNECTED":'CONNECTED',"DISCONNECTED":'DISCONNECTED'};
var serviceState="";
var fs = require('fs');
var service = require('./src/Services/Service.js');
var announcement = require('./src/Models/Announcement.js');
app.set('views', path.join(appDir, 'views/WebView'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(appDir, 'views/public')));
app.use('/Configurations', configurationsRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(Port,function(req,res){
  console.log("Server is Running ... ");
  announcement.Start();
  serviceState = service.INITIALIZED;
});

socket.on('connect', function () {
  serviceState = service.CONNECTED;
  console.log('connected to https://pretty-firefox-79.localtunnel.me/');
  socket.on('Queuing/branchUpdates', function (message){
    announcement.Play(()=>{
    },message);
  })
});
socket.on('disconnect',function(){
  serviceState = service.DISCONNECTED;
})
module.exports = app;
