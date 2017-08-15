var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite')(__dirname);
var routes = require('./routes');
var pkg = require('./package');
var winston = require('winston');
var expressWinston = require('express-winston');

var app = express();

//设置模板目录
app.set('views',path.join(__dirname,'views'));
//设置模板引擎为 ejs
app.set('view engine','ejs');

//设置静态文件目录
app.use(express.static(path.join(__dirname,'public')));
//session 中间件
app.use(session({
  name:config.session.key, //设置cookie中保存session id的字段名称
  secret:config.session.secret,//通过设置secret计算hash值
  cookie: {
    maxAge: config.session.maxAge
  },
  store: new MongoStore({
    url:config.mongodb //mongodb的地址
  })
}));
//flash 中间件，用来显示通知
app.use(flash());

//路由
routes(app);

//处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname,'public/img'),//上传文件目录
}));

//设置模板全局常量
app.locals.blog = {
  title: pkg.name,
  description:pkg.decription
};
//添加模板必须的三个变量
app.use(function(req,res,next){
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});

//正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}));
//错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}));

//error page
app.use(function(err,req,res,next){
  res.render('error',{
    error: err
  })
});

if(module.parent){
  module.exports = app;
}else{
  //监听断口，启动程序
  app.listen(config.port,function(){
    console.log(`${pkg.name} listening on port ${config.port}`);
  })
}
