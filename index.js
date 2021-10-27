const express = require('express');
require('dotenv').config()
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const { ObjectID } = require('bson');


const app = express();
const port = process.env.PORT || 5000;

// midle were

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tul8s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
try{
    await client.connect()
    console.log('mongo connected')
    const database = client.db("carMechanics");
    const servicesCollection = database.collection("services");

    app.get('/services',async(req,res)=>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray()
        res.send(services)
    })

    app.get('/services/:id', async(req,res)=>{
        const id =req.params.id 
        console.log('geting id', id)
        const query = {_id:ObjectID(id)}
        const service = await  servicesCollection.findOne(query)
        res.json(service)
    })
    
    app.post('/services', async(req,res)=>{
        const service = req.body
        console.log("post api", service);
        const result = await servicesCollection.insertOne(service)
        // res.json(result)
    })

    // delete service
    app.delete('/services/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectID(id)};
        const result = await servicesCollection.deleteOne(query)
        res.json(result)
    })

}
finally{
    // await client.close()
}
}

run().catch(console.dir)

app.get('/', (req, res)=>{
    res.send('car mechanics runnnig')
})

app.listen(port,()=>{
    console.log('car mechanics running to port', port);
})