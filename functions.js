const API_URL = 'https://todolist-f86v.onrender.com/tasks';

window.onload = fetchTasks;

// para obtener todas las tareas del servidor 
async function fetchTasks() {

    try {
        const res = await fetch(API_URL, { 
            credentials: 'include' 
        });

        if (res.ok) {
            const tasks = await res.json();
            
            // para esconder el login form
            document.getElementById('login-form').classList.add('hidden');

            renderTasks(tasks);
        } else if (res.status === 401) {
            // si no está autorizado, se muestra el formulario de login
            document.getElementById('login-form').classList.remove('hidden');
        }
    } catch (e) {
        console.error("Error al conectar:", e);
    }
}

// renderizar las tareas en el DOM
function renderTasks(tasks) {
    const list = document.getElementById('taskList');
    const emptyMsg = document.getElementById('empty-message');
    list.innerHTML = '';

    if (tasks.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'block';
    } else {
        if (emptyMsg) emptyMsg.style.display = 'none';
        
        tasks.forEach(task => {
            const htmlId = `task_${task.id}`;
            
            list.innerHTML += `
                <div class="flex items-center group">
                    <input 
                        class="hidden task-checkbox" 
                        type="checkbox" 
                        id="${htmlId}" 
                        data-id="${task.id}" 
                        ${task.completed ? 'checked' : ''}
                    >
                    
                    <label class="flex items-center h-10 px-2 rounded cursor-pointer hover:bg-gray-100 flex-grow" for="${htmlId}">
                        <span class="flex items-center justify-center w-5 h-5 text-transparent border-2 border-gray-300 rounded-full ${task.completed ? 'bg-indigo-500 border-indigo-500 text-white' : ''}">
                            <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </span>
                        <span class="ml-4 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}">
                            ${task.title}
                        </span>
                    </label>

                    <button 
                        onclick="deleteTask(${task.id})" 
                        class="opacity-0 group-hover:opacity-100 ml-2 p-1 text-gray-400 hover:text-red-500 transition-all"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            `;
        });
    }
}

// agregar tareassss
async function addTask() {
    const input = document.getElementById('taskInput');
    if (!input.value) return;
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input.value }),
        credentials: 'include'
    });
    if (res.status === 401) {
        alert("Debes iniciar sesión para agregar tareas");
    }
    input.value = '';
    fetchTasks();
}

// eliminar tareas
async function deleteTask(id) {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.status === 401) {
        alert("Debes iniciar sesión para eliminar tareas");
    }
    if (!res.ok) {
        const error = await res.json();
        alert(error.message);
    }
    fetchTasks();
}


// actualizar el estado de las tareas (completado o no)
document.addEventListener('change', async (e) => {
    if (e.target.classList.contains('task-checkbox')) {
        const taskId = e.target.getAttribute('data-id');
        await fetch(`${API_URL}/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: e.target.checked }),
            credentials: 'include'
        });
        fetchTasks();
    }
});

//inicio de sesionnn
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch('https://todolist-f86v.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
    });

    if (res.ok) {        
        location.reload();

    }else if(!password || !email ){
        alert("Por favor, completa todos los campos");
    }
     else {
        alert("Usuario o contraseña incorrectos");
    }
}

// cierre de sesionnn
async function logout() {
    try {
        const res = await fetch('https://todolist-f86v.onrender.com/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (res.ok) {
            location.reload();
        }
    } catch (e) {
        console.error("Error al cerrar sesión:", e);
    }
}