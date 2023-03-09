const containerRoot = document.querySelector(".container");

// Fetch Tasks from localSorage

function fetchTasks() {
  const tasksData = localStorage.getItem("Kalbonyan");
  if (!tasksData) {
    return [
      {
        id: 1,
        title: "Not Started",
        tasks: [],
      },
      {
        id: 2,
        title: "In Progress",
        tasks: [],
      },
      {
        id: 3,
        title: "Completed",
        tasks: [],
      },
    ];
  }
  return JSON.parse(tasksData);
}

// Create a Task

function createTask(targetColumnId, taskContent) {
  const tasksData = fetchTasks();
  const targetColumn = tasksData.find((column) => column.id == targetColumnId);
  targetColumn.tasks.push({
    id: "" + new Date().getTime(),
    taskContent,
  });
  saveTasks(tasksData);
}

// Delete a Task

function deleteTask(taskId) {
  const tasksData = fetchTasks();

  tasksData.forEach((column) => {
    column.tasks = column.tasks.filter((task) => task.id !== taskId);
  });
  saveTasks(tasksData);
}

// Update a Task

function updateTask(taskId, taskContent) {
  const tasksData = fetchTasks();
  for (const column of tasksData) {
    const task = column.tasks.find((task) => task.id === taskId);
    if (task) {
      task.taskContent = taskContent;
      break;
    }
  }
  saveTasks(tasksData);
}

// change the position of a task

function swapTaskPosition(targetColumn, siblingId, dropDirection) {
  const draggedTaskData = {
    id: draggedTask.id,
    taskContent: draggedTask.innerText,
  };

  deleteTask(draggedTask.id);

  const tasksData = fetchTasks();

  const targetTasksObj = tasksData.find((obj) => obj.id == targetColumn.id);

  let targetTaskPosition = targetTasksObj.tasks.findIndex(
    (item) => item.id == siblingId
  );

  if (dropDirection === -1) {
    // drop above the sibling Task
    targetTasksObj.tasks.splice(targetTaskPosition, 0, draggedTaskData);
  } else {
    // drop below the sibling Task
    targetTasksObj.tasks.splice(targetTaskPosition + 1, 0, draggedTaskData);
  }

  saveTasks(tasksData);
}

// Save Tasks

function saveTasks(tasksData) {
  localStorage.setItem("Kalbonyan", JSON.stringify(tasksData));
  render();
}

function taskToAdd(addTaskBtn, targetColumnId) {
  addTaskBtn.addEventListener("click", () => {
    const taskInput = document.createElement("div");
    taskInput.className = "task";
    taskInput.contentEditable = "true";
    taskInput.style.cursor = "auto";

    // Save the task when a click occurs outside the task box

    taskInput.addEventListener("blur", function () {
      taskInput.contentEditable = false;
      taskInput.style.cursor = "pointer";

      if (taskInput.textContent !== "") {
        createTask(targetColumnId, taskInput.textContent);
      } else {
        render();
      }
    });

    const tasksList = addTaskBtn.parentElement.querySelector(".tasks");
    tasksList.appendChild(taskInput);
    taskInput.focus();
  });
}

function taskToDeleteHandler() {
  const taskEl = this.parentNode.previousElementSibling;
  const targetTaskId = taskEl.id;
  deleteTask(targetTaskId);
}

function taskToUpdateHandler() {
  const taskToUpdate = this.parentNode.previousElementSibling;
  const taskId = taskToUpdate.id;
  taskToUpdate.contentEditable = "true";
  taskToUpdate.focus();

  // Select all text inside the task When edit btn is clicked

  const range = document.createRange();
  range.selectNodeContents(taskToUpdate);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  const originalTaskContent = taskToUpdate.textContent;

  // Update the task when a click occurs outside the task box

  taskToUpdate.addEventListener("blur", function () {
    // Disable content editing
    taskToUpdate.contentEditable = false;

    // Get the updated task content
    const updatedTaskContent = taskToUpdate.textContent.trim();

    if (
      updatedTaskContent !== originalTaskContent &&
      updatedTaskContent !== ""
    ) {
      updateTask(taskId, updatedTaskContent);
    } else {
      render();
    }
  });
}

function addDragDropEvents() {
  // Get all task elements
  const tasks = document.querySelectorAll(".task");

  // Add a 'dragstart' event listener to each task
  tasks.forEach((task) => {
    task.addEventListener("dragstart", dragStartHandler);
  });

  // Get all drop areas
  const dropAreas = document.querySelectorAll(".drop-area");

  // Add a 'dragover' event listener to each drop area
  dropAreas.forEach((dropArea) => {
    dropArea.addEventListener("dragover", dragOverHandler);
    dropArea.addEventListener("dragenter", dragEnterHandler);
    dropArea.addEventListener("dragleave", dragLeaveHandler);
    dropArea.addEventListener("drop", dragDropHandler);
  });
}

let draggedTask;

function dragStartHandler() {
  draggedTask = this;
}

function dragOverHandler(e) {
  e.preventDefault();
}

function dragEnterHandler(e) {
  e.preventDefault();
  this.classList.add("drop-area-active");
}

function dragLeaveHandler() {
  this.classList.remove("drop-area-active");
}

function dragDropHandler(e) {
  e.preventDefault();

  this.classList.remove("drop-area-active");

  const targetColumn = this.closest(".column");

  const sibling = this.nextElementSibling || this.previousElementSibling;
  const siblingId = sibling ? sibling.firstElementChild.id : 0;

  const dropDirection = sibling
    ? sibling === this.nextElementSibling
      ? -1
      : 1
    : 0;

  swapTaskPosition(targetColumn, siblingId, dropDirection);
}

function renderTasks(columnId) {
  const tasksData = fetchTasks();
  const tasksColumn = tasksData.find((column) => column.id == columnId);

  let tasksHtml = "";
  tasksColumn.tasks.forEach((item) => {
    tasksHtml += `
    <div class="drop-area"></div>
      <div class="task-content">
        <div draggable="true" class="task" id="${item.id}" contenteditable="false">${item.taskContent}</div>
        <div class="task-actions">
          <button class="task-edit"><i class="fas fa-edit"></i></button>
          <button class="task-delete"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>

    `;
  });
  tasksHtml += `<div class="drop-area"></div>`;

  const tasksEl = document.createElement("div");
  tasksEl.className = "tasks";
  tasksEl.id = "tasks";
  tasksEl.innerHTML = tasksHtml;

  tasksEl.querySelectorAll(".task-edit").forEach((editBtn) => {
    editBtn.addEventListener("click", taskToUpdateHandler);
  });

  tasksEl.querySelectorAll(".task-delete").forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", taskToDeleteHandler);
  });

  return tasksEl;
}

function render() {
  const tasksData = fetchTasks();
  containerRoot.innerHTML = "";

  tasksData.forEach((column) => {
    const columnEl = document.createElement("div");
    columnEl.className = "column";

    const columnTitleEl = document.createElement("h2");
    columnEl.id = column.id;
    columnTitleEl.innerText = column.title;
    columnEl.appendChild(columnTitleEl);

    const tasksEl = renderTasks(column.id);
    if (column.id === 3) {
      tasksEl.style.textDecoration = "line-through";
      tasksEl.style.color = "grey";
    }
    columnEl.appendChild(tasksEl);

    const addTaskBtn = document.createElement("button");
    addTaskBtn.className = "add-task";
    addTaskBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add`;
    columnEl.appendChild(addTaskBtn);

    taskToAdd(addTaskBtn, column.id);

    containerRoot.appendChild(columnEl);
  });
  addDragDropEvents();
}

render();
