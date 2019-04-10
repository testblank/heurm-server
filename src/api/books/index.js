const Router = require('koa-router');

const books = new Router();
const booksCtrl = require('./books.controller')

// const handler = (ctx, next) => {
//   ctx.body = `${ctx.request.method} ${ctx.request.path}`;
// };

books.get('/', booksCtrl.list);
books.get('/:id', booksCtrl.get);
books.post('/', booksCtrl.create);
books.delete('/:id', booksCtrl.delete);
books.put('/:id', booksCtrl.replace);
books.patch('/:id', booksCtrl.update);

module.exports = books;