import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  id: String,
  title: String,
  artist: String,
  genre: String,
  lyrics: String,
  chords: String,
  fontSizeChords: Number,
  fontSizeLyrics: Number,
  scrollSpeedLyrics: Number,
  scrollSpeedChords: Number,
});

const userSchema = new mongoose.Schema({
  _id: String, // UID de Firebase como ID
  email: String,
  name: String,
  songs: [songSchema],
});

const User = mongoose.model("User", userSchema);

export default User;