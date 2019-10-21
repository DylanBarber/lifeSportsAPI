require("dotenv").config();
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());

if (process.env.NODE_ENV === "production") {
  uri = process.env.ATLAS_URI;
} else {
  // localhost
  uri = process.env.LOCAL_URI;
}

let db = "";
let dbName = "notetaker";
MongoClient.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
},
  (err, client) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Connected successfully to server");
    db = client.db(dbName);
  });


app.post("/add", (req, res) => {
  const collection = db.collection("user");
  if (req.body === undefined) return res.status(400).send("No insert parameters were supplied");
  if (req.body.type = "user") {
    collection.insertOne(req.body, (err, data) => {
      if (err) return res.status(500).send(err);
      res.json(data);
    });
  } else if (req.body.type = "exercise") {
    collection.insertOne(req.body, (err, data) => {
      if (err) return res.status(500).send(err);
      res.json(data);

    });
  };
});

app.get("/", (req, res) => {
  if (req.body.type === "user") {
    if (req.body.id) {
      const uid = ObjectId(req.body.id);
      const collection = db.collection("user");
      collection.find({ "_id": uid }).toArray((err, data) => {
        if (err) return res.status(500).send(err);
        return res.json(data);
      });
    } else {
      const collection = db.collection("user");
      collection.find({}).toArray((err, data) => {
        if (err) return res.status(500).send(err);
        res.json(data);
      });
    }

  } else if (req.body.type === "exercises") {
    const collection = db.collection("user");
    if (req.body.id) {
      collection.find({ "eid": id });
    } else {
      collection.find({}).project({ _id: 1, title: 1 }).toArray((err, data) => {
        if (err) return res.status(500).send(err);
        res.json(data);
      });
    }
  }

});

app.delete("/:id", (req, res) => {
  if (req.body.type === "user") {
    const collection = db.collection("user");
    const uid = new MongoClient.ObjectId(req.params.id);
    collection.remove({ "_id": uid }, (err, data) => {
      if (err) return res.status(500).send(err);
      res.json(data);
    });
  }
  if (req.body.type === "exercise") {
    const collection = db.collection("user");
    const eid = req.params.id;
    collection.remove({ "eid": eid }, (err, data) => {
      if (err) return res.status(500).send(err);
      res.json(data);
    });
  }
});

app.put("/update/:id", (req, res) => {
  if (req.body.type === "user") {
    const collection = db.collection("user");
    const uid = MongoClient.ObjectId(req.params.id);
    collection.find({ "_id": uid }, (err, data) => {
      if (err) return res.status(500).send(err);
      res.json(data);
    });
  } else if (req.body.type === "exercise") {
    const collection = db.collection("user");
    const eid = req.params.id;
    collection.find({ "eid": eid }, (err, data) => {
      if (err) return res.status(500).send(err);
      res.json(data);
    });
  }
});


const port = process.env.PORT || 25565;
app.listen(port, (req, res) => {
  console.log(`Listening on ${port}`);
});