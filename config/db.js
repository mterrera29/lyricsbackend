import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🔥 Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error de conexión:", error);
    process.exit(1); // Detiene la ejecución si falla la conexión
  }
};

export default connectDB;