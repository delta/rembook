var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bioSchema = new Schema({
  user:       String,
  responses:  [{
                questionId:   Schema.Types.ObjectId,
                response:     String,
              }]
});

var Bio = mongoose.model('Bio', bioSchema);

var getBioOf = function (rollNumber) {
  return Bio.findOne({user:rollNumber});
};

var editBioOf = function (rollNumber, data, callback) {
  Bio.findOne({user:rollNumber}).then(function(doc) {
    if (doc === null){
      doc = new Bio();
    }
    doc.user = rollNumber;
    doc.responses = JSON.parse(data.responses);
    doc.save().then(function(){
      callback(null,doc);
    }).catch(function (err) {
      console.log(err);
      callback(err);
    });
  });
};

module.exports.Bio = Bio;
module.exports.getBioOf = getBioOf;
module.exports.editBioOf = editBioOf;
