// Fetch Tasks from localSorage

function fetchTasks() {
  // Get tasks data from localStorage with the key "Kalbonyan"

  const tasksData = localStorage.getItem("Kalbonyan");

  // If tasksData is not found, return the default tasks structure

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

  // parse the tasksData from JSON and return it

  return JSON.parse(tasksData);
}

// Create a Task

function createTask(targetColumnId, taskContent) {
  // Fetch tasks data from localStorage
  const tasksData = fetchTasks();

  // Find the targetColumn object from tasksData with matching id
  const targetColumn = tasksData.find((column) => column.id == targetColumnId);

  // Push the new task object to targetColumn's tasks array
  targetColumn.tasks.push({
    id: "" + new Date().getTime(),
    taskContent,
  });

  // Save the updated tasks data to localStorage
  saveTasks(tasksData);
}

// Delete a Task

function deleteTask(taskId) {
  const tasksData = fetchTasks();

  // Loop through each column and remove the task with matching taskId
  tasksData.forEach((column) => {
    column.tasks = column.tasks.filter((task) => task.id !== taskId);
  });

  saveTasks(tasksData);
}

// Update a Task

function updateTask(taskId, taskContent) {
  const tasksData = fetchTasks();

  // Loop through each column to find the task with matching taskId
  for (const column of tasksData) {
    const task = column.tasks.find((task) => task.id === taskId);

    // If found, update the task content
    if (task) {
      task.taskContent = taskContent;
      break;
    }
  }

  saveTasks(tasksData);
}

// change the position of a task

function swapTaskPosition(targetColumn, siblingId, dropDirection) {
  // Get the data of the dragged task
  const draggedTaskData = {
    id: draggedTask.id,
    taskContent: draggedTask.innerText,
  };

  // Delete the dragged task from its previous position
  deleteTask(draggedTask.id);

  const tasksData = fetchTasks();

  // Find the targetColumn object from tasksData with matching id
  const targetTasksObj = tasksData.find((obj) => obj.id == targetColumn.id);

  // Find the target task position using the siblingId and dropDirection
  let targetTaskPosition = targetTasksObj.tasks.findIndex(
    (item) => item.id == siblingId
  );

  if (dropDirection === -1) {
    // If the drop direction is above, insert the dragged task before the sibling task
    targetTasksObj.tasks.splice(targetTaskPosition, 0, draggedTaskData);
  } else {
    // If the drop direction is below, insert the dragged task after the sibling task
    targetTasksObj.tasks.splice(targetTaskPosition + 1, 0, draggedTaskData);
  }

  saveTasks(tasksData);
}

// Save Tasks

function saveTasks(tasksData) {
  localStorage.setItem("Kalbonyan", JSON.stringify(tasksData));
  render();
}

// Add a task when the 'add' button is clicked
function taskToAdd(addTaskBtn, targetColumnId) {
  addTaskBtn.addEventListener("click", () => {
    const taskInput = document.createElement("div");
    taskInput.className = "task";
    taskInput.contentEditable = "true";
    taskInput.style.cursor = "auto";

    function saveNewTask() {
      taskInput.removeEventListener("blur", saveNewTask);
      taskInput.contentEditable = false;
      taskInput.style.cursor = "pointer";

      if (taskInput.textContent !== "") {
        createTask(targetColumnId, taskInput.textContent);
      } else {
        render();
      }
    }

    // Add event listener to Save the task when a click occurs outside the task box
    taskInput.addEventListener("blur", saveNewTask);

    // Save the task when the enter key is pressed
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        saveNewTask();
      }
    };

    // Add event listener for the "keypress" event
    taskInput.addEventListener("keypress", handleKeyPress);

    // Add the new task element to the task list and focus on it
    const tasksList = addTaskBtn.parentElement.querySelector(".tasks");
    tasksList.appendChild(taskInput);
    taskInput.focus();
  });
}

// Delete a task when the delete button is clicked
function taskToDeleteHandler() {
  const taskEl = this.parentNode.previousElementSibling;
  const targetTaskId = taskEl.id;
  deleteTask(targetTaskId);
}

// Update a task when the edit button is clicked
function taskToUpdateHandler() {
  const taskToUpdate = this.parentNode.previousElementSibling;
  const taskId = taskToUpdate.id;
  taskToUpdate.contentEditable = "true";
  taskToUpdate.focus();

  // Create a new Range object and set it to include all the content

  const range = document.createRange();
  range.selectNodeContents(taskToUpdate);
  range.collapse(false); // Collapse the Range object to the end of its content
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

// Add drag and drop events to tasks and drop areas

function addDragDropEvents() {
  // Get all task elements
  const tasks = document.querySelectorAll(".task");

  // Add a 'dragstart' event listener to each task
  tasks.forEach((task) => {
    task.addEventListener("dragstart", dragStartHandler);
  });

  // Get all drop areas
  const dropAreas = document.querySelectorAll(".drop-area");

  // Add a event listener to each drop area
  dropAreas.forEach((dropArea) => {
    dropArea.addEventListener("dragover", dragOverHandler);
    dropArea.addEventListener("dragenter", dragEnterHandler);
    dropArea.addEventListener("dragleave", dragLeaveHandler);
    dropArea.addEventListener("drop", dragDropHandler);
  });
}

let draggedTask;

function dragStartHandler(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
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

  // Find the next or previous sibling element, if any, to determine where to drop the task
  const sibling = this.nextElementSibling || this.previousElementSibling;
  const siblingId = sibling ? sibling.firstElementChild.id : 0;

  // Determine the drop direction based on the position of the sibling element relative to the current element
  const dropDirection = sibling
    ? sibling === this.nextElementSibling
      ? -1
      : 1
    : 0;

  // Call the function to swap the position of the tasks based on the drop direction and sibling element
  swapTaskPosition(targetColumn, siblingId, dropDirection);
}

function renderTasks(column) {
  let tasksHtml = "";
  // loop through each task in the column and create the corresponding HTML
  column.tasks.forEach((item) => {
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
  // if add a drop area at the bottom of the column
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
  const containerRoot = document.querySelector(".container");
  const tasksData = fetchTasks();

  // Clear the content of the root container
  containerRoot.innerHTML = "";

  // Loop through each column in tasksData
  tasksData.forEach((column) => {
    const columnEl = document.createElement("div");
    columnEl.className = "column";

    const columnTitleEl = document.createElement("h2");
    columnEl.id = column.id;
    columnTitleEl.innerText = column.title;
    columnEl.appendChild(columnTitleEl);

    // Render tasks for the current column and append it to the column element
    const tasksEl = renderTasks(column);
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
