import User from "../models/userModel.js";

// Obtener todas las canciones de un usuario
export const getSongs = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user.songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getList = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user.lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSongos = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.json({"hola":"hola"})
};

// Agregar una canción a un usuario (usando el id que viene del frontend)
export const addSong = async (req, res) => {
  try {
    const { userId } = req.params;
    const newSong = req.body; // Se asume que `id` ya viene en `req.body`

    let user = await User.findOne({ _id: userId });
    if (!user) {
      user = new User({ _id: userId, email: "", name: "", songs: [], lists: [] });
    }

    user.songs.push(newSong);
    await user.save();

    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addList = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, id } = req.body;

    let user = await User.findOne({ _id: userId });

    if (!user) {
      user = new User({ _id: userId, email: "", name: "", songs: [], lists: [] });
    }
    
    user.lists = user.lists || [];

    // Crear nueva lista
    const list = { id, name, songIds: [] };
    user.lists.push(list);

    await user.save();

    console.log("✅ Lista agregada correctamente:", list);
    res.status(201).json(list);
  } catch (error) {
    console.error("❌ Error en el backend:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una canción de un usuario
export const deleteSong = async (req, res) => {
  try {
    const { userId, songId } = req.params;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { songs: { id: songId } } }, // Elimina la canción con ese ID
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Canción eliminada correctamente", songs: updatedUser.songs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Editar una canción de un usuario
export const editedSong = async (req, res) => {
  try {
    const { userId, songId } = req.params;
    const updatedSongData = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "songs.id": songId },
      { $set: { "songs.$": updatedSongData } }, // Se actualiza sin sobrescribir el id
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario o canción no encontrados" });
    }

    const updatedSong = updatedUser.songs.find(song => song.id === songId);
    res.status(200).json(updatedSong);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una canción específica de un usuario
export const getSong = async (req, res) => {
  try {
    const { userId, songId } = req.params;

    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const song = user.songs.find(song => song.id === songId);
    if (!song) return res.status(404).json({ message: "Canción no encontrada" });

    res.json(song);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addSongToList = async (req, res) => {
  try {
    const { userId, listId } = req.params;
    const { songId } = req.body;

    console.log("📌 Recibida solicitud para agregar canción a lista");
    console.log("🔹 userId:", userId);
    console.log("🔹 listId:", listId);
    console.log("🔹 songId:", songId);

    // Buscar usuario
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Buscar la lista dentro del usuario
    const list = user.lists.find(list => list.id === listId);
    if (!list) return res.status(404).json({ message: "Lista no encontrada" });

    // Verificar si la canción ya está en la lista
    if (list.songIds.includes(songId)) {
      return res.status(400).json({ message: "La canción ya está en la lista" });
    }

    // Agregar la canción a la lista
    list.songIds.push(songId);

    // Notificar a MongoDB que `lists` cambió
    user.markModified("lists");
    await user.save();

    console.log("✅ Canción agregada correctamente a la lista");
    res.status(200).json(list);
  } catch (error) {
    console.error("❌ Error en el backend:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getListSongs = async (req, res) => {
  try {
    const { userId, listId } = req.params;

    // Buscar el usuario en la base de datos
    const user = await User.findById(userId).populate("songs");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Buscar la lista dentro del usuario
    const list = user.lists.find((l) => l.id === listId);

    if (!list) {
      return res.status(404).json({ error: "Lista no encontrada" });
    }

    // Filtrar las canciones usando los songIds guardados en la lista
    const songs = user.songs.filter((song) => list.songIds.includes(song.id));

    // Enviar la respuesta con todos los datos de cada canción
    res.json({songs:songs, list:list});
  } catch (error) {
    console.error("Error obteniendo canciones de la lista:", error);
    res.status(500).json({ error: error.message });
  }
};