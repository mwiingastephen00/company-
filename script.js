/* =========================================================
   BUSINESS MANAGEMENT SYSTEM
   Main JavaScript
========================================================= */


/* ================= DATABASE ================= */

const DEFAULT_DATA = {

  users: [
    {
      id: 1,
      username: "admin",
      password: "admin123",
      name: "Administrator",
      role: "Admin",
      active: true
    },
    {
      id: 2,
      username: "employee",
      password: "employee123",
      name: "Employee",
      role: "Employee",
      active: true
    }
  ],

  customers: [
    {
      id: 1,
      name: "John Banda",
      company: "ABC Trading Ltd",
      phone: "0977000000",
      email: "john@example.com",
      address: "Lusaka, Zambia",
      tpin: "1234567890",
      contact: "John Banda",
      notes: ""
    }
  ],

  tasks: [
    {
      id: 1,
      title: "Prepare customer quotation",
      assigned: "Administrator",
      priority: "High",
      dueDate: "2026-09-30",
      status: "Pending",
      description: ""
    },
    {
      id: 2,
      title: "Follow up outstanding invoice",
      assigned: "Employee",
      priority: "Medium",
      dueDate: "2026-10-02",
      status: "In Progress",
      description: ""
    }
  ],

  invoices: [
    {
      id: 1,
      number: "INV-0001",
      customer: "ABC Trading Ltd",
      date: "2026-09-01",
      amount: 15000,
      paid: 5000,
      status: "Partial"
    }
  ],

  payments: [
    {
      id: 1,
      customer: "ABC Trading Ltd",
      amount: 5000,
      date: "2026-09-10",
      method: "Bank",
      reference: "PAY-001"
    }
  ],

  expenses: [
    {
      id: 1,
      category: "Transport",
      amount: 1200,
      date: "2026-09-05",
      supplier: "Transport Provider",
      description: "Business transport"
    }
  ],

  settings: {
    companyName: "Business Manager",
    tpin: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    bankDetails: "",
    terms: "Payment due according to agreed terms.",
    currency: "ZMW"
  }

};


/* ================= GLOBAL VARIABLES ================= */

let data = {};
let currentUser = null;


/* ================= INITIALIZATION ================= */

document.addEventListener("DOMContentLoaded", function () {

  loadData();

  setupLogin();

  setupForms();

  checkSession();

});


/* ================= DATA ================= */

function loadData() {

  const stored = localStorage.getItem("businessManagementData");

  if (stored) {

    try {

      data = JSON.parse(stored);

      if (!data.users) data.users = DEFAULT_DATA.users;
      if (!data.customers) data.customers = [];
      if (!data.tasks) data.tasks = [];
      if (!data.invoices) data.invoices = [];
      if (!data.payments) data.payments = [];
      if (!data.expenses) data.expenses = [];
      if (!data.settings) data.settings = DEFAULT_DATA.settings;

    } catch (error) {

      console.error(error);

      data = JSON.parse(JSON.stringify(DEFAULT_DATA));

    }

  } else {

    data = JSON.parse(JSON.stringify(DEFAULT_DATA));

    saveData();

  }

}


function saveData() {

  localStorage.setItem(
    "businessManagementData",
    JSON.stringify(data)
  );

}


/* ================= LOGIN ================= */

function setupLogin() {

  const form = document.getElementById("loginForm");

  if (!form) return;

  form.addEventListener("submit", function (event) {

    event.preventDefault();

    login();

  });

}


function login() {

  const username =
    document.getElementById("username").value.trim();

  const password =
    document.getElementById("password").value;

  const remember =
    document.getElementById("rememberMe").checked;

  const errorBox =
    document.getElementById("loginError");


  errorBox.textContent = "";


  if (!username || !password) {

    errorBox.textContent =
      "Please enter your username and password.";

    return;

  }


  const user = data.users.find(function (u) {

    return (
      String(u.username).toLowerCase() ===
      username.toLowerCase() &&
      String(u.password) === password &&
      u.active !== false
    );

  });


  if (!user) {

    errorBox.textContent =
      "Invalid username or password.";

    return;

  }


  currentUser = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role
  };


  const session = JSON.stringify(currentUser);


  if (remember) {

    localStorage.setItem(
      "businessSession",
      session
    );

    sessionStorage.removeItem("businessSession");

  } else {

    sessionStorage.setItem(
      "businessSession",
      session
    );

    localStorage.removeItem("businessSession");

  }


  showApplication();

}


