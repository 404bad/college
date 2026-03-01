import mongoose from "mongoose";

export interface ITodo extends mongoose.Document {
  user_id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  completed: boolean;
  start_date: Date;
  due_date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new mongoose.Schema<ITodo>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USERS",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    completed: { type: Boolean, default: false },
    start_date: { type: Date, default: Date.now },
    due_date: { type: Date, required: true },
  },
  { timestamps: true },
);

const Todo = mongoose.model<ITodo>("TODOS", todoSchema);

export default Todo;
