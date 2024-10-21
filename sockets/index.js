const { Server } = require('socket.io');

// Initialize Socket.IO server on port 8900 with CORS enabled for localhost:3000
const io = new Server(8900, {
    cors: {
        origin: "http://localhost:3000", // Allows connections from this origin
    },
});

let users = [];

// Function to add a user to the users array
const addUser = (userId, socketId) => {
    console.log("addUserId", userId);
    console.log("addSocketId", socketId);
    const existingUser = users.find((user) => user.userId === userId);
    if (existingUser) {
        // Update socketId if the user reconnects
        existingUser.socketId = socketId;
    } else {
        users.push({ userId, socketId });
    }
};

// Function to remove a user from the users array
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

// Function to get a user by userId
const getUser = (userId) => {
    console.log("userId", userId);
    return users.find((user) => user.userId === userId);
};

// Emit user status update to all clients
const emitUserStatus = () => {
    io.emit("getUsers", users);
};

// Event listener for new connections
io.on('connection', (socket) => {
    console.log("A user connected:", socket.id);

    // Add user to the users array when they join
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        emitUserStatus(); 
    });

    // Listen for 'sendMessage' and emit the message to the receiver
    socket.on("sendMessage", ({ conversationId, sender, text, receiverId, type, subtype }) => {
        const message = { conversationId, sender, text, type, subtype };
    
        // Find receiver by ID
        const receiver = getUser(receiverId);
        console.log("receiverId", receiverId, "receiverSocketId", receiver?.socketId);
    
        if (receiver) {
            io.to(receiver.socketId).emit("getMessage", message);
        } else {
            console.log("Receiver not connected");
        }
    });

    // Handle logout event (Don't disconnect the socket)
    socket.on("logout", () => {
        console.log("User logged out:", socket.id);

        // Remove the user from the users array
        removeUser(socket.id);

        // Emit updated user status to all clients
        emitUserStatus();

        // You don't need to call socket.disconnect() here
    });

    // Handle the disconnect event when it happens
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        removeUser(socket.id);
        emitUserStatus(); // Update the users list after disconnection
    });
});
