var Bio = require('../models/Bio');

var getBioOf = function (req, res, next) {
  var rollNumber = req.params.rollNumber;
  Bio.getBioOf(rollNumber)
    .then(function(bio){
      var response={};
      if (bio === null){
        response.success = 0;
        response.message = "Bio Not Found";
        res.json(response);
      }else {
        response.user = rollNumber;
        response.responses = bio.responses;
        res.json(response);
      }
    }).catch(function (err) {
      console.log(err);
      next(err);
    });
};

module.exports.getBioOf = getBioOf;
