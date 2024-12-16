let folderStructure = {};
let selectedPath = "";
let currentTask = 0;
let openFile = ""; // Tracks the currently open file

const tasks = [
  {
    title: "Task 1",
    description: "Create a file named <strong>index.html</strong>. This will serve as the main entry file for your website.",
    hint: "Ensure the file type is 'File' and the name is exactly 'index.html'.",
    validate: () => checkFileExists("index.html", "file"),
    explanation: "The <strong>index.html</strong> file is the default entry point for websites. It is the first file browsers look for when loading a webpage."
  },
  {
    title: "Task 2",
    description: "Click on <strong>index.html</strong> to open it. Then type `!DOCTYPE` to declare the document type.",
    hint: "Click on the file named 'index.html' and type `!DOCTYPE` in the editor.",
    validate: () => openFile === "index.html" && codeEditor.value.trim().startsWith("<!DOCTYPE"),
    explanation: "The <strong>`!DOCTYPE`</strong> declaration tells the browser to render the page in HTML5 mode. It ensures proper rendering across all modern browsers."
  }
];

// DOM Elements
const folderList = document.getElementById("folder-structure");
const newFileName = document.getElementById("newFileName");
const fileType = document.getElementById("fileType");
const feedback = document.getElementById("feedback");
const taskTitle = document.getElementById("task-title");
const taskDescription = document.getElementById("task-description");
const codeEditor = document.getElementById("codeInput");

// Next Task Button Setup
const nextTaskButton = document.createElement("button");
nextTaskButton.textContent = "Next Task";
nextTaskButton.style.marginTop = "10px";
nextTaskButton.classList.add("hidden");
feedback.after(nextTaskButton);

nextTaskButton.addEventListener("click", () => {
  nextTaskButton.classList.add("hidden");
  loadTask();
});

// Task Initialization
function loadTask() {
  const task = tasks[currentTask];
  taskTitle.innerHTML = task.title;
  taskDescription.innerHTML = task.description;
  feedback.textContent = "";
  feedback.style.color = "black";
  renderFolders();
  openFile = "";
  codeEditor.value = "";
  codeEditor.disabled = true; // Lock editor until file is opened
  updateEditorSubtitle();
}

// Render Folders
function renderFolders() {
  folderList.innerHTML = render(folderStructure, "");
}

function render(obj, path = "") {
  return Object.keys(obj)
    .map(key => {
      const fullPath = path ? `${path}/${key}` : key;
      const type = obj[key];
      return `
        <li class="file-item" onclick="selectFile('${fullPath}', '${type}')">
          ${type === "folder" ? "📁" : "📄"} 
          <span class="file-name">${key}</span>
          <span>
            <button onclick="openRenameModal('${fullPath}'); event.stopPropagation();">Rename</button>
            <button onclick="openDeleteModal('${fullPath}'); event.stopPropagation();">Delete</button>
          </span>
        </li>
      `;
    })
    .join("");
}

// Handle File Selection
function selectFile(path, type) {
  if (type !== "file") {
    feedback.style.color = "red";
    feedback.textContent = "❌ Hint: Select a file, not a folder.";
    return;
  }

  if (currentTask === 1 && path !== "index.html") {
    feedback.style.color = "red";
    feedback.textContent = "❌ Hint: Open the file named 'index.html'.";
    return;
  }

  openFile = path;
  codeEditor.value = ""; // Start with an empty editor
  codeEditor.disabled = false;
  feedback.style.color = "green";
  feedback.textContent = "✅ File opened! Follow the instructions.";
  updateEditorSubtitle();

  // Highlight selected file
  document.querySelectorAll(".file-item").forEach(item => item.classList.remove("selected"));
  document.querySelector(`[onclick="selectFile('${path}', '${type}')"]`).classList.add("selected");
}

// Update Editor Subtitle
function updateEditorSubtitle() {
  const editorTitle = document.querySelector("#editor h2");
  editorTitle.textContent = openFile ? `Code Editor - ${openFile}` : "Code Editor";
}

// Create File or Folder
document.getElementById("createFileBtn").addEventListener("click", () => {
  let name = newFileName.value.trim();
  const type = fileType.value;

  if (!name) {
    alert("Please enter a valid name.");
    return;
  }

  name = sanitizeInput(name);
  if (folderStructure[name]) {
    alert("File or folder already exists!");
    return;
  }

  folderStructure[name] = type === "file" ? "file" : "folder";
  newFileName.value = "";
  renderFolders();
});

// Check if File Exists
function checkFileExists(path, expectedType) {
  const parts = path.split("/");
  let current = folderStructure;

  for (const part of parts) {
    if (!current[part]) return false;
    current = current[part];
  }
  return current === expectedType;
}

// Sanitize input
function sanitizeInput(name) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "");
}

// Submit Task
document.getElementById("submitTask").addEventListener("click", () => {
  const task = tasks[currentTask];
  if (task.validate()) {
    feedback.style.color = "green";
    feedback.innerHTML = `🎉 Congratulations! You completed the task.<br>${task.explanation}`;
    nextTaskButton.classList.remove("hidden");
    currentTask++;
  } else {
    feedback.style.color = "red";
    feedback.textContent = `❌ Incorrect. Hint: ${task.hint}`;
  }
});

// Modals and Rename/Delete
function openRenameModal(path) {
  selectedPath = path;
  renameModal.classList.remove("hidden");
}

function openDeleteModal(path) {
  selectedPath = path;
  deleteModal.classList.remove("hidden");
}

renameConfirm.addEventListener("click", () => {
  const newName = renameInput.value.trim();
  const parts = selectedPath.split("/");
  const oldName = parts.pop();
  let current = folderStructure;

  parts.forEach(part => current = current[part]);
  current[newName] = current[oldName];
  delete current[oldName];
  closeModals();
  renderFolders();
});

deleteConfirm.addEventListener("click", () => {
  const parts = selectedPath.split("/");
  const item = parts.pop();
  let current = folderStructure;

  parts.forEach(part => current = current[part]);
  delete current[item];
  closeModals();
  renderFolders();
});

function closeModals() {
  renameModal.classList.add("hidden");
  deleteModal.classList.add("hidden");
  renameInput.value = "";
}

// Initial Load
loadTask();







  
  
  
  
  
  
