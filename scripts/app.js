const containerRoot = document.querySelector(".container");
const tasksData = [
  {
    id: 1,
    title: "Not Started",
    tasks: [{ id: "1678291428198", taskContent: "Task 01" }],
  },
  {
    id: 2,
    title: "In Progress",
    tasks: [
      { id: "1678291433243", taskContent: "Task 03" },
      { id: "1678291435619", taskContent: "Task 02" },
      { id: "1678291473965", taskContent: "Task 04" },
    ],
  },
  {
    id: 3,
    title: "Completed",
    tasks: [
      { id: "1678291437769", taskContent: "Task 05" },
      { id: "1678291807152", taskContent: "Task 01" },
    ],
  },
];

function taskToAdd(addTaskBtn, targetColumnId) {
  addTaskBtn.addEventListener("click", () => {
    const taskInput = document.createElement("div");
    taskInput.className = "task";
    taskInput.contentEditable = "true";
    taskInput.style.cursor = "auto";

    const tasksList = addTaskBtn.parentElement.querySelector(".tasks");
    tasksList.appendChild(taskInput);
    taskInput.focus();
  });
}

function renderTasks(columnId) {
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
  containerRoot.innerHTML = "";

  tasksData.forEach((column) => {
    const columnEl = document.createElement("div");
    columnEl.className = "column";

    const columnTitleEl = document.createElement("h2");
    columnEl.id = column.id;
    columnTitleEl.innerText = column.title;
    columnEl.appendChild(columnTitleEl);

    const tasksEl = renderTasks(column.id);
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
