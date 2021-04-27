const Blockchain = require('./blockchain');
const Block = require('./block');
const Transaction = require('./transaction');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('fe8fc36eb4e4098b8aed9ab8078e28258a43c66d74b0b973c38d1a99f2b63e75');
const myWalletAddress = myKey.getPublic('hex');

let mycoin = new Blockchain()
const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
mycoin.addTransaction(tx1);

console.log('\n Starting the miner...');
mycoin.minePendingTransactions(myWalletAddress);

console.log('\nBalance of mine is', mycoin.getBalanceOfAddress(myWalletAddress))
