import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import songRoutes from './routes/songRoutes.js';
import verifyToken from './middlewares/verifyToken.js';

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
connectDB();

const app = express();

// Configuración de CORS mejorada
//const corsOptions = {
//  origin: process.env.FRONTEND_URL || "*", // Asegurar que solo el frontend permitido acceda
//  methods: "GET,POST,PUT,DELETE",
//  allowedHeaders: "Content-Type,Authorization",
//  credentials: true, // Permitir cookies/tokens si usas autenticación
//  optionsSuccessStatus: 204,
//};

//app.use(cors(corsOptions));
app.use(
  cors({
    origin: '*', // o 'http://localhost:5173' para más seguridad
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
//app.options('*', cors(corsOptions)); // Manejar preflight requests

// Middleware para parsear JSON
app.use(express.json());

// Rutas de canciones
app.use('/users', verifyToken, songRoutes);

// Puerto dinámico para Railway
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`)
);
