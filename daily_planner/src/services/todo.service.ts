import Todo from "../models/todo.model";

export const findTodosByUser = async (userId: string) => {
  return Todo.find({ user_id: userId }).sort({ createdAt: -1 });
};

export const createTodoForUser = async (
  userId: string,
  data: {
    title: string;
    description?: string;
    start_date?: Date;
    due_date: Date;
  },
) => {
  return Todo.create({ user_id: userId, ...data });
};

export const findTodoByIdAndUser = async (id: string, userId: string) => {
  return Todo.findOne({ _id: id, user_id: userId }).exec();
};

export const deleteTodoByIdAndUser = async (id: string, userId: string) => {
  return Todo.findOneAndDelete({ _id: id, user_id: userId });
};
