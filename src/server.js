const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
require('dotenv').config();
require('./config/db');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", //cho phep ket noi tu moi nguon
        methods: ["GET", "POST"]
    }
});

let onlineUsers = [];
const addUser = (userId, socketId) => {
    !onlineUsers.some(user => user.userId === userId) && onlineUsers.push({ userId, socketId });
};
const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
};
const getUser = (userId) => {
    return onlineUsers.find(user => user.userId === userId);
};

//lang nghe ket noi
io.on('connection', (socket) => {
    console.log(`Một người dùng đã kết nối: ${socket.id}`);

    socket.on('addUser', (userId) => {
        addUser(userId, socket.id);
        io.emit('getUsers', onlineUsers);
    })

    socket.on('disconnect', () => {
        console.log(`Người dùng đã ngắt kết nối: ${socket.id}`);
        removeUser(socket.id);
        io.emit('getUsers', onlineUsers);
    });
});

app.set('socketio', io);
app.set('getUser', getUser);

app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
