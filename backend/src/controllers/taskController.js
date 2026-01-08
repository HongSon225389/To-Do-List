//Mục Đích: Xử lý các yêu cầu liên quan đến Task

// Đường dẫn: src/controllers/taskController.js
const Task = require("../models/Task");

// 1. Lấy toàn bộ danh sách Task
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 }); // Mới nhất lên đầu
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Tạo Task mới
exports.createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 3. Cập nhật Task (Đổi tên hoặc đánh dấu hoàn thành)
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 4. Xóa Task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
