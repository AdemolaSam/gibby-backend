import { Router } from "express";
import { authenticateJWT } from "../middlewares/jwt-verification";
import {
  createTask,
  findAllTask,
  findSingleTask,
} from "../controllers/task.controller";

const router = Router();

router.post("/", authenticateJWT, createTask);
router.get("/", authenticateJWT, findAllTask);
router.get("/:id", authenticateJWT, findSingleTask);

export default router;
