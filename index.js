import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {Server} from "socket.io";
import {createServer} from "node:http";
import Log from "./schema/schema.logs.js"
import User from "./schema/schema.user.js"
import bcrypt from 'bcrypt';


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

//endpoints
app.get('/', (req, res) => {
    res.render('home.ejs');
});
app.get('/chat', (req, res) => {
    res.render('chat.ejs');
});
app.get('/profile', (req, res) =>{
    res.render('profile.ejs');
})
app.get('/login', (req, res) =>{
    res.render('login.ejs');
})
app.get('/signup', (req, res) =>{
    res.render('signup.ejs');
})

app.get('/messages', async(req, res) =>{
    try {
    }
    catch(err)
    {
        console.error("Error fetching messages", err);
        res.status(500).send("Error fetching messages");
    }
})

app.post('/login', async(req, res)=>{
    const {username, password}= req.body;
    try{
        const check= await User.findOne({username});
        if(check){
            const match= await bcrypt.compare(password, check.passwordHash);
            if(match)
            {
                res.render("home.ejs");
            }
            else{
                return res.status(401).send("Invalid credentials");
            }
        }
        else{
            return res.status(401).send("Invalid credentials");
        }
    }
    catch(err){
        console.error("Login failed");
        console.log(req.body.name, req.body.password);
    }
})
app.post('/signup', async(req, res)=>{
    const {username, password}= req.body;

    if(!username || !password){
        return res.status(400).send("username and password required");
    }

    try{
        const existingUser= await User.findOne({username});
        if(existingUser){
            return res.status(400).send("User already exists");
        }
        const saltR= 10;
        const passwordHash= await bcrypt.hash(password, saltR);

        const newUser= new User({
            username,
            passwordHash
        })

        await newUser.save();
        res.render('login.ejs');
    }
    catch(err)
    {
        console.error("Error during signup", err);
        res.status(500).send("Internal server error");
    }
})

//socket.io
io.on('connection', (socket) =>{
    const userId = "";
    console.log('a user connected', userId);

    socket.on('chat message', async (msg) => {
        try{
            const log= new Log({
                message: msg,
                sender: userId
            });
            await log.save();
            io.emit('chat message', msg);
            console.log(msg);
        }
        catch(err)
        {
            console.error('Error saving message', err)
            io.emit('Error saving message', err);
        }

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
