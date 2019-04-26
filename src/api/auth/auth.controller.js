const Joi = require("joi");
const Account = require("models/Account");

exports.localRegister = async ctx => {
  // 데이터 검증
  const schema = Joi.object().keys({
    username: Joi.string()
      .alphanum()
      .min(4)
      .max(15)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required()
      .min(6)
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    return;
  }

  // id email conflict check
  let existing = null;
  try {
    existing = await Account.findByEmailOrUsername(ctx.request.body);
  } catch (error) {
    ctx.throw(500, error);
  }

  if (existing) {
    ctx.status = 409;
    ctx.body = {
      key: existing.email === ctx.request.body.email ? "email" : "username"
    };
    return;
  }

  let account = null;
  try {
    account = await Account.localRegister(ctx.request.body);
  } catch (error) {
    ctx.throw(500, error);
  }

  let token = null;
  try {
    token = await account.generateToken();
    // console.log(token);
  } catch (error) {
    ctx.throw(500, error);
  }

  ctx.cookies.set("access_token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
  ctx.body = account.profile;
};

exports.localLogin = async ctx => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required()
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    return;
  }

  const { email, password } = ctx.request.body;

  let account = null;
  try {
    account = await Account.findByEmail(email);
  } catch (error) {
    ctx.throw(500, e);
  }

  if (!account || !account.validatePassword(password)) {
    ctx.status = 403;
    return;
  }

  let token = null;
  try {
    token = await account.generateToken();
  } catch (error) {
    ctx.throw(500, error);
  }

  ctx.cookies.set("access_token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
  ctx.body = account.profile;
};

exports.exists = async ctx => {
  const { key, value } = ctx.params;
  let account = null;

  try {
    account = await (key === "email"
      ? Account.findByEmail(value)
      : Account.findByUsername(value));
  } catch (error) {
    ctx.throw(500, error);
  }

  ctx.body = {
    exists: account !== null
  };
};

exports.logout = async ctx => {
  ctx.cookies.set("access_token", null, {
    httpOnly: true,
    maxAge: 0
  });
  ctx.status = 204;
};

exports.check = ctx => {
  const { user } = ctx.request;

  if (!user) {
    ctx.status = 403;
    return;
  }

  ctx.body = user.profile;
};
