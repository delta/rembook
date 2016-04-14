var config ={
  db:"mongodb://localhost/rembook",

  base : "file:///home/labyrinth/rembook16/public/",
  phantomPath:"./node_modules/phantomjs/bin/phantomjs",
  pdfsDirectory:"./pdfs/",

  remPicPath:"./public/rempics/",
  profilePicPath:"./public/profilepic/",
  searchPicPath:"./public/thumbnail/",

  maxCharPerResonose : 500,
  maxRemsForPrint:5,
};
module.exports.config = config;
