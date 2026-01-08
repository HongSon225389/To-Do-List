const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
//import kết nối database
const connectDB = require("./src/config/db");
//import route task
const taskRoutes = require("./src/routes/taskRoutes");

const app = express();
//goi ham ket noi database
connectDB();

//middleware
app.use(cors());

//body parser
app.use(express.json());

app.use("/api/tasks", taskRoutes);
//routes test thu
app.get("/", (req, res) => {
  res.send("API is running....");
});
//lang nghe cong
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
