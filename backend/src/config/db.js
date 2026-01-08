//Giúp code Node.js của bạn "bắt tay" được với MongoDB Atlas

// Đường dẫn: src/config/db.js

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Lấy đường dẫn kết nối từ file .env
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Thoát chương trình nếu lỗi kết nối
  }
};

module.exports = connectDB;
