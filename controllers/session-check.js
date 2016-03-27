module.exports = function (req, res, next) {
  if(req.session.username){
    next();
  }else{
    if (req._parsedUrl.path ==="/login"){
      next();
    }else{
      res.redirect("/login");
    }
  }
};
