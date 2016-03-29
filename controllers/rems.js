var Rem = require('../models/Rems');

var getAllRemsTo = function (req, res, next) {
  var rollNumber = req.params.rollNumber;
  var requestedBy = req.session.rollNumber;
  Rem.getAllRemsTo(rollNumber).then(function (doc) {
    var response = {};
    if (doc.length === 0){
      response.success = 0;
      response.message = "No Rems Found";
      res.json(response);
    }else{
      var rems =[];
      var i;
      for (i=0;i<doc.length;i++){
        var rem = {};
        rem.id = doc[i].id;
        rem.to = doc[i].to;
        rem.from = doc[i].from;
        rem.responses = doc[i].responses;
        if (rollNumber === requestedBy){
          rem.approved = doc[i].approved;
          rem.print = doc[i].print;
        }
        rems.push(rem);
      }
      response.rems = rems;
      res.json(rems);
    }
  }).catch(function(err){
    console.log(err);
    next(err);
  });
};

var updateRem = function(req, res, next){
  var from = req.session.rollNumber;
  var to = req.params.rollNumber;
  var data = JSON.parse(req.body.responses);
  var callback = function (err, doc) {
    var response={};
    if (err){
      next(err);
    }else{
      response.success = 1;
      response.message = "";
      res.json(response);
    }
  };
  Rem.updateRem(from, to, data, callback);
};

module.exports.getAllRemsTo = getAllRemsTo;
module.exports.updateRem = updateRem;
