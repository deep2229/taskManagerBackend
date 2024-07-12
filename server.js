const express = require('express');
const app = express();
const http = require('http'); // Include 'http' module
const cors = require('cors');
const { Server } = require('socket.io'); // Include Server from 'socket.io'
const { createBlog, findAllBlog, findOneBlog, updateBlog, removeBlog } = require("./app/controllers/blog.controller");

app.use(cors());

const server = http.createServer(app); // Create HTTP server

// Create Socket.IO server and allow CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// Socket.IO connection listener
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Socket event listeners
  socket.on("todo:create", (data) => createBlog(data, socket));
  socket.on("todo:edit", (data) => updateBlog(data, socket));
  socket.on("todo:delete", (data) => removeBlog(data, socket));
  socket.on("todo:list", () => findAllBlog(socket)); 
});

server.listen(4000, () => {
  console.log('Server is running on port 4000'); // Return a message indicating server is running
});