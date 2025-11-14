// Variables base
const tasks = [];
let time = 0;
let timer = null;
let breakTimer = null;
let current = null;

// Referencias de las variables
const hadd = document.querySelector("#hadd");
const inputTask = document.querySelector("#wrotetasks");
const form = document.querySelector("#form");
const taskName = document.querySelector("#taskName");

// Escucha del formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

     if (inputTask.value === "") {
    alert("Oye, debes poner una tarea aqui!🤭");
    return;}

  if (inputTask.value !== "") {
    createTask(inputTask.value);
    inputTask.value = "";
    renderTasks();
  }
});

//Local storage de Json, fiel compañero en guardar tareas
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks (){
  const  storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks.push(...JSON.parse(storedTasks));
  }
}


// Función para crear una tarea
function createTask(valor) {
  const nuevaTarea = {
    id: (Math.random() * 100).toString(36).slice(2),
    titulo: valor,
    completado: false,
  };
  tasks.unshift(nuevaTarea);
}

// Función para mostrar las tareas
function renderTasks() {
  const html = tasks.map((tarea) => {
    return `
      <div class="tarea">
        <div class="completado">
          ${tarea.completado
        ? "<span class='done'>Hecho</span>"
        : `<button class="start-button" data-id="${tarea.id}">Start</button>`
      }
        </div>
        <div class="titulo">${tarea.titulo}</div>
      </div>
    `;
  });

  const tasksContainer = document.querySelector("#tasks");
  tasksContainer.innerHTML = html.join("");

  const startButtons = document.querySelectorAll(".start-button");

  //Botones start y proceso

  startButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (!time) {
        const id = button.getAttribute("data-id");
        startButtonHandler(id);
        button.textContent = "En proceso...🍄";
      }
    });
  });
}

function startButtonHandler(id) {
  time = 25 * 60; //25 minutos, para hacer pruebas de que funciona, poner 5 segundos
  current = id;
  const taskIndex = tasks.findIndex((task) => task.id == id);
  taskName.textContent = tasks[taskIndex].titulo;

  timer = setInterval(() => {
    timerHandler(id);
  }, 1000);
}

//Funcion del break
function timerHandler(id) {
  time--;
  renderTime();

  if (time === 0) {
    clearInterval(timer);
    markCompleted(id);
    renderTasks();
    startBreak(); // iniciamos break
  }
}

function startBreak() {
  time = 5 * 60; //5 minutos, para pruebas, poner 5 segundos
  taskName.textContent = "Break!!🥇";
  breakTimer = setInterval(() => {
    timerBreakHandler();
  }, 1000);
}

//timer del break
function timerBreakHandler() {
  time--;
  renderTime();

  if (time === 0) {
    clearInterval(breakTimer);
    current = null;
    taskName.textContent = ""; 
    renderTasks();
  }
}

function renderTime() {
  const timeDiv = document.querySelector("#value");
  const minutes = parseInt(time / 60);
  const seconds = parseInt(time % 60);

  timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function markCompleted(id) {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  tasks[taskIndex].completado = true;
}