function checkSession() {

  let savedSession =
    localStorage.getItem("businessSession");

  if (!savedSession) {

    savedSession =
      sessionStorage.getItem("businessSession");

  }


  if (!savedSession) {

    showLogin();

    return;

  }


  try {

    const session =
      JSON.parse(savedSession);


    const user =
      data.users.find(function (u) {

        return (
          Number(u.id) === Number(session.id) &&
          u.active !== false
        );

      });


    if (!user) {

      clearSession();

      showLogin();

      return;

    }


    currentUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    };


    showApplication();

  } catch (error) {

    console.error(error);

    clearSession();

    showLogin();

  }

}


function showApplication() {

  const loginScreen =
    document.getElementById("loginScreen");

  const app =
    document.getElementById("app");


  if (loginScreen) {

    loginScreen.classList.add("hidden");

  }


  if (app) {

    app.classList.remove("hidden");

  }


  updateUserInterface();

  loadSettings();

  showPage("dashboard");

  renderAll();

}


function showLogin() {

  const loginScreen =
    document.getElementById("loginScreen");

  const app =
    document.getElementById("app");


  if (loginScreen) {

    loginScreen.classList.remove("hidden");

  }


  if (app) {

    app.classList.add("hidden");

  }

}


function clearSession() {

  localStorage.removeItem("businessSession");

  sessionStorage.removeItem("businessSession");

  currentUser = null;

}


function logout() {

  clearSession();

  showLogin();

  document.getElementById("username").value = "";

  document.getElementById("password").value = "";

  document.getElementById("rememberMe").checked = false;

  showToast("You have been logged out.");

}


/* ================= USER INTERFACE ================= */

function updateUserInterface() {

  if (!currentUser) return;


  const firstLetter =
    currentUser.name
      ? currentUser.name.charAt(0).toUpperCase()
      : "U";


  document.getElementById("userName").textContent =
    currentUser.name;

  document.getElementById("userRole").textContent =
    currentUser.role;

  document.getElementById("topUserName").textContent =
    currentUser.name;

  document.getElementById("welcomeName").textContent =
    currentUser.name;

  document.getElementById("userAvatar").textContent =
    firstLetter;

  document.getElementById("topAvatar").textContent =
    firstLetter;


  const adminItems =
    document.querySelectorAll(".admin-only");


  adminItems.forEach(function (item) {

    if (currentUser.role === "Admin") {

      item.style.display = "flex";

    } else {

      item.style.display = "none";

    }

  });

}


/* ================= NAVIGATION ================= */

const PAGE_INFO = {

  dashboard: {
    title: "Dashboard",
    subtitle: "Overview of your business"
  },

  tasks: {
    title: "Tasks",
    subtitle: "Manage your business tasks"
  },

  customers: {
    title: "Customers",
    subtitle: "Manage customers"
  },

  suppliers: {
    title: "Suppliers",
    subtitle: "Manage suppliers"
  },

  products: {
    title: "Products",
    subtitle: "Manage products and stock"
  },

  services: {
    title: "Services",
    subtitle: "Manage services"
  },

  quotations: {
    title: "Quotations",
    subtitle: "Create and manage quotations"
  },

  invoices: {
    title: "Invoices",
    subtitle: "Manage customer invoices"
  },

  payments: {
    title: "Payments",
    subtitle: "Record customer payments"
  },

  expenses: {
    title: "Expenses",
    subtitle: "Track business expenses"
  },

  projects: {
    title: "Projects",
    subtitle: "Manage business projects"
  },

  documents: {
    title: "Documents",
    subtitle: "Manage business documents"
  },

  employees: {
    title: "Employees",
    subtitle: "Manage employees and permissions"
  },

  reports: {
    title: "Reports",
    subtitle: "Business reports and analytics"
  },

  settings: {
    title: "Settings",
    subtitle: "Configure your business"
  }

};


