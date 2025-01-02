const { Server } = require("socket.io");
const http = require("http");

// Create an HTTP server
const app = http.createServer();
const io = new Server(app, {
  cors: {
    origin: "*", // You can specify your front-end domain here instead of "*"
  },
});

// Listen on port 8008 for HTTP connections
app.listen(8008, () => {
  console.log("Server listening on port 8008 (HTTP)");
});

// Store mappings for email and socket IDs
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

// WebSocket event handling
io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);

  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  // Handle chat messages
  socket.on("message:send", ({ to, message }) => {
    console.log(`Message from ${socket.id} to ${to}: ${message}`);
    io.to(to).emit("message:received", { from: socket.id, message });
  });

  socket.on("disconnect", () => {
    const email = socketidToEmailMap.get(socket.id);
    if (email) {
      emailToSocketIdMap.delete(email);
      socketidToEmailMap.delete(socket.id);
      console.log(`User with email ${email} disconnected.`);
    }
  });
});
