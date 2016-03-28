module.exports = function (req, res, next) {
  if(req.session.username){
    next();
  }else{
    if (req._parsedUrl.path ==="/login"){
      next();
    }else{
      var is_ajax_request = req.xhr;
      if (is_ajax_request){
        var response = {
          status: "loggedOut",
          redirectTo: "/login"
        };
        res.json(response);
      }else {
        res.redirect("/login");
      }
    }
  }
};
