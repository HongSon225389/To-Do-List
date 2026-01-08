// Mục Đích: Định nghĩa mô hình dữ liệu cho Task trong MongoDB

// Đường dẫn: src/models/Task.js
const mongoose = require("mongoose");

// Định nghĩa schema cho Task
// Một Task có các thuộc tính: title (tên công việc), isCompleted (trạng thái hoàn thành)
// và các cột createdAt, updatedAt tự động do timestamps tạo ra
// Tạo schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Bắt buộc phải nhập tên công việc
      trim: true, // Tự động cắt khoảng trắng thừa 2 đầu
    },
    isCompleted: {
      type: Boolean,
      default: false, // Mặc định là chưa làm xong
    },
  },
  {
    timestamps: true, // Tự động tạo 2 cột: createdAt (ngày tạo) và updatedAt (ngày sửa)
  }
);

module.exports = mongoose.model("Task", taskSchema);
