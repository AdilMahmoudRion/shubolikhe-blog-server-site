const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mi132.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
/* client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
 */
async function run() {
  console.log("run");
  await client.connect();
  const database = client.db("shubolikheBlog");
  const BlogCollection = database.collection("blog");

  try {
    app.get("/h-blog", async (req, res) => {
      const blog = BlogCollection.find({});
      const page = req.query.page;
      const size = parseInt(req.query.size);
      let result;
      const count = await blog.count();
      if (page) {
        result = await blog
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        result = await blog.toArray();
      }
      res.send({
        result,
        count,
      });
    });

    app.post("/blog", async (req, res) => {
      const blog = req.body;
      const result = await BlogCollection.insertOne(blog);
      res.json(result);
    });

    app.get("/blog", async (req, res) => {
      const blog = BlogCollection.find({});
      const result = await blog.toArray();
      res.send(result);
    });
    app.get("/read-blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const blog = await BlogCollection.findOne(query);
      res.json(blog);
    });
    app.get("/tag-blog/:query", async (req, res) => {
      const queryId = req.params.query;
      const query = { category: queryId };
      const blog = await BlogCollection.find(query);
      const result = await blog.toArray();
      res.json(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello welcome to !");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
