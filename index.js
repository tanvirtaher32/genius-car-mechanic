const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const objectId = require('mongodb').objectId;

require('dotenv').config();

const app = express();
const port = process.env.PORT ||5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qmy49.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

async function run(){

    try {

        await client.connect();
        console.log('connected to MongoDB');
        const database = client.db('geniusMechanic');
        const servicesCollection = database.collection('Services');

        //get api
        app.get('/services', async (req,res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //get single services

        app.get('/services/:id', async (req,res) => {

            const id = req.params.id;
            const query = {_id: objectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })

        //post api
        app.post('/services', async (req, res) => {

            
            const service = req.body;
            //console.log('hit the service', service);
              const result = await servicesCollection.insertOne(service);
              console.log(result);

             //console.log(err);
            
            res.json(result);
            console.log('Running successfully',service);
            res.send('running service successfully')
        })

    }

    // catch (err){
    //     console.log(err);
    // }
    finally {
        //await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running genius car mechanic server');
});

app.listen(port, (req, res) =>{

    console.log('Running server at port ' + port);
})