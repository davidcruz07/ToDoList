const API_URL = 'http://localhost:3000/tasks';

window.onload = fetchTasks;

// para obtener todas las tareas del servidor 
async function fetchTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    renderTasks(tasks);
}

// renderizar las tareas en el DOM
function renderTasks(tasks) {
    const list = document.getElementById('taskList'); 
    const emptyMsg = document.getElementById('empty-message');
    list.innerHTML = '';

    if (tasks.length === 0) {
        emptyMsg.style.display = 'block';
    } else {
        emptyMsg.style.display = 'none';
        tasks.forEach(task => {
            list.innerHTML += `
                        <div class="task-item">
                            <span>${task.title}</span>
                            <button onclick="deleteTask(${task.id})">Eliminar</button>
                        </div>
                    `;
        });
    }
}

// para agregar nuevas tareas al servidor
async function addTask() {
    const input = document.getElementById('taskInput');
    if (!input.value) return;

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input.value, completed: false }) 
    });

    input.value = '';
    fetchTasks();
}

// para eliminar tareas del servidor por id
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTasks();
}