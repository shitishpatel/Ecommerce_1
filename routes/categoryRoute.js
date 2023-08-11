import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {  categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/categoryController.js";

const router=express.Router();

router.post('/create-category',requireSignIn,isAdmin,createCategoryController);

router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController)


router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryController)

router.get('/get-category',categoryController)

router.get('/single-category/:slug',singleCategoryController)

export default router;