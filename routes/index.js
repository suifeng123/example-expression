module.exports = function(app) {
  app.get('/',function(req,res){
    consoel.log('开始进行开始');
    console.log('express的路由展示');
    res.redirect('/posts');  //
    console.log('路由进行');
  });
  app.use('/signup',require('./signup'));
  app.use('/signin',require('./signin'));
  app.use('/signout',require('./signout'));
  console.log('the app is here');
  app.use('/posts',require('./posts'));
  //404page
  app.use(function(req,res){
    if(!res.headersSent){
      res.status(404).render('404');
    }
  })
}
