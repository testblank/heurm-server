const Router = require('koa-router');

const posts = new Router();
const postsCtrl = require('./posts.controller')

posts.get('/', postsCtrl.list);
posts.get('/:id', postsCtrl.get);
posts.post('/', postsCtrl.create);
// posts.delete('/:id', postsCtrl.delete);
// posts.put('/:id', postsCtrl.replace);
// posts.patch('/:id', postsCtrl.update);

module.exports = posts;