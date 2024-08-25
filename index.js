const express = require("express")
const http = require('http');
const path = require('path');
const { Server } = require('socket.io')
const dotenv = require('dotenv');
dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {
    console.log("A user connected with id: ", socket.id)
    socket.on('user-message', (message) => {
        socket.broadcast.emit('bot-message', {msg: message.msg, id: message.id, image: message.image});
    })
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
})

app.use(express.static(path.join(__dirname, '/public')))
app.get("/", (req, res) => {
    return res.sendFile('index.html')
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`)
})