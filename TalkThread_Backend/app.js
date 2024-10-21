const express = require("express");
const cors = require("cors");
const route = require("./routes/routes");
const connection = require("./database/database");
const BlockedRoute = require("./routes/BlockedRoutes");
const CreateProfile = require("./Multer/multer");
const path = require('path');

const app = express();

const PORT = 5000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use("/sign", route);
app.use("/", BlockedRoute);
app.use("/CreateProfile", CreateProfile); // Use the correct CreateProfile router

app.use('/images', express.static("uploads"));


app.listen(PORT, () => {
  console.log("Server listening to the port:", PORT);
});