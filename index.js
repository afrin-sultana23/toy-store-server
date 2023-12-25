const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.xyowg5n.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toysCollection = client.db('toysDB').collection('toys')
    const userToyCollection = client.db('usertoysDB').collection('userToys')
    
    // all Toys
    app.get('/toys', async(req, res) => {
      const cursor = toysCollection.find();
      console.log('cursor', cursor);
      const result = await cursor.toArray();
      console.log('result', result);
      res.send(result);
  });

  app.get('/toys/:id', async(req, res) => {  
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await toysCollection.findOne(query);
    res.send(result);

  });

  
  //  add a toy
  app.post('/toy', async(req, res) => { 
    const newToy = req.body;
    console.log(newToy);
    const result = await userToyCollection.insertOne(newToy);
    res.send(result);   
  });
  
  app.get('/toy', async(req, res) => {
      const cursor = userToyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  });

    app.patch('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updateToy = req.body;
      console.log(updateToy);
      const updateDoc = {
          $set: {
              status: updateToy.status,
          }
      };
      const result = await userToyCollection.updateOne(filter, updateDoc);
      console.log(result);

  });

  app.delete('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userToyCollection.deleteOne(query);
      res.send(result);
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Welcome to the toy marketplace!');
});
  
app.listen(port, () => {
  console.log(`Toy store listening on port: ${port}`);
})