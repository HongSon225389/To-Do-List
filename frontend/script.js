const API_URL = "http://localhost:5000/api/tasks";

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

document.addEventListener("DOMContentLoaded", fetchTasks);

// === 1. LẤY DỮ LIỆU ===
async function fetchTasks() {
  try {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error("Lỗi kết nối:", error);
  }
}

// === 2. HIỂN THỊ (RENDER) ===
function renderTasks(tasks) {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    if (task.isCompleted) li.classList.add("completed");
    li.dataset.id = task._id; // Lưu ID vào thẻ li để dùng sau này

    // Format thời gian từ ISO string của MongoDB sang tiếng Việt dễ đọc
    const createdDate = new Date(task.createdAt).toLocaleString("vi-VN");
    const updatedDate = new Date(task.updatedAt).toLocaleString("vi-VN");

    // Logic hiển thị text thời gian: Nếu mới sửa thì hiện thêm "Đã sửa..."
    let timeDisplay = `Tạo: ${createdDate}`;
    if (task.createdAt !== task.updatedAt) {
      timeDisplay += ` | Sửa: ${updatedDate}`;
    }

    li.innerHTML = `
            <div class="task-header">
                <span class="task-title" onclick="toggleTask('${task._id}', ${task.isCompleted})">
                    ${task.title}
                </span>
                <div class="btn-group">
                    <button class="edit-btn" onclick="enableEditMode(this, '${task._id}', '${task.title}')">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="delete-btn" onclick="deleteTask('${task._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="task-meta">
                <i class="far fa-clock"></i> ${timeDisplay}
            </div>
        `;
    taskList.appendChild(li);
  });
}

// === 3. THÊM MỚI ===
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (response.ok) {
      taskInput.value = "";
      fetchTasks();
    }
  } catch (error) {
    console.error(error);
  }
});

// === 4. ĐỔI TRẠNG THÁI (Hoàn thành/Chưa) ===
async function toggleTask(id, currentStatus) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: !currentStatus }), // Chỉ gửi trường isCompleted
    });
    if (response.ok) fetchTasks();
  } catch (error) {
    console.error(error);
  }
}

// === 5. CHỨC NĂNG SỬA TÊN (UPDATE) ===
// Bước 1: Chuyển giao diện sang dạng Input
function enableEditMode(btn, id, oldTitle) {
  const li = btn.closest("li");
  // Thay thế nội dung HTML của li bằng form sửa
  li.innerHTML = `
        <div class="task-header" style="width: 100%">
            <input type="text" class="edit-input" id="edit-${id}" value="${oldTitle}">
            <div class="btn-group">
                <button class="edit-btn" style="background-color: #27ae60" onclick="saveTaskTitle('${id}')">
                    <i class="fas fa-check"></i> Lưu
                </button>
                <button class="delete-btn" style="background-color: #95a5a6" onclick="fetchTasks()">
                    <i class="fas fa-times"></i> Hủy
                </button>
            </div>
        </div>
    `;
  // Tự động focus vào ô input
  document.getElementById(`edit-${id}`).focus();
}

// Bước 2: Gọi API lưu tên mới
async function saveTaskTitle(id) {
  const newTitle = document.getElementById(`edit-${id}`).value.trim();
  if (!newTitle) return alert("Tên công việc không được để trống!");

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }), // Chỉ gửi trường title mới
    });

    if (response.ok) {
      fetchTasks(); // Load lại để thấy tên mới và thời gian update mới
    }
  } catch (error) {
    console.error("Lỗi khi lưu:", error);
  }
}

// === 6. XÓA ===
async function deleteTask(id) {
  if (!confirm("Bạn chắc chắn muốn xóa công việc này?")) return;
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
  } catch (error) {
    console.error(error);
  }
}
