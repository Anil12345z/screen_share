const { Server } = require("socket.io");

const io = new Server(8008, {
  cors: {
    origin: ["https://client-8ktt.onrender.com"],
    methods: ["GET", "POST"],
  },
});

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected:`, socket.id);

  // Handle room join
  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  // Handle user call
  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });

  // Handle call acceptance
  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  // Handle peer negotiation
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

  // Handle user leaving the room
  socket.on("user:left", (data) => {
    const email = socketidToEmailMap.get(socket.id);
    if (email) {
      console.log(`User ${email} has left the meeting.`);
      emailToSocketIdMap.delete(email);
      socketidToEmailMap.delete(socket.id);

      const { room } = data;
      socket.leave(room);
      io.to(room).emit("user:left", { email, id: socket.id });
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    const email = socketidToEmailMap.get(socket.id);
    if (email) {
      emailToSocketIdMap.delete(email);
      socketidToEmailMap.delete(socket.id);
      console.log(`User with email ${email} disconnected.`);
    }
  });
});
