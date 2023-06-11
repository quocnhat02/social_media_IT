import express from "express";
import { createComment, deleteComment, likeComment, unLikeComment, updateComment } from "../controllers/comment.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Create
router.post("/", verifyToken, createComment);
router.get("/comment/:id", verifyToken, updateComment)
router.get("/comment/:id/like", verifyToken, likeComment)
router.get("/comment/:id/unlike", verifyToken, unLikeComment)
router.get("/comment/:id", verifyToken,deleteComment )

export default router;
