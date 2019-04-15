const Post = require("models/post");
const Joi = require("joi");
const {
  Types: { ObjectId }
} = require("mongoose");

exports.list = async ctx => {
  let posts;
  try {
    posts = await Post.find()
      .sort({ _id: -1 })
      .limit(12)
      .exec();
  } catch (error) {
    return ctx.body(500, error);
  }

  ctx.body = posts;
};

exports.get = async ctx => {
  const { title } = ctx.params;

  let post;

  try {
    post = await Post.findById(title).exec();
  } catch (error) {
    if (error.name === "CastError") {
      ctx.status = 400;
      return;
    }
    return ctx.body(500, error);
  }

  if (!post) {
    ctx.status = 400;
    ctx.body = { message: "post not found" };
    return;
  }

  ctx.body = post;
};

exports.create = async ctx => {
  const { title, username, text, photo, tags } = ctx.request.body;
  const post = new Post({
    title,
    username,
    text,
    photo,
    tags
  });

  try {
    await post.save();
  } catch (error) {
    return ctx.throw(500, error);
  }

  ctx.body = post;
};

// exports.replace = async ctx => {
//   const { id } = ctx.params;

//   if (!ObjectId.isValid(id)) {
//     ctx.status = 400;
//     return;
//   }

//   const schema = Joi.object().keys({
//     title: Joi.string().required(),
//     authors: Joi.array().items(
//       Joi.object().keys({
//         name: Joi.string().required(),
//         email: Joi.string()
//           .email()
//           .required()
//       })
//     ),
//     publishedDate: Joi.date().required(),
//     price: Joi.number().required(),
//     tags: Joi.array().items(Joi.string().required())
//   });

//   const result = Joi.validate(ctx.request.body, schema);

//   if (result.error) {
//     ctx.status = 400;
//     ctx.body = result.error;
//     return;
//   }

//   let book;

//   try {
//     book = await book.findByIdAndUpdate(id, ctx.request.body, {
//       upsert: true,
//       new: true
//     });
//   } catch (error) {
//     return ctx.throw(500, error);
//   }

//   ctx.body = book;
// };

// exports.delete = async ctx => {
//   const { id } = ctx.params;

//   try {
//     await Book.findByIdAndRemove(id).exec();
//   } catch (error) {
//     if (error.name === "CastError") {
//       ctx.status = 400;
//       return;
//     }
//   }
//   ctx.status = 204;
// };

// exports.update = async ctx => {
//   const { id } = ctx.params;
//   if (!ObjectId.isValid(id)) {
//     ctx.status = 400;
//     return;
//   }
//   let book;
//   try {
//     book = await Book.findByIdAndUpdate(id, ctx.request.body, {
//       new: true
//     });
//   } catch (error) {
//     return ctx.throw(500, e);
//   }
//   ctx.body = book;
// };
