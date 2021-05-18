# Chạy blockchain
cd blockchain
npm install
npm start
 --> Socket server listen tại port 8000

# Chạy ví
*Cần config SERVER_IP để socket client kết nối: vào file mywallet/src/config.js để sửa SERVER_IP thành IP tương ứng của máy chạy blockchain*
*Ví cần được chạy trên máy cùng mạng LAN với máy chạy blockchain*
cd mywallet
npm install
npm start
 Giao diện ví chạy tại http://localhost:3002/