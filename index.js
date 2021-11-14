const express = require('express')
const app = express()

const cors = require('cors');
require('dotenv').config();

const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mbkcs.mongodb.net/time-sheriff?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

async function run() {
    try {
        await client.connect();
        console.log('Database connected sucsessfully');

        const database = client.db('time-sheriff');//database name
        const productCollection = database.collection('products');//database collection name
        const shipmentCollection = database.collection('purchese');//shipment
        const reviewCollection = database.collection('reviews');//user reviews


         //get all data
         app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        
        //insert data
        app.post('/addProduct', async (req, res) => {
            const product = req.body;
            // console.log(product);
            const result = await productCollection.insertOne(product);
            res.json(result)
        });


        

        //purchese item insert
        app.post('/purchese', async (req, res) => {
            const purchese = req.body;
            console.log(purchese);
            const result = await shipmentCollection.insertOne(purchese);
            res.json(result)
        });

        //get all purchesedata
         app.get('/purchesedata', async (req, res) => {
            const cursor = shipmentCollection.find({});
            const purchese = await cursor.toArray();
            res.send(purchese);
        })

        //insert review
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result)
        });

         //get all reviews
         app.get('/reviewsdata', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });


    }

    finally {
        //   await client.close();
    }


}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello from Time Sheriff!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})