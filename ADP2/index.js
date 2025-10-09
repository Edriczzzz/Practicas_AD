const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Almacenamiento en memoria
let tareas = [];
let productos = [];

// ============================================
// EJERCICIO 1: Servicio de Saludo Básico
// ============================================
app.post('/saludo', (req, res) => {
  const { nombre } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es requerido' });
  }
  
  res.json({ mensaje: `Hola, ${nombre}` });
});

// ============================================
// EJERCICIO 2: Calculadora de Operaciones Básicas
// ============================================
app.post('/calcular', (req, res) => {
  const { a, b, operacion } = req.body;
  
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'Los valores a y b deben ser números' });
  }
  
  let resultado;
  
  switch (operacion) {
    case 'suma':
      resultado = a + b;
      break;
    case 'resta':
      resultado = a - b;
      break;
    case 'multiplicacion':
      resultado = a * b;
      break;
    case 'division':
      if (b === 0) {
        return res.status(400).json({ error: 'No se puede dividir por cero' });
      }
      resultado = a / b;
      break;
    default:
      return res.status(400).json({ 
        error: 'Operación no válida. Use: suma, resta, multiplicacion o division' 
      });
  }
  
  res.json({ resultado });
});

// ============================================
// EJERCICIO 3: Gestor de Tareas (CRUD Básico)
// ============================================

// POST - Crear tarea
app.post('/tareas', (req, res) => {
  const { id, titulo, completada } = req.body;
  
  if (!id || !titulo || typeof completada !== 'boolean') {
    return res.status(400).json({ 
      error: 'Se requiere id, titulo y completada (boolean)' 
    });
  }
  
  const tareaExistente = tareas.find(t => t.id === id);
  if (tareaExistente) {
    return res.status(400).json({ error: 'Ya existe una tarea con ese id' });
  }
  
  const nuevaTarea = { id, titulo, completada };
  tareas.push(nuevaTarea);
  
  res.status(201).json(nuevaTarea);
});

// GET - Listar todas las tareas
app.get('/tareas', (req, res) => {
  res.json(tareas);
});

// PUT - Actualizar una tarea
app.put('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, completada } = req.body;
  
  const tareaIndex = tareas.findIndex(t => t.id === id);
  
  if (tareaIndex === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  
  if (titulo) tareas[tareaIndex].titulo = titulo;
  if (typeof completada === 'boolean') tareas[tareaIndex].completada = completada;
  
  res.json(tareas[tareaIndex]);
});

// DELETE - Eliminar una tarea
app.delete('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tareaIndex = tareas.findIndex(t => t.id === id);
  
  if (tareaIndex === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  
  const tareaEliminada = tareas.splice(tareaIndex, 1)[0];
  res.json({ mensaje: 'Tarea eliminada', tarea: tareaEliminada });
});

// ============================================
// EJERCICIO 4: Validador de Contraseñas
// ============================================
app.post('/validar-password', (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ error: 'La contraseña es requerida' });
  }
  
  const errores = [];
  
  if (password.length < 8) {
    errores.push('La contraseña debe tener mínimo 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errores.push('La contraseña debe contener al menos una mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errores.push('La contraseña debe contener al menos una minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errores.push('La contraseña debe contener al menos un número');
  }
  
  res.json({
    esValida: errores.length === 0,
    errores
  });
});

// ============================================
// EJERCICIO 5: Conversor de Temperatura
// ============================================
app.post('/convertir-temperatura', (req, res) => {
  const { valor, desde, hacia } = req.body;
  
  if (typeof valor !== 'number') {
    return res.status(400).json({ error: 'El valor debe ser un número' });
  }
  
  const escalasValidas = ['C', 'F', 'K'];
  if (!escalasValidas.includes(desde) || !escalasValidas.includes(hacia)) {
    return res.status(400).json({ 
      error: 'Las escalas deben ser C, F o K' 
    });
  }
  
  let valorEnCelsius;
  
  // Convertir a Celsius primero
  switch (desde) {
    case 'C':
      valorEnCelsius = valor;
      break;
    case 'F':
      valorEnCelsius = (valor - 32) * 5 / 9;
      break;
    case 'K':
      valorEnCelsius = valor - 273.15;
      break;
  }
  
  // Convertir de Celsius a la escala deseada
  let valorConvertido;
  switch (hacia) {
    case 'C':
      valorConvertido = valorEnCelsius;
      break;
    case 'F':
      valorConvertido = (valorEnCelsius * 9 / 5) + 32;
      break;
    case 'K':
      valorConvertido = valorEnCelsius + 273.15;
      break;
  }
  
  res.json({
    valorOriginal: valor,
    valorConvertido: Math.round(valorConvertido * 100) / 100,
    escalaOriginal: desde,
    escalaConvertida: hacia
  });
});

