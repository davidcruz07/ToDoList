const API_URL = 'https://todolist-f86v.onrender.com/tasks';

window.onload = fetchTasks;

// para obtener todas las tareas del servidor 
async function fetchTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    renderTasks(tasks);
}

// renderizar las tareas en el DOM usando el componente de Tailwind
function renderTasks(tasks) {
    const list = document.getElementById('taskList');
    const emptyMsg = document.getElementById('empty-message');
    list.innerHTML = '';

    if (tasks.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'block';
    } else {
        if (emptyMsg) emptyMsg.style.display = 'none';
        
        tasks.forEach(task => {
            // Creamos un ID único para el HTML (ej: task_17102345)
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

// para escucar los cambios en los checkbox de las tareas
document.addEventListener('change', async (e) => {
    if (e.target.classList.contains('task-checkbox')) {
        const taskId = e.target.getAttribute('data-id');
        const isCompleted = e.target.checked;

        try {

            const response = await fetch(`${API_URL}/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed: isCompleted })
            });

            if (response.ok) {
                console.log('Tarea actualizada con éxito');
                fetchTasks();
            }
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
            e.target.checked = !isCompleted;
        }
    }
});