const express = require('express');
const router = express.Router();

let tasks = [
    { id: 1, title: "Aprender Node.js", completed: false },
    { id: 2, title: "Configurar Express", completed: true },
]

router.get('/tasks', (req, res) => {
    res.json(tasks);
});

router.post('/tasks', (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "El título es obligatorio" });
    const newTask = { id: tasks.length + 1, title, completed: false };
    tasks.push(newTask);
    res.json(newTask);
});

router.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const task = tasks.find(t => t.id == id);
    if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

    task.completed = !task.completed;
    res.json(task);
});

router.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter(t => t.id != id);
    res.json({ message: "Tarea eliminada" });
});

module.exports = router;