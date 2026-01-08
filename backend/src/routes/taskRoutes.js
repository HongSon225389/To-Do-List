//Mục Đích: Định nghĩa các đường dẫn API liên quan đến Task

// Đường dẫn: src/routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Định nghĩa các đường dẫn
router.get("/", taskController.getTasks); // GET localhost:5000/api/tasks
router.post("/", taskController.createTask); // POST localhost:5000/api/tasks
router.put("/:id", taskController.updateTask); // PUT localhost:5000/api/tasks/:id
router.delete("/:id", taskController.deleteTask); // DELETE localhost:5000/api/tasks/:id

module.exports = router;
