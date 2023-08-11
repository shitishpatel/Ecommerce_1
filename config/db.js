import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connect Db");
  } catch (err) {
    console.log("mongoDb Connect error");
  }
};

export default connectDB;
