const Router = require('koa-router');
const api = new Router();
const posts = require('./posts');
const auth = require('./auth');

api.use('/auth', auth.routes())
api.use('/posts', posts.routes());

module.exports = api;