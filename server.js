const express = require('express');
var cors = require('cors');
const stripe = require('stripe')('sk_test_51MExEhJ14zYkJD13ylwwqEKz0iDtXqtbvRRceQWngpeiSdzFm1cIHpBLfBJJZd8aqPyaW96FUPzPPwzeSy23oOyx00EoM0S86q')

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
const port = process.env.PORT || 4000

app.post("/checkout", async (req, res)=>{

    const items = req.body.items;

    let lineItems = [];

    items.forEach((item)=>{
        //construct payload for Stripe;
        lineItems.push({
            price: item.id,
            quantity: item.quantity
        })
    })

    //makes connection with stripe
    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url:"http://localhost:3000/success",
        cancel_url:"http://localhost:3000/cancel"

    })

    //sends url for checkout
    res.send(JSON.stringify({
        url: session.url
    }))
})

//start server
app.listen(port, ()=>console.log('Listening on 4000'))