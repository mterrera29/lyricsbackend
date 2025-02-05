import axios from "axios";
import jwt from "jsonwebtoken";

// URL pública de Firebase para obtener la clave
const FIREBASE_PUBLIC_KEY_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

// Middleware para verificar el token de Firebase
const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // El token viene en formato "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "No se ha proporcionado el token de autenticación" });
  }

  try {
    // Obtener la clave pública de Firebase
    const response = await axios.get(FIREBASE_PUBLIC_KEY_URL);
    const publicKeys = response.data;

    // Decodificar el header del token JWT para obtener el 'kid' (key ID)
    const decodedHeader = jwt.decode(token, { complete: true })?.header;
    if (!decodedHeader || !decodedHeader.kid) {
      return res.status(401).json({ error: "Token mal formado" });
    }

    // Buscar la clave pública de Firebase correspondiente al 'kid' (key ID)
    const publicKey = publicKeys[decodedHeader.kid];
    if (!publicKey) {
      return res.status(401).json({ error: "Clave pública no encontrada para el token" });
    }

    // Verificar el token usando la clave pública
    jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: "Token inválido o expirado" });
      }

      // Adjuntar el usuario decodificado a la solicitud
      req.user = decodedToken;
      next();
    });
  } catch (error) {
    console.error("❌ Error al verificar el token:", error);
    return res.status(401).json({ error: "Error al verificar el token" });
  }
};

export default verifyToken;