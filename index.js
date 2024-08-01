import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {Server} from "socket.io";
import {createServer} from "node:http";

const app= express();
const server=createServer(app);
const port= 3500;
const __dirname = dirname(fileURLToPath(import.meta.url));
const io= new Server(server, {
    connectionStateRecovery: {}
})

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/chat', (req, res) => {
    res.render('chat.ejs');
});

io.on('connection', (socket) =>{
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        console.log(msg);
    })
})

// Database connection and server start
mongoose.connect('mongodb+srv://harshpandeykp20:1iCWuRQQcHdtTr5t@termchat-db.fz8kgsi.mongodb.net/termchat?retryWrites=true&w=majority&appName=termchat-db')
    .then(() => {
        console.log("Connected to MongoDB!");
        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB:", err);
    });
