import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 7000;

// ===== Connect to DB ===== //
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Connected to mongodb`);
} catch (error) {
  console.error(error);
}

app.use(express.json());
app.use('/api/user', userRouter);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to my API</h1>");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
