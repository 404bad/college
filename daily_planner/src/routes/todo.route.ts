import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "src/controllers/todo.controller";
import { authMiddleware } from "src/middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