// ============================================
// EJERCICIO 6: Buscador en Array
// ============================================
app.post('/buscar', (req, res) => {
  const { array, elemento } = req.body;
  
  if (!Array.isArray(array)) {
    return res.status(400).json({ error: 'Se requiere un array' });
  }
  
  const indice = array.indexOf(elemento);
  const encontrado = indice !== -1;
  const tipoElemento = typeof elemento;
  
  res.json({
    encontrado,
    indice: encontrado ? indice : -1,
    tipoElemento
  });
});

// ============================================
// EJERCICIO 7: Contador de Palabras
// ============================================
app.post('/contar-palabras', (req, res) => {
  const { texto } = req.body;
  
  if (typeof texto !== 'string') {
    return res.status(400).json({ error: 'El texto debe ser una cadena' });
  }
  
  const palabras = texto.trim().split(/\s+/).filter(p => p.length > 0);
  const palabrasUnicas = new Set(palabras.map(p => p.toLowerCase()));
  
  res.json({
    totalPalabras: palabras.length,
    totalCaracteres: texto.length,
    palabrasUnicas: palabrasUnicas.size
  });
});

// ============================================
// EJERCICIO 8: Generador de Perfiles de Usuario
// ============================================
app.post('/generar-perfil', (req, res) => {
  const { nombre, edad, intereses } = req.body;
  
  if (!nombre || typeof edad !== 'number' || !Array.isArray(intereses)) {
    return res.status(400).json({ 
      error: 'Se requiere nombre (string), edad (number) e intereses (array)' 
    });
  }
  
  let categoria;
  if (edad < 18) {
    categoria = 'junior';
  } else if (edad >= 18 && edad < 60) {
    categoria = 'senior';
  } else {
    categoria = 'veterano';
  }
  
  res.json({
    usuario: {
      nombre,
      edad,
      intereses
    },
    id: uuidv4(),
    fechaCreacion: new Date().toISOString(),
    categoria
  });
});

// ============================================
// EJERCICIO 9: Sistema de Calificaciones
// ============================================
app.post('/calcular-promedio', (req, res) => {
  const { calificaciones } = req.body;
  
  if (!Array.isArray(calificaciones) || calificaciones.length === 0) {
    return res.status(400).json({ 
      error: 'Se requiere un array de calificaciones no vacío' 
    });
  }
  
  // Validar que estén entre 0-10
  const calificacionesInvalidas = calificaciones.filter(c => c < 0 || c > 10);
  if (calificacionesInvalidas.length > 0) {
    return res.status(400).json({ 
      error: 'Todas las calificaciones deben estar entre 0 y 10' 
    });
  }
  
  const promedio = calificaciones.reduce((sum, cal) => sum + cal, 0) / calificaciones.length;
  const calificacionMasAlta = Math.max(...calificaciones);
  const calificacionMasBaja = Math.min(...calificaciones);
  const estado = promedio >= 6 ? 'aprobado' : 'reprobado';
  
  res.json({
    promedio: Math.round(promedio * 100) / 100,
    calificacionMasAlta,
    calificacionMasBaja,
    estado
  });
});

// ============================================
// EJERCICIO 10: API de Productos con Filtros
// ============================================

// POST - Agregar producto
app.post('/productos', (req, res) => {
  const { nombre, categoria, precio } = req.body;
  
  if (!nombre || !categoria || typeof precio !== 'number') {
    return res.status(400).json({ 
      error: 'Se requiere nombre, categoria y precio (number)' 
    });
  }
  
  const nuevoProducto = {
    id: productos.length + 1,
    nombre,
    categoria,
    precio
  };
  
  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

// GET - Obtener productos con filtros
app.get('/productos', (req, res) => {
  const { categoria, precioMin, precioMax } = req.query;
  
  let productosFiltrados = [...productos];
  
  if (categoria) {
    productosFiltrados = productosFiltrados.filter(
      p => p.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }
  
  if (precioMin) {
    const min = parseFloat(precioMin);
    productosFiltrados = productosFiltrados.filter(p => p.precio >= min);
  }
  
  if (precioMax) {
    const max = parseFloat(precioMax);
    productosFiltrados = productosFiltrados.filter(p => p.precio <= max);
  }
  
  res.json(productosFiltrados);
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Aplicaciones Distribuidas - Práctica de Repaso',
    endpoints: [
      'POST /saludo',
      'POST /calcular',
      'POST /tareas',
      'GET /tareas',
      'PUT /tareas/:id',
      'DELETE /tareas/:id',
      'POST /validar-password',
      'POST /convertir-temperatura',
      'POST /buscar',
      'POST /contar-palabras',
      'POST /generar-perfil',
      'POST /calcular-promedio',
      'POST /productos',
      'GET /productos'
    ]
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Endpoints disponibles:`);
  console.log(`   POST http://localhost:${PORT}/saludo`);
  console.log(`   POST http://localhost:${PORT}/calcular`);
  console.log(`   POST http://localhost:${PORT}/tareas`);
  console.log(`   GET  http://localhost:${PORT}/tareas`);
  console.log(`   POST http://localhost:${PORT}/validar-password`);
  console.log(`   POST http://localhost:${PORT}/convertir-temperatura`);
  console.log(`   Y más...`);
});