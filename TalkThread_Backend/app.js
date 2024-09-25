const express = require("express");
const cors = require("cors");
const  route  = require("./routes/routes");
const connection = require("./database/database");
const app = express();

const PORT = 5000;
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Replace with the origin of your frontend app
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));
// app.get('/',(req,res)=>{
//   res.send("Home");
// })
app.use("/sign",route);
app.listen(PORT,()=>{
  console.log("Server listening to the port:",PORT);
})
