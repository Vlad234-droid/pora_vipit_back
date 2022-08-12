const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const bodyParser = require("body-parser");
const socket = require("socket.io");

const app = express();
require("dotenv").config();
app.use(bodyParser.json({ limit: "50mb" }));

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api", messageRoute);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://vados:${process.env.MONGO_PASSWORD}@cluster0.e00v3.mongodb.net/?retryWrites=true&w=majority`
    );
    const server = app.listen(process.env.PORT || 5001, () =>
      console.log(`Server Started on Port ${process.env.PORT}`)
    );

    const io = socket(server, {
      cors: {
        origin: "http://localhost:3000",
        credentials: true,
      },
    });

    global.onlineUsers = new Map();

    io.on("connection", (socket) => {
      global.chatSocket = socket;
      socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
      });
      socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("msg-receive", data.message);
        }
      });
    });
  } catch (e) {
    console.log(e);
  }
};
start();
