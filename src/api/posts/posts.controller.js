const Post = require("models/post");
const {
  Types: { ObjectId }
} = require("mongoose");

exports.list = async ctx => {
  let posts;
  try {
    // 반환값이 Promise 이므로 await 사용가능
    posts = await Post.find()
      .sort({ _id: -1 })
      .limit(12)
      .exec();
  } catch (error) {
    return ctx.body(500, error);
  }

  // console.log(posts)
  ctx.body = posts;
};

exports.search = async ctx => {
  const { key, value } = ctx.params;
  let post = null;

  try {
    post = await (key === "title"
      ? Post.findByTitle(value)
      : Post.findByUsername(value));
  } catch (error) {
    ctx.throw(500, error);
  }

  ctx.body = post;
};

exports.write = async ctx => {
  // console.log('들어오나')
  const {
    title,
    username,
    text,
    photo,
    tags,
    date,
    is_edited,
    // meta
  } = ctx.request.body;
  const post = new Post({
    title,
    username,
    text,
    photo,
    tags,
    date,
    is_edited,
    // meta
  });

  try {
    await post.save();
  } catch (error) {
    return ctx.throw(500, error);
  }
  // console.log(post);
  ctx.body = post;
};

// put은 데이터 통째로 바꿈 && 데이터 없을 시 새로 만듬
// exports.replace = async ctx => {
//   const { id } = ctx.params;

//   if (!ObjectId.isValid(id)) {
//     ctx.status = 400;
//     return;
//   }

//   const schema = Joi.object().keys({
//     title: Joi.string().required(),
//     username: Joi.string().required(),
//     text: Joi.string().required(),
//     photo: Joi.string().required(),
//     tags: Joi.array().items(Joi.string().required())
//   });

//   // 검증
//   const result = Joi.validate(ctx.request.body, schema);

//   if (result.error) {
//     ctx.status = 400;
//     ctx.body = result.error;
//     return;
//   }

//   let post;
//   try {
//     post = await Post.findByIdAndUpdate(id, ctx.request.body, {
//       upsert: true,
//       new: true
//     });
//   } catch (error) {
//     return ctx.throw(500, e);
//   }
//   ctx.body = post;
// };

exports.delete = async ctx => {
  const { id } = ctx.params;

  try {
    await Book.findByIdAndRemove(id).exec();
  } catch (error) {
    if (error.name === "CastError") {
      ctx.status = 400;
      return;
    }
  }
  ctx.status = 204;
};

exports.update = async ctx => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }
  let post;
  try {
    post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true
    });
  } catch (error) {
    return ctx.throw(500, e);
  }
  ctx.body = post;
};
