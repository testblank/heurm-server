require("dotenv").config();

const Koa = require("koa");
const Router = require("koa-router");

const app = new Koa();
const router = new Router();
const api = require("./api");

const mongoose = require("mongoose");
const bodyParser = require("koa-bodyparser");

const { jwtMiddleware } = require('lib/token');

mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.MONGO_URI, {
    // useMongoClient: true
    useNewUrlParser: true
  })
  .then(res => {
    console.log("Successfully connected to mongodb");
  })
  .catch(e => {
    console.log(e);
  });

const port = process.env.PORT || 4000;

app.use(bodyParser());
app.use(jwtMiddleware);
router.use("/api", api.routes());
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log("sakura server is listening to port " + port);
});
