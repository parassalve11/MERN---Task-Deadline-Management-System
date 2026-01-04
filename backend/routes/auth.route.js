import { Router } from "express";
import { getAllInterns, getCurrentUser, signIn, signOut, signUp } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";




const router = Router();



router.get('/users',protectRoute,getAllInterns);
router.post('/signup',signUp)
router.post('/signin',signIn)
router.post('/signout',signOut)
router.get('/me',protectRoute,getCurrentUser);



export default router