const express = require('express');
const router = express.Router();
const Task = require('../models/tasks');

let tasks = [
    { id: 1, title: "Aprender Node.js", completed: false },
    { id: 2, title: "Configurar Express", completed: true },
]

router.get('/tasks', async (req, res) => {
    try {
    const tasks = await Task.find();
    res.json(tasks);
    } catch (error) {
    res.status(500).json({ error: 'Error al obtener tareas'
});
}
});

router.post('/tasks', async (req, res) => {
    try{
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "El título es obligatorio" });
    const newTask = new Task({ title});
    await newTask.save();
    res.json(newTask);
    } catch (error) {
    res.status(500).json({ error: 'Error al crear tarea' });
}
});

router.put('/tasks/:id', async (req, res) => {
    try{
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

    task.completed = !task.completed;
    await task.save();
    res.json(task);
}
    catch (error) {
        res.status(500).json({ error: 'Error al actualizar tarea' });
    }
});

router.delete('/tasks/:id', async (req, res) => {
    try{
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Tarea eliminada" });
    } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tarea' });
}
});

module.exports = router;