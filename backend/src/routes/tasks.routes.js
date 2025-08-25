const express = require('express');
const router = express.Router();
const Task = require('../models/tasks');
const authMiddleware = require('../middleware/auth.middleware');

let tasks = [
    { id: 1, title: "Aprender Node.js", completed: false },
    { id: 2, title: "Configurar Express", completed: true },
]

router.get('/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

router.post('/tasks', authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title, completed: false, userId: req.userId });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
});

router.put('/tasks/:id', authMiddleware, async (req, res) => {
  try {
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