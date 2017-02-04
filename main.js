var srv = require("./server/tcpServer");
console.log(process.env.PORT);

srv.create(process.env.PORT);