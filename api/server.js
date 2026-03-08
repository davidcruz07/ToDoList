const express = require('express'); 
const cors = require('cors'); 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let tasks = [
  { id: 1, title: "Hacer la tarea de frontendddd", completed: false },
  { id: 2, title: "Hacer la tarea de backend", completed: false },
  { id: 3, title: "Hacer la tarea de base de datos", completed: false },
  { id: 4, title: "Hacer la tarea de DevOps", completed: false },
  { id: 5, title: "Hacer la tarea de testing", completed: false }
];

// GET - para obtener todas las tareas del arreglo.
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// POST -para crear nuevas tareas y agregarlas al arreglo
app.post('/tasks', (req, res) => {
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    completed: req.body.completed || false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// DELETE - para eliminar las tareas del arreglo por id
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id); 
  res.status(204).send();
});

// PATCH - para actualizar el estado de las tareas por id
app.patch('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = req.body.completed;
    res.json(task);
  } else {
    res.status(404).json({ message: 'Tarea no encontrada' });
  }
});

// para iniciar el servidor
app.listen(PORT, () => {
  console.log(`To Do List API corriendo en http://localhost:${PORT}`);
});

