const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const router = require("./router");
const { addUser, removeUser, getUser, checkuserexists } = require("./users");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const PORT = process.env.port || 5000;

app.use(router);
io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`); // x8WIv7-mJelg7on_ALbx
  socket.on("connect", () => {
    console.log(socket.connected); // true
  });
  socket.on("checkuser", ({ name, room }, callback) => {
    const existeduser = checkuserexists({ name, room });
    return callback(existeduser);
  });
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) console.log(error);
    if (error) return callback(error);

    console.log("===============");
    console.log(user);
    console.log("===============");

    socket.join(user.room);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to room ${user.room}.`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });
  });
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", { user: user.name, text: message });
    callback();
  });
  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`);
    removeUser(socket.id);
  });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
