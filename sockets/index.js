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

// Event listener for new connections
io.on('connection', (socket) => {
    console.log("A user connected:", socket.id);

    // Add user to the users array when they join
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users); // Send the updated users list to all clients
    });

    // Listen for 'sendMessage' and emit the message to the receiver
    socket.on("sendMessage", ({ conversationId, sender, text, receiverId, type, subtype }) => {
        const message = { conversationId, sender, text, type, subtype };

        // Get receiver's socket
        const receiver = getUser(receiverId);
        console.log("receiverId", receiver);

        // Check if receiver exists and is connected
        if (receiver) {
            io.to(receiver.socketId).emit("getMessage", message); // Send message to the receiver
        } else {
            console.log("Receiver not connected");
        }

        // Optionally, remove this section if you don't want to send the message back to the sender
        // io.to(socket.id).emit("getMessage", message); 
    });

    // Event listener for disconnects
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        removeUser(socket.id); // Remove the disconnected user
        io.emit("getUsers", users); // Send updated user list to all clients
    });
});
