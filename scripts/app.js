const containerRoot = document.querySelector(".container");
const tasksData = [
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

function render() {
  containerRoot.innerHTML = "";

  tasksData.forEach((column) => {
    const columnEl = document.createElement("div");
    columnEl.className = "column";

    const columnTitleEl = document.createElement("h2");
    columnEl.id = column.id;
    columnTitleEl.innerText = column.title;
    columnEl.appendChild(columnTitleEl);

    const addTaskBtn = document.createElement("button");
    addTaskBtn.className = "add-task";
    addTaskBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add`;
    columnEl.appendChild(addTaskBtn);

    containerRoot.appendChild(columnEl);
  });
}

render();
