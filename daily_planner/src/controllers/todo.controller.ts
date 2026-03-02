import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";
import { AppError } from "../utils/AppError";
import {
  findTodosByUser,
  createTodoForUser,
  findTodoByIdAndUser,
  deleteTodoByIdAndUser,
} from "../services/todo.service";

// GET all todos for current user
export const getTodos = async (req: AuthRequest, res: Response) => {
  const todos = await findTodosByUser(req.userId!);
  return res.status(200).json({ success: true, todos });
};

// CREATE a new todo
export const createTodo = async (req: AuthRequest, res: Response) => {
  const { title, description, start_date, due_date } = req.body;

  if (!title) throw new AppError("Title is required.", 400);
  if (!due_date) throw new AppError("Due date is required.", 400);

  const todo = await createTodoForUser(req.userId!, {
    title,
    description,
    start_date,
    due_date,
  });

  return res.status(201).json({ success: true, todo });
};

// UPDATE a todo
export const updateTodo = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { title, description, start_date, due_date, completed } = req.body;

  const todo = await findTodoByIdAndUser(id, req.userId!);
  if (!todo) throw new AppError("Todo not found.", 404);

  if (title !== undefined) todo.title = title;
  if (description !== undefined) todo.description = description;
  if (start_date !== undefined) todo.start_date = start_date;
  if (due_date !== undefined) todo.due_date = due_date;
  if (completed !== undefined) todo.completed = completed;

  await todo.save();

  return res.status(200).json({ success: true, todo });
};

// DELETE a todo
export const deleteTodo = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;

  const todo = await deleteTodoByIdAndUser(id, req.userId!);
  if (!todo) throw new AppError("Todo not found.", 404);

  return res.status(200).json({ success: true, message: "Todo deleted." });
};
