const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");

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