function showPage(pageName) {

  const pages =
    document.querySelectorAll(".page");


  pages.forEach(function (page) {

    page.classList.remove("active-page");

  });


  const page =
    document.getElementById(
      "page-" + pageName
    );


  if (!page) return;


  page.classList.add("active-page");


  const navItems =
    document.querySelectorAll(".nav-item");


  navItems.forEach(function (item) {

    item.classList.remove("active");

  });


  const activeNav =
    document.querySelector(
      '.nav-item[data-page="' + pageName + '"]'
    );


  if (activeNav) {

    activeNav.classList.add("active");

  }


  const info =
    PAGE_INFO[pageName] ||
    PAGE_INFO.dashboard;


  document.getElementById("pageTitle").textContent =
    info.title;

  document.getElementById("pageSubtitle").textContent =
    info.subtitle;


  const sidebar =
    document.getElementById("sidebar");

  if (sidebar) {

    sidebar.classList.remove("open");

  }


  if (pageName === "customers") {

    renderCustomers();

  }

  if (pageName === "tasks") {

    renderTasks();

  }

  if (pageName === "settings") {

    loadSettings();

  }

}


/* ================= RENDER ALL ================= */

function renderAll() {

  renderDashboard();

  renderCustomers();

  renderTasks();

  renderRecentInvoices();

}


/* ================= DASHBOARD ================= */

function renderDashboard() {

  const customers =
    data.customers || [];

  const invoices =
    data.invoices || [];

  const payments =
    data.payments || [];

  const expenses =
    data.expenses || [];


  const revenue =
    payments.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );


  const invoiceTotal =
    invoices.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );


  const outstanding =
    Math.max(invoiceTotal - revenue, 0);


  const expenseTotal =
    expenses.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );


  document.getElementById("statCustomers").textContent =
    customers.length;


  document.getElementById("statRevenue").textContent =
    formatCurrency(revenue);


  document.getElementById("statOutstanding").textContent =
    formatCurrency(outstanding);


  document.getElementById("statExpenses").textContent =
    formatCurrency(expenseTotal);


  renderDashboardTasks();

  renderRecentInvoices();

}


function renderDashboardTasks() {

  const container =
    document.getElementById("dashboardTasks");

  if (!container) return;


  const tasks =
    (data.tasks || []).slice(0, 5);


  if (!tasks.length) {

    container.innerHTML =
      `<div class="task-row">
        <div>
          <div class="task-name">No tasks available</div>
          <div class="task-meta">Create your first task.</div>
        </div>
      </div>`;

    return;

  }


  container.innerHTML =
    tasks.map(function (task) {

      return `
        <div class="task-row">

          <div>
            <div class="task-name">
              ${escapeHTML(task.title)}
            </div>

            <div class="task-meta">
              ${escapeHTML(task.assigned || "Unassigned")}
              • ${escapeHTML(task.dueDate || "No due date")}
            </div>
          </div>

          <span class="status ${getStatusClass(task.status)}">
            ${escapeHTML(task.status)}
          </span>

        </div>
      `;

    }).join("");

}


