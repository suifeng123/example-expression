module.exports = function(app) {
  app.get('/',function(req,res){
    consoel.log('��ʼ���п�ʼ');
    console.log('express��·��չʾ');
    res.redirect('/posts');  //
    console.log('·�ɽ���');
  });
  app.use('/signup',require('./signup'));
  app.use('/signin',require('./signin'));
  app.use('/signout',require('./signout'));
  app.use('/posts',require('./post'));
  //404page
  app.use(function(req,res){
    if(!res.headersSent){
      res.status(404).render('404');
    }
  })
}
