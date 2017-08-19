module.exports = {
  port: 8001,
  session: {
    secret: 'myblog1',
    key: 'myblog1',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/myblog1'
};
