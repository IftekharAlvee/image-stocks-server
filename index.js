const express = require('express');
const app = express();
const port = process.env.PORT || 5055;
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
require('dotenv').config();


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://ImageStockAdmin:test1234@cluster0.s69t4.mongodb.net/imageStock?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(error => {
  console.log(error);
  const imageCollection = client.db("imageStock").collection("images");
  const ordersCollection = client.db("imageStock").collection("orders");

  app.get('/images',(req,res) => {
    imageCollection.find()
    .toArray((err, items) => {
      res.send(items);
      console.log(items);
    })
    
  });

  app.delete('/deleteImage/:id',(req,res) => {
    const Id = ObjectID(req.params.id);
    console.log("delete this",  Id);
    imageCollection.deleteOne({_id: Id})
    .then(documents => {
      console.log(documents.deletedCount);
      res.send(documents)
    })
  });
  
  app.post('/addImage',(req,res) => {
    const newImage = req.body;
    console.log(newImage);
    imageCollection.insertOne(newImage)
    .then(result => {
      console.log("kam sarse: " , result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  });

  app.post('/addOrder',(req,res) => {
    const newOrder = req.body;
    // console.log(newOrder);
    ordersCollection.insertOne(newOrder)
    .then(result => {
      
      res.send(result.insertedCount > 0)
    })
  });


  app.get('/orders',(req,res) => {
    ordersCollection.find({email: req.query.email})
    .toArray((err, items) => {
      res.send(items);
      // console.log(items);
    })
    
  });

  console.log("Database connected");
});


app.get('/', (req, res) => {
  res.send('Heroku deployrd')
})

app.listen(port);