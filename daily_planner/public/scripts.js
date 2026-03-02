const API = "";
let currentUser = null;
let todos = [];
let currentFilter = "all";

// ── UTILS ──
const $ = (id) => document.getElementById(id);
const showPage = (page) => {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  $(page).classList.add("active");
};

const showToast = (msg, type = "default") => {
  const t = $("toast");
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove("show"), 3000);
};

const showError = (msg) => {
  const el = $("authError");
  el.textContent = msg;
  el.style.display = "block";
};

const clearError = () => {
  $("authError").style.display = "none";
};

const setLoading = (btnId, loading, text) => {
  const btn = $(btnId);
  btn.disabled = loading;
  btn.textContent = loading ? "Please wait..." : text;
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const isOverdue = (d) => (d && new Date(d) < new Date() ? true : false);

// ── AUTH TABS ──
const switchTab = (tab) => {
  clearError();
  $("loginForm").style.display = tab === "login" ? "block" : "none";
  $("registerForm").style.display = tab === "register" ? "block" : "none";
  document.querySelectorAll(".auth-tab").forEach((t, i) => {
    t.classList.toggle(
      "active",
      (i === 0 && tab === "login") || (i === 1 && tab === "register"),
    );
  });
};

// ── LOGIN ──
const login = async () => {
  clearError();
  const identifier = $("loginIdentifier").value.trim();
  const password = $("loginPassword").value;
  if (!identifier || !password) return showError("Please fill in all fields.");

  setLoading("loginBtn", true, "Sign In");
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed.");
    currentUser = data.user;
    await initDashboard();
  } catch (e) {
    showError(e.message);
  } finally {
    setLoading("loginBtn", false, "Sign In");
  }
};

// ── REGISTER ──
const register = async () => {
  clearError();
  const fullname = $("regFullname").value.trim();
  const username = $("regUsername").value.trim();
  const email = $("regEmail").value.trim();
  const phone = $("regPhone").value.trim();
  const gender = $("regGender").value;
  const password = $("regPassword").value;
  const confirmPassword = $("regConfirm").value;

  if (
    !fullname ||
    !username ||
    !email ||
    !gender ||
    !password ||
    !confirmPassword
  )
    return showError("Please fill in all required fields.");
  if (password !== confirmPassword) return showError("Passwords do not match.");

  setLoading("registerBtn", true, "Create Account");
  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        fullname,
        username,
        email,
        phone,
        gender,
        password,
        confirmPassword,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed.");
    currentUser = data.user;
    await initDashboard();
  } catch (e) {
    showError(e.message);
  } finally {
    setLoading("registerBtn", false, "Create Account");
  }
};

