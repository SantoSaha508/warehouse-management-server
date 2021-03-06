const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// midlleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0yxmc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect()
        const productCollection = client.db('dressHouse').collection('products');
        const supplierInfo = client.db('suppliers').collection('info');

        app.get('/product', async(req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/product/:id', async (req, res) => {
            // console.log(req.params);
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query)
            res.send(product)
        });

        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updateproduct = req.body;
            // console.log( req.body);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updateproduct.quantity,
                    // name: updateproduct.name,
                    // price: updateproduct.price,
                    // email:updateproduct.email,
                    // img: updateproduct.img,
                    // description: updateproduct.description,
                    // supplier: updateproduct.supplier

                }
            };
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });

        // post 
        app.post('/product', async(req, res) =>{
            const newProduct = req.body;
            console.log('adding new user', newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result)
        });

        // delete
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })


    }
    finally{

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('warehouse is running');
})

app.listen(port, () => {
    console.log('running on port', port);
})
