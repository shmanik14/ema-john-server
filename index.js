const express = require('express');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 4000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxkd4.mongodb.net/emaJohnStore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

client.connect(err => {
  const products = client.db("emaJohnStore").collection("products");
  const orderCollection = client.db("emaJohnStore").collection("orders");
  
  app.post('/addProduct', (req,res) => {
      const product = req.body;
      products.insertMany(product)
      .then(result => {
          console.log(result);
      })
  })

  app.post('/addOrder', (req,res) => {
      const order = req.body;
      orderCollection.insertOne(order)
      .then(result => {
          console.log(result);
      })
  })

  app.get('/allProduct', (req, res) => {
    products.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/product/:key', (req, res) => {
    products.find({key: req.params.key})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  app.post('/productByKey', (req, res) => {
    const productKeys = req.body;
    products.find({key: {$in: productKeys}})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)