// ── LOGOUT ──
const logout = async () => {
  try {
    await fetch(`${API}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (_) {}
  currentUser = null;
  todos = [];
  showPage("authPage");
  switchTab("login");
};

// ── DASHBOARD ──
const initDashboard = async () => {
  showPage("dashPage");
  $("userName").textContent = currentUser.username;
  $("greetName").textContent =
    currentUser.fullname?.split(" ")[0] || currentUser.username;
  $("userAvatar").src =
    currentUser.avatar ||
    `https://api.dicebear.com/9.x/notionists/svg?seed=${currentUser.username}`;
  await fetchTodos();
};

// ── FETCH TODOS ──
const fetchTodos = async () => {
  try {
    const res = await fetch(`${API}/todos`, {
      credentials: "include",
    });
    if (res.status === 401) return logout();
    const data = await res.json();
    todos = data.todos || data || [];
    renderTodos();
    updateStats();
  } catch (e) {
    showToast("Failed to fetch todos.", "error");
  }
};

// ── STATS ──
const updateStats = () => {
  const total = todos.length;
  const done = todos.filter((t) => t.completed).length;
  const open = total - done;
  $("statTotal").textContent = total;
  $("statOpen").textContent = open;
  $("statDone").textContent = done;
  $("dashSubtitle").textContent =
    open === 0 && total > 0
      ? "All tasks completed. Great work!"
      : `You have ${open} open task${open !== 1 ? "s" : ""}.`;
};

// ── FILTER ──
const setFilter = (filter, btn) => {
  currentFilter = filter;
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderTodos();
};

// ── RENDER TODOS ──
const renderTodos = () => {
  const list = $("todoList");
  const now = new Date();

  let filtered = todos.filter((t) => {
    if (currentFilter === "open") return !t.completed;
    if (currentFilter === "completed") return t.completed;
    if (currentFilter === "overdue")
      return !t.completed && isOverdue(t.due_date);
    return true;
  });

  if (filtered.length === 0) {
    list.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <p>No tasks here. Add one above!</p>
        </div>`;
    return;
  }

  list.innerHTML = filtered
    .map((t) => {
      const overdue = !t.completed && isOverdue(t.due_date);
      return `
        <div class="todo-card ${t.completed ? "completed" : ""}" id="todo-${t._id}">
          <div class="todo-check" onclick="toggleTodo('${t._id}', ${t.completed})">
            <div class="todo-check-inner"></div>
          </div>
          <div class="todo-body">
            <div class="todo-title-text">${escHtml(t.title)}</div>
            ${t.description ? `<div class="todo-desc">${escHtml(t.description)}</div>` : ""}
            <div class="todo-meta">
              <span class="todo-date">📅 ${formatDate(t.start_date)}</span>
              <span class="todo-date ${overdue ? "overdue" : ""}">
                ${overdue ? "⚠️" : "🏁"} ${formatDate(t.due_date)}
              </span>
            </div>
          </div>
          <div class="todo-actions">
            <button class="todo-btn" onclick="openEdit('${t._id}')">Edit</button>
            <button class="todo-btn delete" onclick="deleteTodo('${t._id}')">Delete</button>
          </div>
        </div>`;
    })
    .join("");
};

const escHtml = (str) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ── ADD TODO ──
const addTodo = async () => {
  const title = $("newTitle").value.trim();
  const description = $("newDesc").value.trim();
  const start_date = $("newStart").value;
  const due_date = $("newDue").value;

  if (!title) return showToast("Title is required.", "error");
  if (!due_date) return showToast("Due date is required.", "error");

  try {
    const res = await fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, description, start_date, due_date }),
    });
    if (res.status === 401) return logout();
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add task.");
    $("newTitle").value = "";
    $("newDesc").value = "";
    $("newStart").value = "";
    $("newDue").value = "";
    await fetchTodos();
    showToast("Task added!", "success");
  } catch (e) {
    showToast(e.message, "error");
  }
};

// ── TOGGLE COMPLETE ──
const toggleTodo = async (id, completed) => {
  try {
    const todo = todos.find((t) => t._id === id);
    const res = await fetch(`${API}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...todo, completed: !completed }),
    });
    if (res.status === 401) return logout();
    await fetchTodos();
  } catch (e) {
    showToast("Failed to update task.", "error");
  }
};

// ── DELETE TODO ──
const deleteTodo = async (id) => {
  try {
    const res = await fetch(`${API}/todos/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 401) return logout();
    await fetchTodos();
    showToast("Task deleted.", "default");
  } catch (e) {
    showToast("Failed to delete task.", "error");
  }
};

// ── EDIT MODAL ──
const openEdit = (id) => {
  const todo = todos.find((t) => t._id === id);
  if (!todo) return;
  $("editId").value = id;
  $("editTitle").value = todo.title;
  $("editDesc").value = todo.description || "";
  $("editStart").value = todo.start_date ? todo.start_date.split("T")[0] : "";
  $("editDue").value = todo.due_date ? todo.due_date.split("T")[0] : "";
  $("editModal").classList.add("open");
};

const closeModal = () => $("editModal").classList.remove("open");

const saveEdit = async () => {
  const id = $("editId").value;
  const title = $("editTitle").value.trim();
  const description = $("editDesc").value.trim();
  const start_date = $("editStart").value;
  const due_date = $("editDue").value;

  if (!title) return showToast("Title is required.", "error");
  if (!due_date) return showToast("Due date is required.", "error");

  try {
    const res = await fetch(`${API}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, description, start_date, due_date }),
    });
    if (res.status === 401) return logout();
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update.");
    closeModal();
    await fetchTodos();
    showToast("Task updated!", "success");
  } catch (e) {
    showToast(e.message, "error");
  }
};

// ── INIT ──
const init = async () => {
  try {
    // First try with existing access token
    let res = await fetch(`${API}/auth/me`, { credentials: "include" });

    // If access token expired, try to refresh it
    if (res.status === 401) {
      const refreshRes = await fetch(`${API}/auth/refresh`, {
        method: "POST",
        credentials: "include", // sends refreshToken cookie automatically
      });

      if (refreshRes.ok) {
        // Retry /auth/me with new access token
        res = await fetch(`${API}/auth/me`, { credentials: "include" });
      }
    }

    if (res.ok) {
      const data = await res.json();
      currentUser = data.user;
      await initDashboard();
      return;
    }
  } catch (_) {}

  showPage("authPage");
};

// Set today as default start date
const today = new Date().toISOString().split("T")[0];
document.addEventListener("DOMContentLoaded", () => {
  $("newStart").value = today;
  init();
});
