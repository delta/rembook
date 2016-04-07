var Users = require('../models/Users');
var Rems = require('../models/Rems');
var Bios = require('../models/Bio');
var Questions = require('../models/Questions');
var fs = require('fs');
var pdf = require('html-pdf');
var globalConfig = require('../config').config;

var download = function(req, res, next){
  Promise.all([
    Users.getAllFinalYearUsers(),
    Bios.getAllBios(),
    Rems.getAllApprovedForPrintRem(),
    Questions.getAllQuestions()
  ]).then(function(results){
    var users =[];
    var bios = results[1];
    var rems = results[2];
    var questions = results[3];
    var i, j;
    var page = {};
    for (i = 0; i < results[0].length; i+=2){
      page ={};
      page.left ={};
      page.left.user = results[0][i];
      for (j = 0; j < bios.length; j++){
        if (bios[j].user === page.left.user.rollNumber){
          page.left.bio = bios[j];
          bios.splice(j,1);
          j--;
        }
      }
      page.left.rems = [];
      for (j = 0; j < rems.length; j++){
        if (rems[j].to === page.left.user.rollNumber){
          page.left.rems.push(rems[j]);
          rems.splice(j,1);
          j--;
          if (page.left.rems.length == 5){
            break;
          }
        }
      }
      if (typeof results[0][i+1] !== 'undefined'){
        page.right={};
        page.right.user = results[0][i+1];
        for (j = 0; j < bios.length; j++){
          if (bios[j].user === page.right.user.rollNumber){
            page.left.bio = bios[j];
            bios.splice(j,1);
            j--;
          }
        }
        page.right.rems = [];
        for (j = 0; j < rems.length; j++){
          if (rems[j].to === page.right.user.rollNumber){
            page.right.rems.push(rems[j]);
            rems.splice(j,1);
            j--;
            if (page.right.rems.length == 5){
              break;
            }
          }
        }
      }
      users.push(page);
    }
    res.render('finalRembook.ejs',{
      users:users,
      questions:questions,
    },function (err, html) {
        if (err){
          next(err);
        }else{
          var config = {
            directory:globalConfig.pdfsDirectory,
            height:"2480px",
            width:"3508px",
            base: globalConfig.base,
            // phantomPath: globalConfig.phantomPath,
            timeout:150000
          };

          pdf.create(html, config).toFile(function(err, result){
            if (err){
              next(err);
            }else{
              res.download(result.filename, "RembookPrint.pdf", function (err) {
                fs.unlink(result.filename, function(err){
                  if(err){
                    console.log(err);
                  }
                });
              });
            }
          });
          // res.send(html);
        }
      });
  }).catch(function(err){
    next(err);
  });
};

module.exports.download = download;
