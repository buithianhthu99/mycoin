const {Server} = require("socket.io");
const Blockchain = require("../src/blockchain");
const Block = require("../src/block");
const Transaction = require("../src/transaction");
const fs = require('fs');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

/*
Code use to get or create data
Socket server be also a node in network -> get local data of this node not by reading file './data.json'
If file not existed, create new blockchain and create a file to save local data
*/
let mycoin = new Blockchain()
const path = './data.json'
try {
    if (fs.existsSync(path)) {
        try {
            const data = fs.readFileSync(path, "utf8")
            const myObject = JSON.parse(data)
            console.log(JSON.stringify(myObject))
            chain = []
            for (let i=0; i<myObject["blockchain"].length; i++) {
                // create transaction
                current_block  = myObject["blockchain"][i]
                transaction = []
                for (let j=0; j<current_block["transactions"].length; j++) {
                    current_transaction = current_block["transactions"][j]
                    new_transaction = new Transaction(current_transaction["fromAddress"], current_transaction["toAddress"], current_transaction["amount"])
                    new_transaction["timestamp"] = current_transaction["timestamp"]
                    new_transaction["signature"] = current_transaction["signature"]
                    
                    transaction.push(new_transaction)
                }
                
                block = new Block(current_block["timestamp"], transaction)
                block["previousHash"] = current_block["previousHash"]
                block["hash"] = current_block["hash"]
                block["nonce"] = current_block["nonce"]
                chain.push(block)
            }
            mycoin.chain = chain

            pendingtransaction = []
            for (let i=0; i<myObject["pendingTransactions"].length; i++) {
                current_pending_transaction = myObject["pendingTransactions"][i]
                pendingtransaction.push(new Transaction(current_pending_transaction["fromAddress"], current_pending_transaction["toAddress"], current_pending_transaction["amount"]))
            }
            mycoin.pendingTransactions = pendingtransaction

        } catch (err) {
            console.error(err)
        }
    }
    else {
        const myObject = {
            blockchain: mycoin.chain,
            pendingTransactions: mycoin.pendingTransactions
          }
        fs.writeFile(path, JSON.stringify(myObject), function (err) {
            if (err) return console.log(err);
            console.log(JSON.stringify(myObject))
          });
    }
} catch(err) {
    console.error(err)
}

//Create socket server listen at port 8000
const server = new Server(8000, { cors: {
    origin: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
  });

// Event fired every time a new client connects:
server.on("connection", (socket) => {
    socket.on("log_connect", () => {
        console.info(`Client connected [id=${socket.id}]`);
    });

    /* Process when a new node connect and send local data
    Check if blockchain valid and have longer length -> Broadcast to all nodes in network for update local data
    Else, send current data to that node 
    */
    socket.on("local_data", (local_data) => {
        // console.info(`Client local data: ${JSON.stringify(local_data)}`);
        // console.info(`Local chain: ${local_data["blockchain"]}`)
        // console.info(`Local pending transactions: ${local_data.pendingTransactions}`)
        client_blockchain = new Blockchain()
        // Read chain from data
        chain = []
        for (let i=0; i<local_data["blockchain"].length; i++) {
            // create transaction
            current_block  = local_data["blockchain"][i]
            transaction = []
            for (let j=0; j<current_block["transactions"].length; j++) {
                current_transaction = current_block["transactions"][j]
                new_transaction = new Transaction(current_transaction["fromAddress"], current_transaction["toAddress"], current_transaction["amount"])
                new_transaction["timestamp"] = current_transaction["timestamp"]
                new_transaction["signature"] = current_transaction["signature"]
                
                transaction.push(new_transaction)
            }
            
            block = new Block(current_block["timestamp"], transaction)
            block["previousHash"] = current_block["previousHash"]
            block["hash"] = current_block["hash"]
            block["nonce"] = current_block["nonce"]
            chain.push(block)
        }
        client_blockchain.chain = chain

        pendingtransaction = []
        for (let i=0; i<local_data["pendingTransactions"].length; i++) {
            current_pending_transaction = local_data["pendingTransactions"][i]
            pendingtransaction.push(new Transaction(current_pending_transaction["fromAddress"], current_pending_transaction["toAddress"], current_pending_transaction["amount"]))
        }
        client_blockchain.pendingTransactions = pendingtransaction

        console.log(`Check blockchain valid: ${client_blockchain.isChainValid()}`)
        console.log(`Check if have longer length: ${client_blockchain.chain.length > mycoin.chain.length}`)
        if (client_blockchain.isChainValid() && client_blockchain.chain.length > mycoin.chain.length) {
            console.log(`Update network data from new connection local data`);
            mycoin.chain = client_blockchain.chain;
            mycoin.pendingTransactions = client_blockchain.pendingTransactions;
        }
        else {
            console.log(`Update new connection local data from network data`);
        }

        return_object = {
            blockchain: mycoin.chain,
            pendingTransactions: mycoin.pendingTransactions
        }

        fs.writeFile(path, JSON.stringify(return_object), function (err) {
            if (err) return console.log(err);
          });

        console.log(`Data: ${JSON.stringify(return_object)}`)

        socket.emit("sync_data", return_object);        
    })

    // Process to return amount of a address
    socket.on("getAmount", (data) => {
        address = data["address"];
        socketId = data["socketId"];
        res = mycoin.getBalanceOfAddress(address);
        server.to(socketId).emit("getAmount", `${res}`);
    });

    socket.on("add_PT", (data) => {
        fromAddress = data["fromAddress"];
        toAddress = data["toAddress"];
        amount = data["amount"];
        myKey = ec.keyFromPrivate(data["privateKey"]);
        const tx = new Transaction(fromAddress, toAddress, parseInt(amount));
        tx.signTransaction(myKey);
        mycoin.addTransaction(tx);

        console.log("Add new pending transaction successfully");
        return_object = {
            blockchain: mycoin.chain,
            pendingTransactions: mycoin.pendingTransactions
        }

        fs.writeFile(path, JSON.stringify(return_object), function (err) {
            if (err) return console.log(err);
          });

        console.log(`Data: ${JSON.stringify(return_object)}`)

        socket.emit("sync_data", return_object);        
    })

    socket.on("mine", (data) => {
        const temp = new Blockchain();
        temp.chain = mycoin.chain;
        temp.pendingTransactions = mycoin.pendingTransactions;
        // if mine success
        if (temp.minePendingTransactions(data["address"])) {
            mycoin.chain = temp.chain;
            mycoin.pendingTransactions = temp.pendingTransactions;
            server.to(data["socket_id"]).emit("mine_success", mycoin.miningReward);
            
            return_object = {
                blockchain: mycoin.chain,
                pendingTransactions: mycoin.pendingTransactions
            }
    
            fs.writeFile(path, JSON.stringify(return_object), function (err) {
                if (err) return console.log(err);
              });
    
            console.log(`Data: ${JSON.stringify(return_object)}`)
    
            socket.emit("sync_data", return_object); 
        }
    })

    socket.on("get_all_blocks", () => {
        socket.emit("blocks", {result: mycoin.getAllBlocks()});
    });

    socket.on("get_all_transactions", () => {
        socket.emit("transactions", {result: mycoin.getAllTransactions()});
    });

    socket.on("get_my_transactions", (data) => {
        socket.emit("transactions", {result: mycoin.getAllTransactionsForWallet(data)});
    });

    socket.on("log_disconnect", () => {
        console.info(`Client gone [id=${socket.id}]`);
    });

    // when socket disconnects, remove it from the list:
    socket.on("disconnect", () => {

    });
});