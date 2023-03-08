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
// Save Tasks

function saveTasks(tasksData) {
  localStorage.setItem("Kalbonyan", JSON.stringify(tasksData));
  renderColumns();
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
}

render();
