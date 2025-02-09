import express from "express";
import { getSongs, addSong, deleteSong, editedSong, getSong, getSongos, addList, getList, addSongToList, getListSongs } from "../controllers/songController.js";
const router = express.Router();

router.get("/:userId/songs", getSongs);
router.get("/:userId/lists", getList);
router.post("/:userId/songs", addSong);
router.post("/:userId/lists", addList);
router.get("/songos", getSongos);
router.delete("/:userId/songs/:songId", deleteSong);
router.put("/:userId/songs/:songId", editedSong);
router.get("/:userId/songs/:songId", getSong);
router.post("/:userId/lists/:listId/songs", addSongToList);
router.get("/:userId/lists/:listId/songs", getListSongs);

export default router;