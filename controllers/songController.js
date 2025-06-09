import User from '../models/userModel.js';

// Función auxiliar para CORS
const setCORSHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

export const getSongs = async (req, res) => {
  setCORSHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user.songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getList = async (req, res) => {
  setCORSHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user.lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSongos = async (req, res) => {
  setCORSHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  res.json({ hola: 'hola' });
};

export const addSong = async (req, res) => {
  setCORSHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { userId } = req.params;
    const newSong = req.body;

    let user = await User.findOne({ _id: userId });
    if (!user) {
      user = new User({
        _id: userId,
        email: '',
        name: '',
        songs: [],
        lists: [],
      });
    }

    user.songs.push(newSong);
    await user.save();
    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addList = async (req, res) => {
  setCORSHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { userId } = req.params;
    const { name, id } = req.body;

    let user = await User.findOne({ _id: userId });
    if (!user) {
      user = new User({
        _id: userId,
        email: '',
        name: '',
        songs: [],
        lists: [],
      });
    }

    user.lists = user.lists || [];
    const list = { id, name, songIds: [] };
    user.lists.push(list);
    await user.save();

    console.log('✅ Lista agregada correctamente:', list);
    res.status(201).json(list);
  } catch (error) {
    console.error('❌ Error en el backend:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteSong = async (req, res) => {
  setCORSHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { userId, songId } = req.params;
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { songs: { id: songId } } },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({
      message: 'Canción eliminada correctamente',
      songs: updatedUser.songs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editedSong = async (req, res) => {
  setCORSHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { userId, songId } = req.params;
    const updatedSongData = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, 'songs.id': songId },
      { $set: { 'songs.$': updatedSongData } },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: 'Usuario o canción no encontrados' });
    }

    const updatedSong = updatedUser.songs.find((song) => song.id === songId);
    res.status(200).json(updatedSong);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSong = async (req, res) => {
  setCORSHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { userId, songId } = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    const song = user.songs.find((song) => song.id === songId);
    if (!song)
      return res.status(404).json({ message: 'Canción no encontrada' });

    res.json(song);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addSongToList = async (req, res) => {
  setCORSHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { userId, listId } = req.params;
    const { songId } = req.body;

    let user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    const list = user.lists.find((list) => list.id === listId);
    if (!list) return res.status(404).json({ message: 'Lista no encontrada' });

    if (list.songIds.includes(songId)) {
      return res
        .status(400)
        .json({ message: 'La canción ya está en la lista' });
    }

    list.songIds.push(songId);
    user.markModified('lists');
    await user.save();

    console.log('✅ Canción agregada correctamente a la lista');
    res.status(200).json(list);
  } catch (error) {
    console.error('❌ Error en el backend:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getListSongs = async (req, res) => {
  setCORSHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { userId, listId } = req.params;
    const user = await User.findById(userId).populate('songs');

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const list = user.lists.find((l) => l.id === listId);
    if (!list) return res.status(404).json({ error: 'Lista no encontrada' });

    const songs = user.songs.filter((song) => list.songIds.includes(song.id));
    res.json({ songs: songs, list: list });
  } catch (error) {
    console.error('Error obteniendo canciones de la lista:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteList = async (req, res) => {
  setCORSHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { userId, listId } = req.params;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { lists: { id: listId } } },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({
      message: 'Lista eliminada correctamente',
      lists: updatedUser.lists,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeSongFromList = async (req, res) => {
  setCORSHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { userId, listId, songId } = req.params;

    let user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    const list = user.lists.find((list) => list.id === listId);
    if (!list) return res.status(404).json({ message: 'Lista no encontrada' });

    if (!list.songIds.includes(songId)) {
      return res
        .status(400)
        .json({ message: 'La canción no está en la lista' });
    }

    list.songIds = list.songIds.filter((id) => id !== songId);
    user.markModified('lists');
    await user.save();

    console.log('✅ Canción eliminada correctamente de la lista');
    res.status(200).json({ message: 'Canción eliminada', list });
  } catch (error) {
    console.error('❌ Error en el backend:', error.message);
    res.status(500).json({ error: error.message });
  }
};
