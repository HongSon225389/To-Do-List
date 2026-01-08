// URL API của Backend (Node.js)
const API_URL = "http://localhost:5000/api/tasks";

// Lấy các thẻ HTML cần thao tác
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// 1. Khi web vừa tải xong -> Gọi hàm lấy danh sách
document.addEventListener("DOMContentLoaded", fetchTasks);

// Hàm lấy danh sách từ Server
async function fetchTasks() {
  try {
    const response = await fetch(API_URL); // Gọi GET /api/tasks
    const tasks = await response.json(); // Backend trả về mảng []
    renderTasks(tasks); // Vẽ giao diện
  } catch (error) {
    console.error("Lỗi kết nối:", error);
  }
}

// Hàm vẽ danh sách ra màn hình
function renderTasks(tasks) {
  taskList.innerHTML = ""; // Xóa danh sách cũ
  tasks.forEach((task) => {
    // Tạo thẻ li
    const li = document.createElement("li");

    // Nội dung công việc (Click vào thì đổi trạng thái)
    const span = document.createElement("span");
    span.textContent = task.title;
    span.className = "task-content";
    if (task.isCompleted) {
      span.classList.add("completed-text");
    }
    // Bắt sự kiện click vào chữ để toggle
    span.addEventListener("click", () =>
      toggleTask(task._id, task.isCompleted)
    );

    // Nút xóa
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Xóa";
    deleteBtn.className = "delete-btn";
    // Bắt sự kiện click nút xóa
    deleteBtn.addEventListener("click", () => deleteTask(task._id));

    // Gắn vào li
    li.appendChild(span);
    li.appendChild(deleteBtn);

    // Gắn li vào danh sách ul
    taskList.appendChild(li);
  });
}

// 2. Thêm Task mới
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Chặn load lại trang
  const title = taskInput.value.trim();
  if (!title) return;

  try {
    const response = await fetch(API_URL, {
      method: "POST", // Gọi POST /api/tasks
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title }), // Gửi { title: "..." }
    });

    if (response.ok) {
      taskInput.value = ""; // Xóa ô nhập
      fetchTasks(); // Tải lại danh sách
    }
  } catch (error) {
    console.error("Lỗi thêm task:", error);
  }
});

// 3. Đổi trạng thái (Hoàn thành / Chưa)
async function toggleTask(id, currentStatus) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT", // Gọi PUT /api/tasks/:id
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: !currentStatus }), // Đảo ngược trạng thái
    });

    if (response.ok) {
      fetchTasks(); // Tải lại danh sách để cập nhật giao diện
    }
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
  }
}

// 4. Xóa Task
async function deleteTask(id) {
  if (!confirm("Bạn có chắc muốn xóa?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE", // Gọi DELETE /api/tasks/:id
    });

    if (response.ok) {
      fetchTasks(); // Tải lại danh sách
    }
  } catch (error) {
    console.error("Lỗi xóa:", error);
  }
}
