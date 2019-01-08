module.exports.ErrorLogging=function(Error)
{
try{
      header="-------------------------------------\r\n";
      footer="-------------------------------------\r\n";
      date = new Date()
      let Message =  date+"\r\n"+header+Error+"\r\n"+footer;
      let FinalMessage="";
      var fs = require('fs');
      var contents = fs.readFileSync('./log/log.txt', 'utf8');
      if(contents.length>0)
          FinalMessage=contents+"\r\n"+Message;
      else
      FinalMessage=Message;

      fs.writeFile('./log/log.txt',FinalMessage, function(err) {
          if (err) {
            throw err;
          }
      });
  }
  catch(err){
      console.log("The Error Does not Saved\n"+err);
  }
}