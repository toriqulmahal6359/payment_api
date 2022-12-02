const express = require('express');
const app = express();

const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const SslCommerzPayment = require('sslcommerz-lts');

dotenv.config();
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());

app.get("/", async(req, res) => {
    return res.status(200).json({
        message: "WELCOME TO SSLCOMMERZ INTEGRATION APP",
        url: `${process.env.ROOT}/payment_request`
    });
});

//sslcommerz api
app.get('/payment_request', async(req, res) => {
    const data = {
        total_amount: 100,
        currency: 'BDT',
        tran_id: 'REF123',
        success_url: `${process.env.ROOT}/success_page`,
        fail_url: `${process.env.ROOT}/fail_request`,
        cancel_url: `${process.env.ROOT}/cancel_request`,
        ipn_url: `${process.env.ROOT}/notification`,
        shipping_method: 'No',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: 'cust@yahoo.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1216',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
        multi_card_name: 'mastercard',
        value_a: 'ref001_A',
        value_b: 'ref002_B',
        value_c: 'ref003_C',
        value_d: 'ref004_D'
    };
    const sslcommer = new SslCommerzPayment(process.env.STORE_ID, process.env.STORE_PASSWORD, false) //true for live default false for sandbox
    sslcommer.init(data).then(data => {
        //process the response that got from sslcommerz 
        //https://developer.sslcommerz.com/doc/v4/#returned-parameters
        console.log("data", data);
        if(data?.GatewayPageURL){
            return res.status(200).redirect(data?.GatewayPageURL);
        }else{
            return res.status(400).json({
                message: "Session was not Successful",
            })
        }
    });
});

app.post('/notification', async(req, res) => {
    return res.status(200).json({
        data: req.body,
        message: "Here goes Payment Notification"
    });
});

app.post('/success_page', async(req, res) => {
    return res.status(200).json({
        data: req.body,
        message: "Payment is done Successfully"
    });
});
app.post('/fail_request', async(req, res) => {
    return res.status(200).json({
        data: req.body,
        message: "Payment has been Failed"
    });
});
app.post('/cancel_request', async(req, res) => {
    return res.status(200).json({
        data: req.body,
        message: "Payment has been Cancelled"
    });
});


const PORT = process.env.PORT || 80;
const server = app.listen(PORT, ()=> {
    console.log(`Server is running at ${PORT}`);
});
