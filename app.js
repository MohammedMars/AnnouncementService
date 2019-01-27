const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const emitter = require('./src/events.js');
const configurationsRouter = require('./src/Controllers/configurations.js');
const ejs = require('ejs');
const isLocal = typeof process.pkg === 'undefined'
const appDir = isLocal ? process.cwd() : path.dirname(process.execPath)
const Port = process.env.PORT || 8080;
const app = express();
app.set('views', path.join(appDir, 'views/WebView'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(appDir, 'views/public')));
app.use('/Configurations', configurationsRouter);
var os =  require('os');
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
  try{
      console.log("Server is Running ... ");
      console.log(platform+" : "+os.platform());
      console.log(hostname+" : "+os.hostname());
      console.log(release+" : "+os.release());
      console.log(arch+" : "+os.arch());
      emitter.emit('Start',"Starting The Announcemet Service");
  }
  catch(err){
    console.log(err);
  }
})

module.exports = app
