const {Server} = require("socket.io");
const Blockchain = require("../src/blockchain");
const Block = require("../src/block");
const Transaction = require("../src/transaction");
const server = new Server(8000, { cors: {
    origin: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
  });

const mycoin = new Blockchain()

// event fired every time a new client connects:
server.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);

    socket.on("local_data", (local_data) => {
        //console.info(`Client local data: ${JSON.stringify(local_data)}`);
        console.info(`Local chain: ${local_data["blockchain"]}`)
        console.info(`Local pending transactions: ${local_data.pendingTransactions}`)
        client_blockchain = new Blockchain()
        // read chain from data
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
        if (client_blockchain.isChainValid() && client_blockchain.chain.length > mycoin.chain.length) {
            console.log(`Update network data from new connection local data`);
            mycoin.chain = client_blockchain.chain;
            mycoin.pendingTransactions = client_blockchain.pendingTransactions;
        }

        return_object = {
            blockchain: mycoin.chain,
            pendingTransactions: mycoin.pendingTransactions
        }

        console.log(JSON.stringify(return_object))

        socket.emit("sync_data", return_object);        
    })

    socket.on("getAmount", (data) => {
        console.log("GET AMOUNT");
        console.log(mycoin);
        address = data["address"];
        socketId = data["socketId"];
        console.log(`Socket id: ${socketId}`);
        socket.socket(socketId).emit("getAmount", mycoin.getBalanceOfAddress(address));
    });

    // when socket disconnects, remove it from the list:
    socket.on("disconnect", () => {
        console.info(`Client gone [id=${socket.id}]`);
    });
});