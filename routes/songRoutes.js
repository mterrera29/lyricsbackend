import express from "express";
import { getSongs, addSong, deleteSong, editedSong, getSong, getSongos } from "../controllers/songController.js";
const router = express.Router();

router.get("/:userId/songs", getSongs);
router.get("/songos", getSongos);
router.post("/:userId/songs", addSong);
router.delete("/:userId/songs/:songId", deleteSong);
router.put("/:userId/songs/:songId", editedSong);
router.get("/:userId/songs/:songId", getSong);

export default router;