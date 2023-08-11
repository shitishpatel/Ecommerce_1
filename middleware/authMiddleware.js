import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    console.log("decode",decode)
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.send({
        success:false,
        message:"Inavlid Token"
    })
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    // console.log("admin",req.user);
    const user = await userModel.findById(req.user.id);
    console.log(user);
    if (user.role !== 1) {
      return res.status(401).send({
        success: true,
        message: "UnAutorized...",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error in Admin Middleware",
    });
  }
};
