const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
// const bodyParser = require('body-parser')
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0wmac.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("carMechanic");
    const servicesCollection = database.collection("services");

    // POST api
    app.post('/services', async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.json(result)
    })

    //GET api
    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services)
    })

    //GET single service
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      console.log('getting the id', id)
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service)
    })

    //DELETE api
    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      console.log('delete the id', id)
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    })


  } finally {
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('running genious car mechanics');
});

app.listen(port, () => {
  console.log('everything is ok', port);
});