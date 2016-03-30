var multer = require('multer');
var upload = multer({
  dest:"./public/profilepic",
});
var fs = require('fs');
var easyimage = require('easyimage');
var User = require('../models/Users');

module.exports.uploadFile = function (router) {
  router.post('/profilepic', upload.single('profilepic'), function (req, res, next) {
    var rollNumber = req.session.rollNumber;
    var ext = req.file.mimetype.split("/")[1];
    var fileType = req.file.mimetype.split("/")[0];
    var response = {};
    if (fileType !== "image"){
      fs.unlink(req.file.path, function(err,data){
        if (err){
          next(err);
        }else {
          response.success = 0;
          response.message = "Not a Image File";
          res.json(response);
        }
      });
    }else{
      var fileName = rollNumber + "." + ext;
      var finalPath = "./public/profilepic/"+fileName;
      fs.rename(req.file.path, finalPath ,function (err, data) {
        if (err){
          next(err);
        }else{
          easyimage.resize({
            src:finalPath,
            dst:finalPath,
            width:500,
            height:500,
          }).then(function(image){
            var callback = function (err, doc) {
              if (err){
                next(err);
              }else {
                response.success = 1;
                response.message = "";
                res.json(response);
              }
            };
            User.updatePhotoName(rollNumber, fileName, callback);
          }).catch(function (err) {
            next(err);
          });
        }
      });
    }
  });
};
