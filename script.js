require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const ejs = require('ejs');
const session = require('express-session');
const app = express();
const port = process.env.PORT;
const path = require('path');

app.set('view engine', 'ejs');

const Payment = require('./public/paymentModel');


mongoose.connect('mongodb+srv://administrator:admin123@cluster0.duuu1iz.mongodb.net/?retryWrites=true&w=majority').then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    });
    
    
}).catch((error) => {
    console.log(error.message);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


async function getPayment(){
    const Payments = await Payment.find({});
    return Payments;
    
}

app.get('/payments', (req, res) => {

    getPayment().then(function (payments){
        res.render('index',{
            paymentList: payments
        })
    })
});

app.use(express.static(__dirname));


app.use(express.static("public"));

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname + '/index.html'));

});

const generateToken = async( req, res, next) => {
    const secret = process.env.CONSUMERSECRET;
    const consumer = process.env.CONSUMERKEY;
    const auth = new Buffer.from(`${consumer}:${secret}`).toString('base64');

    await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
        headers: {
            authorization: `Basic ${auth}`,
        }
    }).then((data) => {
        token = data.data.access_token;
        console.log(data.data);
        next();
    }).catch((error) => {
        console.log(error);
        
    })
} 

app.post('/stkPush', generateToken,  async( req, res) => {
    const phone = req.body.phone.substring(1);
    const amount = req.body.amount;
    const date = new Date();
    const timestamp = 
            date.getFullYear() +
            ("0" + (date.getMonth() + 1)).slice(-2) +
                ("0" + date.getDate()).slice(-2) +
                ("0" + date.getHours()).slice(-2) +
                ("0" + date.getMinutes()).slice(-2) +
                ("0" + date.getSeconds()).slice(-2);
    const shortCode = process.env.SHORTCODE;
    const passKey = process.env.PASSKEY;
    const password = new Buffer.from(shortCode + passKey + timestamp).toString('base64');
         
        await axios.post(
           " https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            {
                    
                BusinessShortCode: shortCode,    
                Password: password,    
                Timestamp: timestamp,    
                TransactionType: "CustomerPayBillOnline",    
                Amount: amount,   
                PartyA: `254${phone}`,    
                PartyB: shortCode,    
                PhoneNumber: `254${phone}`,    
                CallBackURL:"https://silent-mouse-67.telebit.io/callback",   
                AccountReference:"Test",    
                TransactionDesc:"Test"
            },
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        ).then((data) => {
            console.log(data.data);
            res.status(200).json(data.data);

        }).catch((error) => {
            console.log(error);
            res.status(400).json(error.message);
        });
});

app.post("/callback", (req, res) => {
    const callbackData = req.body;
    console.log(callbackData.Body);
    if(!callbackData.Body.stkCallback.CallbackMetadata){
        console.log(callbackData.Body);
        return res.json("ok");      
    }

    console.log(callbackData.Body.stkCallback.CallbackMetadata);
    const phone = callbackData.Body.stkCallback.CallbackMetadata.Item[4].Value;
    const amount = callbackData.Body.stkCallback.CallbackMetadata.Item[0].Value;
    const trnx_id = callbackData.Body.stkCallback.CallbackMetadata.Item[1].Value; 
    const timestamp = callbackData.Body.stkCallback.CallbackMetadata.Item[3].Value;

    console.log({phone, amount, trnx_id, timestamp});

    const payment = new Payment({
        number: phone,
        amount: amount,
        trnx_id: trnx_id,        
    });

    payment.save().then((data) => {
        console.log(data);
        res.status(200).json({message: "Payment successful", data});
    }
    ).catch((error) => {
        console.log(error);
        res.status(400).json(error.message);
    }
    );

})








