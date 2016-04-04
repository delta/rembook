var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

var questionsSchema = new Schema({
  title:        String,
  description:  String,
  bio_description : String,
});

var Question = mongoose.model('Question', questionsSchema);

var getAllQuestions = function () {
  return Question.find();
};

var getQuestion = function (id) {
  return Question.findOne({_id:id});
};

var saveQuestion = function(data){
  var i;
  var saveCallback = function(err, doc){
    if(err){
      console.log("Question Could Not be saved", JSON.stringify(err));
    }
    else{
      console.log("Question Saved:", JSON.stringify(doc));
    }
  };
  for (i = 0; i < data.length; i++){
    var q = new Question();
    q.title = data[i].title;
    q.description = data[i].description;
    q.bio_description = data[i].bio_description;
    q.save(saveCallback);
  }
};

module.exports.Question = Question;
module.exports.getAllQuestions = getAllQuestions;
module.exports.getQuestion = getQuestion;
module.exports.saveQuestion = saveQuestion;
