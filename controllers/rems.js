var Rem = require('../models/Rems');

var getAllRemsTo = function (req, res, next) {
  var rollNumber = req.params.rollNumber;
  var requestedBy = req.session.rollNumber;
  console.log(rollNumber, "requests ", requestedBy);
  Rem.getAllRemsTo(rollNumber).then(function (doc) {
    console.log(JSON.stringify(doc));
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

module.exports.getAllRemsTo = getAllRemsTo;
