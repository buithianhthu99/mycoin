const {Server} = require("socket.io");
const Blockchain = require("../src/blockchain");
const server = new Server(8000, { cors: {
    origin: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
  });

const data = new Blockchain()

// event fired every time a new client connects:
server.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);

    socket.on("address", (address) => {
        console.info(`Client address: ${address}`);
    })

    socket.on("change_data", (data) => {
        console.info(`Change data: ${data}`);
    })

    socket.on("local_data", (local_data) => {
        console.info(`Client local data: ${local_data}`);
        data_object = JSON.parse(local_data)
        client_blockchain = new Blockchain()
        client_blockchain.chain = data_object["blockchain"]
        client_blockchain.pendingTransactions = data_object["pendingTransactions"]
        if (client_blockchain.isChainValid() && client_blockchain.chain.length > data.chain.length) {
            data.chain = client_blockchain.chain;
            data.pendingTransactions = client_blockchain.pendingTransactions;
        }
        return_object = {
            blockchain: data.chain,
            pendingTransactions: data.pendingTransactions
        }

        console.log(JSON.stringify(return_object))

        socket.emit("sync_data", JSON.stringify(return_object));        
    })

    // when socket disconnects, remove it from the list:
    socket.on("disconnect", () => {
        console.info(`Client gone [id=${socket.id}]`);
    });
});