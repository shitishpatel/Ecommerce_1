import express from "express";

import  {registerController,loginController,testController, forgotPasswordController, updateProfileController, getOrderController, getAllOrderController, orderStatusController}  from "../controllers/authController.js";
import { requireSignIn ,isAdmin} from "../middleware/authMiddleware.js";


const router=express.Router();


router.post('/register',registerController);
router.post('/login',loginController);
router.post('/forgot-password',forgotPasswordController)

router.get('/test', requireSignIn,isAdmin,testController);

// proected route auth
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
})

router.get('/admin-auth',requireSignIn, isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
})


router.put('/profile',requireSignIn,
updateProfileController);


router.get('/orders',requireSignIn,getOrderController);
router.get('/all-orders',requireSignIn,isAdmin,getAllOrderController);
router.put('/order-status/:orderId',requireSignIn,isAdmin,orderStatusController);

export default router;