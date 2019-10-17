require('dotenv').config()
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;

const app = express();
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

  app.get('/', (req, res) => {
    const collection = db.collection('notes')
    collection.find({}).toArray((err, data) => {
      if (err) return res.status(500).send(err); 
      res.send(data);
    })
    // res.send('test received');
  })

  const port = process.env.PORT || 25565; 
  app.listen(port, (req, res) => {
    console.log('Listening');
  })