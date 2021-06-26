const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ObjectID } = require("mongodb");

const app = express();

app.use(express.json());
app.use(cors());

const userName = process.env.DB_USER;
const pass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;
const admins = process.env.DB_COLLECTION_ADMINS;
const blogs = process.env.DB_COLLECTION_BLOGS;

const uri = `mongodb+srv://${userName}:${pass}@cluster0.twaro.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const adminCollection = client.db(dbName).collection(admins);
  const blogCollection = client.db(dbName).collection(blogs);

  // admin login:

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const admin = await adminCollection.findOne({ email: email });

    const adminPass = admin.password;

    if (!email) {
      res.status(400).json({ error: "Email Doesn't Exist!" });
    }

    if (adminPass !== password) {
      res.status(400).json({ error: "Wrong Email and Password Combination!" });
    } else {
      res.send(true);
    }
  });

  // get blogs
  app.get("/blogList", (req, res) => {
    blogCollection.find().toArray((err, documents) => {
      if (!err) {
        res.send(documents);
      } else res.send(err.message);
    });
  });

  // add blogs:

  app.post("/addBlog", (req, res) => {
    const newBlog = req.body;

    blogCollection
      .insertOne(newBlog)
      .then((result) => {
        res.send(result.insertedCount > 0);
      })
      .catch((error) => {
        res.send(error);
      });
  });

  // delete blog:
  app.delete("/deleteBlog/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    blogCollection
      .findOneAndDelete({ _id: id })
      .then((documents) => res.send(documents.value));
  });

  if (err) {
    console.log(err.message);
  } else {
    console.log("Connected to Database");
  }
});

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send(`Retro Blogger Server running on port ${port}`);
});

app.listen(port);
