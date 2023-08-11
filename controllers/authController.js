import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address,answer } = req.body;

    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!phone) {
      return res.send({ message: "Phone is required" });
    }
    if (!address) {
      return res.send({ message: "Address is required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is required" });
    }

    // Check User
    const existingUser = await userModel.findOne({ email });
    // existing User
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User Already Exists Please Login...",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer
    }).save();
    

    res.status(201).send({
      success: true,
      message: "User Registered Successfully!!!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send({
        success: false,
        message: "Invalid email and password",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.send({
        success: false,
        message: "User Not Found",
      });
    }

    const data = await comparePassword(password, user.password);

    if (!data) {
      return res.send({
        success: false,
        message: "Wrong Password",
        data,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.send({
      success: true,
      message: "Login Successfully",
      user: {
        id:user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role:user.role
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};


export const forgotPasswordController=async (req,res)=>{
  try{
    const {email,newPassword,answer}=req.body;

    if(!email){
      return res.send({message:"Email is required"})
    }
    if(!answer){
      return res.send({message:"answer is required"})
    }
    if(!newPassword){
      return res.send({message:"password is required"})
    }

    const user= await userModel.findOne({email,answer});

    if(!user){
      return res.send({success:false,message:"Wrong Email and Password"})
    } 

    const hashed=await hashPassword(newPassword);

    await userModel.findByIdAndUpdate(user._id,{password:hashed});
    res.status(200).send({
      success:true,
      message:"Password Reset Successfully"
    })


  }catch(error){
    console.log(error);
    return res.status(500).send({
      success:false,
      message:"Something went wrong...",
      error
    })
  }

}

export const testController = (req,res)=>{
    res.send("Protected Route....")
}


export const updateProfileController = async (req,res)=>{
  try{
    const {name,email,password,address,phone}=req.body;
    const user = await userModel.findById(req.user.id);
    if(password && password.length <6){
      return res.json({error:"Password is required and 6 character long"});
    }
    const hashedPassword= password ? await hashPassword(password):undefined;
    const updatedUser=await userModel.findByIdAndUpdate(req.user.id,{
      name:name || user.name,
      password:hashedPassword || user.password,
      phone:phone || user.phone,
      address: address || user.address,
    },{new : true})
    res.status(200).send({
      success:true,
      message:"profile updated successfuly",
      updatedUser
    })
  }catch(error){
    console.log(error);
    res.status(400).send({
      message:"Error while updating user",
      success:false,
      error
    })
  }
} 


export const getOrderController = async(req,res)=>{
  try{
    const orders= await orderModel.find({buyer:req.user.id}).populate("products","-photo").populate("buyer","name");
    res.json(orders);
  }catch(error){
    console.log(error);
    res.status(500).send({
      success:false,
      message:'Error While Getting Orders',
      error
    })
  }
}


export const getAllOrderController = async(req,res)=>{
  try{
    const orders= await orderModel.find({}).populate("products","-photo").populate("buyer","name").sort({createdAt:"-1"});
    res.json(orders);
  }catch(error){
    console.log(error);
    res.status(500).send({
      success:false,
      message:'Error While Getting Orders',
      error
    })
  }
}

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};