function renderRecentInvoices() {

  const table =
    document.getElementById("recentInvoices");

  if (!table) return;


  const invoices =
    (data.invoices || []).slice(0, 8);


  if (!invoices.length) {

    table.innerHTML =
      `<tr>
        <td colspan="5" style="text-align:center">
          No invoices available
        </td>
      </tr>`;

    return;

  }


  table.innerHTML =
    invoices.map(function (invoice) {

      let status = invoice.status || "Pending";

      if (
        Number(invoice.paid || 0) >=
        Number(invoice.amount || 0)
      ) {

        status = "Paid";

      } else if (Number(invoice.paid || 0) > 0) {

        status = "Partial";

      }


      return `
        <tr>

          <td>
            <strong>${escapeHTML(invoice.number)}</strong>
          </td>

          <td>${escapeHTML(invoice.customer)}</td>

          <td>${escapeHTML(invoice.date)}</td>

          <td>
            ${formatCurrency(invoice.amount)}
          </td>

          <td>
            <span class="status ${getStatusClass(status)}">
              ${escapeHTML(status)}
            </span>
          </td>

        </tr>
      `;

    }).join("");

}


/* ================= CUSTOMERS ================= */

function openCustomerModal() {

  document.getElementById("customerForm").reset();

  document.getElementById("customerModal")
    .classList.add("show");

}


function renderCustomers() {

  const table =
    document.getElementById("customersTable");

  if (!table) return;


  const search =
    (
      document.getElementById("customerSearch")?.value
      || ""
    ).toLowerCase();


  const customers =
    (data.customers || []).filter(function (customer) {

      return (
        String(customer.name || "")
          .toLowerCase()
          .includes(search) ||

        String(customer.company || "")
          .toLowerCase()
          .includes(search) ||

        String(customer.phone || "")
          .toLowerCase()
          .includes(search) ||

        String(customer.email || "")
          .toLowerCase()
          .includes(search) ||

        String(customer.tpin || "")
          .toLowerCase()
          .includes(search)
      );

    });


  if (!customers.length) {

    table.innerHTML =
      `<tr>
        <td colspan="6" style="text-align:center">
          No customers found.
        </td>
      </tr>`;

    return;

  }


  table.innerHTML =
    customers.map(function (customer) {

      return `
        <tr>

          <td>
            <strong>
              ${escapeHTML(customer.name)}
            </strong>
          </td>

          <td>
            ${escapeHTML(customer.company || "-")}
          </td>

          <td>
            ${escapeHTML(customer.phone || "-")}
          </td>

          <td>
            ${escapeHTML(customer.email || "-")}
          </td>

          <td>
            ${escapeHTML(customer.tpin || "-")}
          </td>

          <td>

            <button
              class="btn btn-secondary"
              onclick="viewCustomer(${customer.id})">
              <i class="fa-solid fa-eye"></i>
            </button>

            <button
              class="btn btn-danger"
              onclick="deleteCustomer(${customer.id})">
              <i class="fa-solid fa-trash"></i>
            </button>

          </td>

        </tr>
      `;

    }).join("");

}


function saveCustomer(event) {

  event.preventDefault();


  const customer = {

    id: Date.now(),

    name:
      document.getElementById("customerName").value.trim(),

    company:
      document.getElementById("customerCompany").value.trim(),

    phone:
      document.getElementById("customerPhone").value.trim(),

    email:
      document.getElementById("customerEmail").value.trim(),

    address:
      document.getElementById("customerAddress").value.trim(),

    tpin:
      document.getElementById("customerTPIN").value.trim(),

    contact:
      document.getElementById("customerContact").value.trim(),

    notes:
      document.getElementById("customerNotes").value.trim()

  };


  if (!customer.name) {

    showToast("Customer name is required.");

    return;

  }


  data.customers.push(customer);

  saveData();

  closeModal("customerModal");

  document.getElementById("customerForm").reset();

  renderCustomers();

  renderDashboard();

  showToast("Customer added successfully.");

}


function viewCustomer(id) {

  const customer =
    data.customers.find(
      c => Number(c.id) === Number(id)
    );


  if (!customer) return;


  alert(
`CUSTOMER DETAILS

Name: ${customer.name}

Company: ${customer.company || "-"}

Phone: ${customer.phone || "-"}

Email: ${customer.email || "-"}

TPIN: ${customer.tpin || "-"}

Contact Person: ${customer.contact || "-"}

Address: ${customer.address || "-"}

Notes: ${customer.notes || "-"}`
  );

}


