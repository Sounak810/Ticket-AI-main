import express from "express";
import {signup,login,logout, updateUser, getUser, getUsers} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import {
  loginBodySchema,
  signupBodySchema,
  updateUserBodySchema,
} from "../validators/user.validators.js";

const router=express.Router();

router.post("/update-user",authenticate, validateBody(updateUserBodySchema), updateUser)
router.get("/user",authenticate, getUser)
router.get("/users",authenticate, getUsers)

router.post("/signup", validateBody(signupBodySchema), signup)
router.post("/login", validateBody(loginBodySchema), login)
router.post("/logout",logout)

export default router;