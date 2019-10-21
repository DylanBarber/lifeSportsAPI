require("dotenv").config();
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;

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
  const collection = db.collection("users");
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

app.get("/:id", (req, res) => {
  if (req.body.type === "users") {
    const collection = db.collection("users");
    collection.find({}).toArray((err, data) => {
      if (err) return res.status(500).send(err);
      res.json(data);
    });
  } else if (req.body.type === "exercises") {
    const collection = db.collection("users");
    if (req.params.id) {
      collection.find({ "eid": id });
    } else {
      collection.find({}).project({ __id: 1, title: 1 }).toArray((err, data) => {
        if (err) return res.status(500).send(err);
        res.json(data);
      });
    }
  }

});

app.delete("/:id", (req, res) => {
  if (req.body.type === "user") {
    const collection = db.collection("users");
    const uid = new MongoClient.ObjectId(req.params.id);
    collection.remove({ "__id": uid }, (err, data) => {
      if (err) return res.status(500).send(err);
      res.json(data);
    });
  }
  if (req.body.type === "exercise") {
    const collection = db.collection("users");
    const eid = req.params.id; 
    collection.remove({"eid": eid}, (err, data) => {
      if (err) return res.status(500).send(err); 
      res.json(data); 
    });
  }
});

app.post("/update/:id", (req, res) => {
  if (req.body.type === "user"){ 
    const collection = db.collection("users"); 
    const uid = MongoClient.ObjectId(req.params.id); 
    collection.find({"__id": uid}, (err, data) => {
      if (err) return res.status(500).send(err); 
      res.json(data);
    });
  } else if (req.body.type === "exercise") {
    const collection = db.collection("users");
    const eid = req.params.id;
    collection.find({"eid": eid}, (err, data) => {
      if (err) return res.status(500).send(err); 
      res.json(data);
    });
  }
});


const port = process.env.PORT || 25565;
app.listen(port, (req, res) => {
  console.log(`Listening on ${port}`);
});