const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// configuracion de cors para permitir cookies desde el frontend
app.use(cors({
    origin: 'https://davidcruz07.github.io/ToDoList/', 
    credentials: true               
}));

let tasks = [
  { id: 1, title: "Hacer la tarea de frontendddd", completed: false },
  { id: 2, title: "Hacer la tarea de backend", completed: false },
  { id: 3, title: "Hacer la tarea de base de datos", completed: false },
  { id: 4, title: "Hacer la tarea de DevOps", completed: false },
  { id: 5, title: "Hacer la tarea de testing", completed: false }
];

// LOGIN - Genera la cookie de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email === "josedcm9@gmail.com" && password === "david123456") {
        res.cookie('session_id', 'user', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3600000 // 1 hora
        });
        return res.json({ message: "Sesión iniciada correctamente" });
    }
    res.status(401).json({ message: "Credenciales inválidas" });
});

// LOGOUT - borra la cookie en el servidor
app.post('/logout', (req, res) => {
    res.clearCookie('session_id', {
        httpOnly: true,
        secure: false, 
        sameSite: 'lax'
    }); 
    console.log("Sesión cerrada y cookie eliminada.");
    res.json({ message: "Sesión cerrada correctamente" });
});

// GET - obtener tareas
app.get('/tasks', (req, res) => {
    if (!req.cookies.session_id) {
        return res.status(401).json({ message: "No autorizado" });
    }
    res.json(tasks);
});

// POST - Crear tarea
app.post('/tasks', (req, res) => {
    if (!req.cookies.session_id) return res.status(401).send();
    const newTask = { id: Date.now(), title: req.body.title, completed: false };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// DELETE - Borrar tarea
app.delete('/tasks/:id', (req, res) => {
    if (!req.cookies.session_id) return res.status(401).send();
    const id = parseInt(req.params.id);
    tasks = tasks.filter(t => t.id !== id);
    res.status(204).send();
});

// PATCH - Actualizar estado
app.patch('/tasks/:id', (req, res) => {
    if (!req.cookies.session_id) return res.status(401).send();
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = req.body.completed;
        res.json(task);
    } else {
        res.status(404).send();
    }
});

app.listen(PORT, () => console.log(`Servidor activo`));