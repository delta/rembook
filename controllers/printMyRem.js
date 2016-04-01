var Users = require('../models/Users');
var Rems = require('../models/Rems');
var Bio = require('../models/Bio');
var Questions = require('../models/Questions');

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
    res.render('myRemTemplate', {layout: false}, function(err, html){

      var response ={
        user:user,
        bio:bio,
        rems:rems,
        questions:questions,
        my_html:html
      };
      res.send(response);
    });

  }).catch( function(err) {
    next(err);
  });
};
// module.exports.printMyRem = printMyRem;
module.exports.printMyRemPreview = printMyRemPreview;
