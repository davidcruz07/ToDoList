const express = require('express'); 
const cors = require('cors'); 
const app = express();
const PORT = 3000; // puerto en el que va a correr el servidor

app.use(cors()); // Permite que el Front se comunique con el Back
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
  const id = parseInt(req.params.id); // Obtener el ID de la tarea a eliminar
  tasks = tasks.filter(t => t.id !== id); // Eliminar la tarea del arreglo
  res.status(204).send(); // Responder con 204 No Content para indicar que la eliminación fue exitosa
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`To Do List API corriendo en http://localhost:${PORT}`);
});

