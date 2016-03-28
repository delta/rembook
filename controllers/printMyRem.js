var Users = require('../models/Users');
var Rems = require('../models/Rems');
var Bio = require('../models/Bio');
var Questions = require('../models/Questions');
var fs = require('fs');
var pdf = require('html-pdf');


var printMyRemPreview = function (req, res, next){
  var rollNumber = req.session.rollNumber;
  Promise.all([
    Users.getUserByRollNumber(rollNumber),
    Bio.getBioOf(rollNumber),
    Rems.getAllRemsTo(rollNumber),
    Questions.getAllQuestions()
  ]).then(function(results){
    var user = results[0];
    var bio = results[1];
    var rems = results[2];
    var questions = results[3];
    res.render('myRemTemplate',{
      user:user,
      bio:bio,
      rems:rems,
      questions:questions,
    }, function(err, html){
      //Generrate PDF
      var config = {
        directory:"./pdfs/",
        width:"700px",
        height:"14in",
        border:{
          "top": "0.5in",
          "right": "0.5in",
          "bottom": "0.5in",
          "left": "0.5in"
        },
        base:"file:///home/rizwan/projects/rembook/public/",
        phantomPath:"./node_modules/phantomjs/bin/phantomjs"
      };

      pdf.create(html, config).toFile(function(err, result){
        if (err){
          next(err);
        }else{
          res.download(result.filename);
        }
      });

      //For Testing
      //  res.send(html);
    });
  }).catch( function(err) {
    next(err);
  });
};
// module.exports.printMyRem = printMyRem;
module.exports.printMyRemPreview = printMyRemPreview;