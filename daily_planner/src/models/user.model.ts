import mongoose from "mongoose";

export type Gender = "male" | "female" | "other";

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  fullname: string;
  email: string;
  phone?: string;
  gender: Gender;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
    fullname: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    avatar: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.avatar) {
    this.avatar = `https://api.dicebear.com/9.x/notionists/svg?seed=${this.username}`;
  }
});

const User = mongoose.model<IUser>("USERS", userSchema);
export default User;
