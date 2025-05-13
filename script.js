const $ = (element) => document.querySelector(element)

const date = new Date()
const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
let id = 0
let tasks = [];
let currentTaskId = null

const numberDay = $('#number-day')
const month = $('#month')
const year = $('#year')
const day = $('#day')

const addTaskButton = $('#add-task-button')

const tasksListContainer = $('#tasks-list-container')
const addTaskContainer = $('#add-task-container')
const editTaskContainer = $('#edit-task-container')
const pendingTasksContent = $('#pending-tasks-content')
const completedTasksContent = $('#completed-tasks-content')

const addTakForm = $('#add-task-form')
const taskText = $('#task-text')

const editTaskForm = $('#edit-task-form')
const editTaskText = $('#edit-task-text')
const editSmallText = $('#edit-small-text')

numberDay.innerHTML = date.getDate()
month.innerHTML = months[date.getMonth()]
year.innerHTML = date.getFullYear()
day.innerHTML = days[date.getDay()]

const storedTasks = localStorage.getItem('tasks');
if (storedTasks) {
    tasks = JSON.parse(storedTasks);
}

renderTasks()

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createEmptyMessage(text, container) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = text
    emptyMessage.className = 'empty-message';
    container.appendChild(emptyMessage);
}

function showEditView(task) {
    const day = String(task.createdAt.getDate()).padStart(2, '0');
    const month = String(task.createdAt.getMonth() + 1).padStart(2, '0');
    const year = String(task.createdAt.getFullYear()).slice(-2);
    tasksListContainer.style.display = 'none'
    editTaskContainer.style.display = 'block'
    editTaskText.value = task.title
    editSmallText.textContent = `Creada el día: ${day}/${month}/${year}`
    currentTaskId = task.id
    editTaskText.focus()
}

function completeTask(task) {
    const taskIndex = tasks.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        renderTasks();
    }
}

function createTaskElement(task, container, disabled) {
    const article = document.createElement('article');
    article.className = 'todo-list-item'

    const label = document.createElement('label')
    label.className = 'custom-checkbox'
    label.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT') return;
        completeTask(task);
    })

    const input = document.createElement('input')
    input.type = 'checkbox'
    input.className = 'checkbox'
    input.checked = task.completed;

    const checkmarkSpan = document.createElement('span')
    checkmarkSpan.className = 'checkmark'


    const textSpan = document.createElement('span')
    textSpan.className = 'task-text'
    textSpan.textContent = task.title

    const div = document.createElement('div')

    const editIcon = document.createElement('i')
    editIcon.className = 'fa-solid fa-pen-to-square'
    editIcon.classList.add(disabled ? 'icon-disabled' : 'icon')
    if (disabled == false) {
        editIcon.addEventListener('click', () => {
            showEditView(task)
        })
    }

    const deleteIcon = document.createElement('i')
    deleteIcon.className = 'fa-solid fa-trash icon'
    deleteIcon.addEventListener('click', () => deleteTask(task.id))

    label.appendChild(input)
    label.appendChild(checkmarkSpan)
    label.appendChild(textSpan)

    div.appendChild(editIcon)
    div.appendChild(deleteIcon)

    article.appendChild(label)
    article.appendChild(div)

    container.appendChild(article)
}

function renderTasks() {
    pendingTasksContent.innerHTML = '';
    completedTasksContent.innerHTML = '';
    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    if (pendingTasks.length === 0) {
        createEmptyMessage('No hay tareas pendientes', pendingTasksContent)
    } else {
        pendingTasks.forEach(task => {
            createTaskElement(task, pendingTasksContent, false)
        })
    }

    if (completedTasks.length === 0) {
        createEmptyMessage('No hay tareas completadas', completedTasksContent)
    } else {
        completedTasks.forEach(task => {
            createTaskElement(task, completedTasksContent, true)
        })
    }
}

function addTask(title) {
    const task = {
        id,
        title,
        completed: false,
        createdAt: new Date(),
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    id++
}

function editTask(id, newTitle) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.title = newTitle;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

addTaskButton.addEventListener('click', () => {
    tasksListContainer.style.display = 'none'
    addTaskContainer.style.display = 'block'
    taskText.focus()

})

addTakForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //.trim sirve para eliminar los espacios en blanco al inicio y al final de la cadena
    const text = taskText.value.trim();
    if (text) {
        addTask(text)
        taskText.value = ''
        addTaskContainer.style.display = 'none'
        tasksListContainer.style.display = 'block'
    }
})

editTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = editTaskText.value.trim();
    if (text && currentTaskId !== null) {
        editTask(currentTaskId, text)
        editTaskContainer.style.display = 'none'
        tasksListContainer.style.display = 'block'
    }
})