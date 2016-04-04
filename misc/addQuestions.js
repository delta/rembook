var Questions = require('../models/Questions');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rembook');

var Qs = [
  {title:"nicknames", description:"Nicknames of", bio_description:"My Nicknames"},
  {title:"about", description:"A Few words about", bio_description:"About Me" },
  {title:"features",description:"The first thing that strikes you about", bio_description:"My Striking Features"},
  {title:"words",description:"Frequently used Words by", bio_description:"Frequently Uttered Words" }
];

Questions.saveQuestion(Qs);
