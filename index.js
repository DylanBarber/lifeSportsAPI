require('dotenv').config()
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const ObjectId = require('mongodb').ObjectId;

const app = express();

app.use(bodyParser.json());

if (process.env.NODE_ENV === "production") {
  uri = process.env.ATLAS_URI;
} else {
  // localhost
  uri = process.env.LOCAL_URI
}

let db = ""
let dbName = "notetaker"
MongoClient.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
},
  (err, client) => {
    if (err) {
      console.log(err)
      return
    }
    console.log("Connected successfully to server")
    db = client.db(dbName)
  });


app.post('/add', (req, res) => {
  const collection = db.collection('notes')
  if (req.body === undefined) return res.status(400).send("No insert parameters were supplied");
  collection.insertOne(req.body, (err, data) => {
    if (err) return res.status(500).send(err);
    res.send(data);
  })
})

const port = process.env.PORT || 25565;
app.listen(port, (req, res) => {
  console.log(`Listening on ${port}`);
})