function deleteCustomer(id) {

  if (!confirm(
    "Are you sure you want to delete this customer?"
  )) {

    return;

  }


  data.customers =
    data.customers.filter(
      customer =>
        Number(customer.id) !== Number(id)
    );


  saveData();

  renderCustomers();

  renderDashboard();

  showToast("Customer deleted.");

}


/* ================= TASKS ================= */

function openTaskModal() {

  document.getElementById("taskForm").reset();

  document.getElementById("taskAssigned").value =
    currentUser ? currentUser.name : "";


  document.getElementById("taskModal")
    .classList.add("show");

}


function saveTask(event) {

  event.preventDefault();


  const task = {

    id: Date.now(),

    title:
      document.getElementById("taskTitle").value.trim(),

    assigned:
      document.getElementById("taskAssigned").value.trim(),

    priority:
      document.getElementById("taskPriority").value,

    dueDate:
      document.getElementById("taskDueDate").value,

    status:
      document.getElementById("taskStatus").value,

    description:
      document.getElementById("taskDescription").value.trim()

  };


  if (!task.title) {

    showToast("Task title is required.");

    return;

  }


  data.tasks.push(task);

  saveData();

  closeModal("taskModal");

  document.getElementById("taskForm").reset();

  renderTasks();

  renderDashboard();

  showToast("Task created successfully.");

}


function renderTasks() {

  const table =
    document.getElementById("tasksTable");

  if (!table) return;


  const tasks =
    data.tasks || [];


  if (!tasks.length) {

    table.innerHTML =
      `<tr>
        <td colspan="6" style="text-align:center">
          No tasks found.
        </td>
      </tr>`;

    return;

  }


  table.innerHTML =
    tasks.map(function (task) {

      return `
        <tr>

          <td>
            <strong>
              ${escapeHTML(task.title)}
            </strong>
          </td>

          <td>
            ${escapeHTML(task.assigned || "-")}
          </td>

          <td>
            ${escapeHTML(task.priority)}
          </td>

          <td>
            ${escapeHTML(task.dueDate || "-")}
          </td>

          <td>
            <span class="status ${getStatusClass(task.status)}">
              ${escapeHTML(task.status)}
            </span>
          </td>

          <td>

            <button
              class="btn btn-primary"
              onclick="toggleTaskStatus(${task.id})">
              <i class="fa-solid fa-check"></i>
            </button>

            <button
              class="btn btn-danger"
              onclick="deleteTask(${task.id})">
              <i class="fa-solid fa-trash"></i>
            </button>

          </td>

        </tr>
      `;

    }).join("");

}


function toggleTaskStatus(id) {

  const task =
    data.tasks.find(
      t => Number(t.id) === Number(id)
    );


  if (!task) return;


  if (task.status === "Pending") {

    task.status = "In Progress";

  } else if (task.status === "In Progress") {

    task.status = "Completed";

  } else {

    task.status = "Pending";

  }


  saveData();

  renderTasks();

  renderDashboard();

  showToast("Task status updated.");

}


function deleteTask(id) {

  if (!confirm(
    "Delete this task?"
  )) return;


  data.tasks =
    data.tasks.filter(
      task =>
        Number(task.id) !== Number(id)
    );


  saveData();

  renderTasks();

  renderDashboard();

  showToast("Task deleted.");

}


/* ================= SETTINGS ================= */

function loadSettings() {

  const settings =
    data.settings || {};


  document.getElementById("companyName").value =
    settings.companyName || "";

  document.getElementById("companyTPIN").value =
    settings.tpin || "";

  document.getElementById("companyPhone").value =
    settings.phone || "";

  document.getElementById("companyEmail").value =
    settings.email || "";

  document.getElementById("companyWebsite").value =
    settings.website || "";

  document.getElementById("companyAddress").value =
    settings.address || "";

  document.getElementById("bankDetails").value =
    settings.bankDetails || "";

  document.getElementById("documentTerms").value =
    settings.terms || "";

  document.getElementById("companyCurrency").value =
    settings.currency || "ZMW";


  const companyName =
    settings.companyName || "Business Manager";


  document.getElementById(
    "sidebarCompanyName"
  ).textContent = companyName;

}


