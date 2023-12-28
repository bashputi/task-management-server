const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();


  app.use(express.json());

  const port = process.env.PORT || 5000;
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fobkzbd.mongodb.net/?retryWrites=true&w=majority`;

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  
  async function run() {
    try {
        const taskCollection = client.db('TaskDB').collection('tasks');

        app.post('/tasks', async(req, res) => {
            const taskitem = req.body;
            const result = await taskCollection.insertOne(taskitem);
            res.send(result);
          }) 
          app.get('/tasks', async (req, res) => {
            const result = await taskCollection.find().toArray();
            res.send(result);
          });
      
app.get('/usertasks', async (req, res) => {
            try {
                console.log(req.query.email);
                let query = {};
                if (req.query?.email) {
                    console.log(req.query?.email)
                    query = { email: req.query.email };
                }
                const result = await taskCollection.find(query).toArray();
                console.log(result)
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        });
        app.delete('/usertasks/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
          })
       
          app.get('/usertasks/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id)};
            const result = await taskCollection.findOne(query);
            res.send(result);
          })
          app.put('/usertasks/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const options = { upsert: true };
            const updatedItem = req.body;
            const item ={
              $set: {
                name: updatedItem.name,
                email: updatedItem.email,
                priority: updatedItem.priority,
                notes: updatedItem.notes,
                customerName: updatedItem.name,
                title: updatedItem.title,
                time: updatedItem.time,
                
              }
            };
            const result = await taskCollection.updateOne(filter, item, options);
            res.send(result);
          })




        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
      } finally {
      
      }
    }
    run().catch(console.dir);
    
    app.get('/', (req, res) => {
        res.send('Task is running')
    });
    app.listen(port, () => {
        console.log(`Task is running on port ${port}`)
    });
