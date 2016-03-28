var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

var questionsSchema = new Schema({
  title:        String,
  description:  String
});

var Question = mongoose.model('Question', questionsSchema);

var getAllQuestions = function () {
  return Question.find();
};

var getQuestion = function (id) {
  return Question.findOne({_id:id});
};

module.exports.Question = Question;
module.exports.getAllQuestions = getAllQuestions;
module.exports.getQuestion = getQuestion;
