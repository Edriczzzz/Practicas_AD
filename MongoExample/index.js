// Importar las dependencias
require('dotenv').config();
const { MongoClient } = require('mongodb');

// URI de conexión desde las variables de entorno
const uri = process.env.MONGODB_URI;

// Crear el cliente de MongoDB
const client = new MongoClient(uri);

// Función para conectar a la base de datos
async function conectarDB() {
  try {
    // Conectar al cliente
    await client.connect();
    console.log('✅ Conectado exitosamente a MongoDB Atlas');

    // Seleccionar la base de datos
    const database = client.db('miBaseDatos'); // Cambia 'miBaseDatos' por el nombre que quieras
    
    // Seleccionar una colección
    const coleccion = database.collection('usuarios'); // Cambia 'usuarios' por tu colección

    // Ejemplo: Insertar un documento
    const resultado = await coleccion.insertOne({
      nombre: 'Juan',
      edad: 25,
      email: 'juan@ejemplo.com',
      fecha: new Date()
    });
    console.log('✅ Documento insertado con ID:', resultado.insertedId);

    // Ejemplo: Leer todos los documentos
    const documentos = await coleccion.find({}).toArray();
    console.log('📄 Documentos en la colección:', documentos);

    // Ejemplo: Buscar un documento específico
    const usuario = await coleccion.findOne({ nombre: 'Juan' });
    console.log('🔍 Usuario encontrado:', usuario);

  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
  }
}

// Función para cerrar la conexión
async function cerrarConexion() {
  await client.close();
  console.log('🔌 Conexión cerrada');
}

// Ejecutar la conexión
conectarDB()
  .then(() => cerrarConexion())
  .catch(console.error);