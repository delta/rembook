var Users = require('../models/Users');
var Rems = require('../models/Rems');
var Bios = require('../models/Bio');
var Questions = require('../models/Questions');

// var download = function (req, res, next) {
//   Users.getAllUsers()
//   .then(function(doc){
//     var pages=[];
//     var i = 0;
//     var attachPage = function(pages, users){
//       var page = {};
//       // Promise.all([
//       //   Rems.getAllApprovedRemsTo(users[0].rollNumber),
//       //   Rems.getAllApprovedRemsTo(users[1].rollNumber)
//       // ]).then(function(results){
//       //   page.left = {};
//       //   page.left.user = users[0];
//       //   page.left.rems = results[0];
//       //   page.right = {};
//       //   page.right.user = users[1];
//       //   page.right.rems = results[1];
//       //   pages.push(page);
//       // });
//       var getPageDetailsFor = function(user){
//
//       };
//       Rems.getAllApprovedForPrintRemsTo(users[0].rollNumber).then(function(rems){
//         page.left = {};
//         page.left.user = users[0];
//         page.left.rems = rems;
//       });
//       if (typeof users[1] !== 'undefined'){
//         Rems.getAllApprovedForPrintRemsTo(users[1].rollNumber).then(function(rems){
//           page.right = {};
//           page.right.user = users[1];
//           page.right.rems = rems;
//         });
//       }
//       pages.push(page);
//     };
//
//     for (i = 0; i < doc.length; i += 2){
//       var users = [];
//       users.push(doc[i]);
//       if (typeof doc[i+1] !== 'undefined'){
//         users.push(doc[i+1]);
//       }
//       attachPage(pages, users);
//     }
//   })
//   .catch(function(err){
//     next(err);
//   });
//
// };
//
// module.exports.download = download;

var download = function(req, res, next){
  Promise.all([
    Users.getAllUsers(),
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
        }
      }
      page.left.rems = [];
      for (j = 0; j < rems.length; j++){
        if (rems[j].to === page.left.user.rollNumber){
          page.left.rems.push(rems[j]);
        }
      }
      if (typeof results[0][i+1] !== 'undefined'){
        page.right={};
        page.right.user = results[0][i+1];
        for (j = 0; j < bios.length; j++){
          if (bios[j].user === page.right.user.rollNumber){
            page.left.bio = bios[j];
          }
        }
        page.right.rems = [];
        for (j = 0; j < rems.length; j++){
          if (rems[j].to === page.right.user.rollNumber){
            page.right.rems.push(rems[j]);
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
          res.send(html);
        }
      });
  }).catch(function(err){
    next(err);
  });
};

module.exports.download = download;
