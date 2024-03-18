//server.js
var express = require('express');
const dotenv = require('dotenv');
const { privateEncrypt, createPrivateKey } = require('crypto');
dotenv.config();

var app = express();
app.use(express.json());

app.use((req, res, next) => { 
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Content-Length, X-Requested-With, Accept, platform-tenantid');
    next(); 
}); 

// Callback for Batch and Vouchers
app.post('/callback/vouchers', (req, res) => {
    console.log(req.body);
    res.json({}); 
});

app.post('/callback/batches', (req, res) => {
    console.log(req.body);
    res.json({}); 
});

// Signature 
app.post('/api/sign', (req, res) => {
    console.log(req.body);
    const rsaPrivateKey = createPrivateKey({
        key: Buffer.from(process.env.PH_OPS_BATCH_KEY, 'base64'),
        format: "der",
        type: 'pkcs1',
    })
    const encrypted = privateEncrypt(rsaPrivateKey, req.body.hash);
    console.log(encrypted.toString('base64'));
    res.json({ signature:  encrypted.toString('base64') }); 
});

// HealthCheck
app.get('/', function(req, res) {
    res.send('Hi!');
});


app.listen(process.env.NODE_PORT, function() {
    console.log("Backend Application listening at port: " + process.env.NODE_PORT)
});
