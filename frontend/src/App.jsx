import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa"; // Thêm icon cảnh báo
import "./App.css";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // --- MỚI: State cho UX ---
  const [loading, setLoading] = useState(true); // Đang tải dữ liệu?
  const [error, setError] = useState(null); // Có lỗi không?
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'active' | 'completed'

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true); // Bắt đầu tải -> Bật loading
    setError(null); // Reset lỗi cũ
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Lỗi:", error);
      setError("Không thể kết nối đến Server. Vui lòng kiểm tra Backend!");
    } finally {
      setLoading(false); // Dù thành công hay thất bại cũng tắt loading
    }
  };

  // ... (Giữ nguyên các hàm handleAddTask, toggleComplete, handleDelete, startEditing, saveEdit như cũ)
  // Để tiết kiệm chỗ, bạn giữ nguyên logic các hàm đó nhé.
  // CHỈ LƯU Ý: Ở handleAddTask, nhớ thêm try-catch để set error nếu cần.

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await axios.post(API_URL, { title: newTask });
      setNewTask("");
      fetchTasks();
    } catch (err) {
      setError("Lỗi khi thêm mới!");
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(`${API_URL}/${task._id}`, {
        isCompleted: !task.isCompleted,
      });
      fetchTasks();
    } catch (err) {
      setError("Lỗi cập nhật!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa nhé?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchTasks();
      } catch (err) {
        setError("Lỗi xóa!");
      }
    }
  };

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;
    try {
      await axios.put(`${API_URL}/${id}`, { title: editTitle });
      setEditingId(null);
      fetchTasks();
    } catch (err) {
      setError("Lỗi lưu sửa!");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "dd/MM/yyyy HH:mm");
  };

  // --- MỚI: Logic lọc danh sách ---
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "active") return !task.isCompleted; // Chỉ hiện chưa xong
    if (filterStatus === "completed") return task.isCompleted; // Chỉ hiện đã xong
    return true; // "all" -> hiện hết
  });

  return (
    <div className="app-container">
      <h1>Quản Lý Công Việc</h1>

      {/* MỚI: Thông báo lỗi nếu có */}
      {error && (
        <div className="error-msg">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      <form onSubmit={handleAddTask} className="input-group">
        <input
          type="text"
          placeholder="Nhập công việc mới..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          disabled={loading} // Khi đang tải thì không cho nhập
        />
        <button type="submit" className="btn-add" disabled={loading}>
          <FaPlus /> Thêm
        </button>
      </form>

      {/* MỚI: Bộ lọc (Filter Buttons) */}
      <div className="filter-group">
        <button
          className={`btn-filter ${filterStatus === "all" ? "active" : ""}`}
          onClick={() => setFilterStatus("all")}
        >
          Tất cả
        </button>
        <button
          className={`btn-filter ${filterStatus === "active" ? "active" : ""}`}
          onClick={() => setFilterStatus("active")}
        >
          Đang làm
        </button>
        <button
          className={`btn-filter ${
            filterStatus === "completed" ? "active" : ""
          }`}
          onClick={() => setFilterStatus("completed")}
        >
          Đã xong
        </button>
      </div>

      {/* MỚI: Hiển thị trạng thái Loading hoặc Danh sách rỗng */}
      {loading ? (
        <p className="loading-text">⏳ Đang tải dữ liệu...</p>
      ) : tasks.length === 0 ? (
        <p className="empty-text">Bạn chưa có công việc nào. Hãy thêm mới!</p>
      ) : (
        <ul className="task-list">
          {/* LƯU Ý: Render filteredTasks thay vì tasks */}
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className={`task-item ${task.isCompleted ? "completed" : ""}`}
            >
              {/* Phần nội dung bên trong li giữ nguyên như code cũ */}
              <div className="task-content">
                {editingId === task._id ? (
                  <div className="edit-mode">
                    <input
                      className="edit-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      autoFocus
                    />
                    <div className="btn-group">
                      <button
                        className="btn-icon btn-save"
                        onClick={() => saveEdit(task._id)}
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="btn-icon btn-cancel"
                        onClick={() => setEditingId(null)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="view-mode">
                    <span
                      className="task-title"
                      onClick={() => toggleComplete(task)}
                    >
                      {task.title}
                    </span>
                    <div className="btn-group">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => startEditing(task)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(task._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="task-meta">
                <FaClock className="icon-clock" />
                <span>Tạo: {formatDate(task.createdAt)}</span>
                {task.createdAt !== task.updatedAt && (
                  <span className="updated-text">
                    | Sửa: {formatDate(task.updatedAt)}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
