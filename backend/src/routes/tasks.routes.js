const express = require('express');
const router = express.Router();
const Task = require('../models/tasks');
const authMiddleware = require('../middleware/auth.middleware');
const OpenAI = require("openai");

async function clasificarTarea(descripcion) {
    console.log("Entrando en clasificarTarea con:", descripcion);
  const prompt = `Clasifica la siguiente tarea en las siguientes opciones y devuelve SOLO un JSON válido, sin explicaciones.

  Reglas de clasificación:

  Categoría:
    - "trabajo": proyectos, oficina, reuniones, informes, correos, jefes.
    - "estudios": exámenes, deberes, universidad, clases.
    - "compras": comprar, adquirir, supermercado, farmacia, productos.
    - "citas": citas médicas, citas personales, reuniones sociales.
    - "otros": si no encaja en lo anterior.

  Prioridad:
  - "alta": si incluye palabras como "urgente", "urgentemente", "importante", "ya", "inmediato", o indica una fecha cercana como "hoy", "mañana", "esta semana".
  - "media": tareas normales sin urgencia explícita.
  - "baja": opcionales, sin límite de tiempo, ocio.

  Ejemplos:
    Tarea: "Ir al supermercado a comprar leche urgente"
    → {"categoria": "compras", "prioridad": "alta"}

  Tarea: "Estudiar para el examen de matemáticas"
    → {"categoria": "estudios", "prioridad": "media"}

  Tarea: "Concertar cita médica urgente para el estómago"
    → {"categoria": "citas", "prioridad": "alta"}

  Ahora clasifica:
  Tarea: "${descripcion}"`;

try {
  console.log("Llamando a OpenAI...");
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    response_format: { type: "json_object" }
  });

  console.log("Respuesta IA:", response.choices[0].message?.content); 
  const { categoria, prioridad } = JSON.parse(response.choices[0].message?.content || "{}");
  return { categoria, prioridad };
} catch (error) {
  console.error("Error en IA:", error.message);
  return { categoria: "otros", prioridad: "media" };
}
}

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
    if (!title) return res.status(400).json({ error: "El título es obligatorio" });

    const { categoria, prioridad } = await clasificarTarea(title);

    const task = new Task({
      title,
      completed: false,
      userId: req.userId,
      categoria,
      prioridad
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
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

router.delete('/tasks/:id', authMiddleware, async (req, res) => {
    try{
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Tarea eliminada" });
    } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tarea' });
}
});

module.exports = router;