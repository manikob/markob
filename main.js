var srv = require("./server/tcpServer");

console.log("Assigned PORT: " + process.env.PORT);


srv.create(process.env.PORT);