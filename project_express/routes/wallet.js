var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017";
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// create new wallet
router.get('/create', function(req, res, next) {
    const key = ec.genKeyPair();
    const privateKey = key.getPrivate('hex');
    const amount = 0;
    console.log(`Private key: ${privateKey}; Amount: ${amount}`);
    const myobj = {privateKey: privateKey, amount: amount};
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        if (err) return console.log(err)
        db = client.db("mycoin");
        console.log(`Connected MongoDB: ${url}`);
        db.collection('user').insertOne(myobj, function(err, result) {
            if (err) throw err;
            res.json({
                status: 200,
                result: result["ops"],
                message: "Add wallet successfully"
                })
                console.log(result);
                client.close();
        })
    });
  });

//get all wallet
router.get('/', function(req, res, next) {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
      if (err) return console.log(err)
      db = client.db("mycoin");
      console.log(`Connected MongoDB: ${url}`);
      db.collection('user').find().toArray(function (err, result) {
        if (err) throw err
        res.json({
          status: 200,
          result,
          message: "User lists successfully"
        })
        console.log(result);
        client.close();
      })
    });
  });

  
//get wallet filter by private key
router.get('/:privateKey', function(req, res, next) {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
      if (err) return console.log(err)
      db = client.db("mycoin");
      console.log(`Connected MongoDB: ${url}`);
      db.collection('user').find({"privateKey": req.params.privateKey}).toArray(function (err, result) {
        if (err) throw err
        res.json({
          status: 200,
          result,
          message: "User lists successfully"
        })
        console.log(result);
        client.close();
      })
    });
  });

// update amount of wallet
router.put('/:privateKey', function(req, res, next) {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
      if (err) return console.log(err)
    
      db = client.db("mycoin");
      console.log(`Connected MongoDB: ${url}`);
      db.collection('user').updateOne(
        {privateKey: req.params.privateKey},
        { $set: req.body },
      { upsert: true },
        function (err, result) {
        if (err) throw err
        res.json({
          status: 200,
          result,
          message: "Update wallet successfully"
        })
        client.close();
      })
    });
  });

module.exports = router;