function saveSettings(event) {

  event.preventDefault();


  data.settings = {

    companyName:
      document.getElementById("companyName").value.trim(),

    tpin:
      document.getElementById("companyTPIN").value.trim(),

    phone:
      document.getElementById("companyPhone").value.trim(),

    email:
      document.getElementById("companyEmail").value.trim(),

    website:
      document.getElementById("companyWebsite").value.trim(),

    address:
      document.getElementById("companyAddress").value.trim(),

    bankDetails:
      document.getElementById("bankDetails").value.trim(),

    terms:
      document.getElementById("documentTerms").value.trim(),

    currency:
      document.getElementById("companyCurrency").value

  };


  saveData();

  loadSettings();

  showToast("Settings saved successfully.");

}


/* ================= FORMS ================= */

function setupForms() {

  const customerForm =
    document.getElementById("customerForm");

  if (customerForm) {

    customerForm.addEventListener(
      "submit",
      saveCustomer
    );

  }


  const taskForm =
    document.getElementById("taskForm");

  if (taskForm) {

    taskForm.addEventListener(
      "submit",
      saveTask
    );

  }


  const settingsForm =
    document.getElementById("settingsForm");

  if (settingsForm) {

    settingsForm.addEventListener(
      "submit",
      saveSettings
    );

  }

}


/* ================= QUICK ACTION ================= */

function quickAction() {

  document.getElementById("quickModal")
    .classList.add("show");

}


function openCustomerFromQuick() {

  closeModal("quickModal");

  showPage("customers");

  setTimeout(function () {

    openCustomerModal();

  }, 100);

}


function openTaskFromQuick() {

  closeModal("quickModal");

  showPage("tasks");

  setTimeout(function () {

    openTaskModal();

  }, 100);

}


/* ================= MODALS ================= */

function closeModal(id) {

  const modal =
    document.getElementById(id);

  if (modal) {

    modal.classList.remove("show");

  }

}


document.addEventListener("click", function (event) {

  if (
    event.target.classList.contains(
      "modal-overlay"
    )
  ) {

    event.target.classList.remove("show");

  }

});


/* ================= SIDEBAR ================= */

function toggleSidebar() {

  const sidebar =
    document.getElementById("sidebar");

  sidebar.classList.toggle("open");

}


/* ================= HELPERS ================= */

function formatCurrency(amount) {

  const currency =
    data.settings?.currency || "ZMW";


  const value =
    Number(amount || 0);


  return (
    currency +
    " " +
    value.toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )
  );

}


function getStatusClass(status) {

  const value =
    String(status || "")
      .toLowerCase();


  if (
    value === "paid" ||
    value === "completed"
  ) {

    return "completed";

  }


  if (
    value === "in progress" ||
    value === "partial"
  ) {

    return "progress";

  }


  if (
    value === "overdue" ||
    value === "urgent"
  ) {

    return "overdue";

  }


  return "pending";

}


function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* ================= TOAST ================= */

function showToast(message) {

  const toast =
    document.getElementById("toast");


  if (!toast) return;


  toast.textContent = message;

  toast.classList.add("show");


  setTimeout(function () {

    toast.classList.remove("show");

  }, 3000);

}


/* ================= OTHER FUNCTIONS ================= */

function forgotPassword(event) {

  event.preventDefault();

  alert(
    "Please contact the system administrator to reset your password."
  );

}


function showNotifications() {

  alert(
    "You currently have no new notifications."
  );

}


/* ================= DEBUG ================= */

function resetApplicationData() {

  if (!confirm(
    "This will erase all saved application data. Continue?"
  )) return;


  localStorage.removeItem(
    "businessManagementData"
  );

  localStorage.removeItem(
    "businessSession"
  );

  sessionStorage.removeItem(
    "businessSession"
  );


  location.reload();

}