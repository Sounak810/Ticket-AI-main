import bcrypt from "bcrypt"
import User from "../models/user.models.js"
import {inngest} from "../inngest/client.js"
import { ACCESS_COOKIE_NAME, getCookieOptions, signAccessToken } from "../utils/auth.js"

export const signup= async(req,res)=>{
    const {email,password,skills=[]}=req.body
    try {
        const hashedPassword= await bcrypt.hash(password,10)
        const user= await User.create({email,password:hashedPassword,skills})

        if (process.env.INNGEST_ENABLED !== "false") {
          await inngest.send({
            name:"user/signup",
            data:{
              email:user.email,
            }
          })
        }

        const token= signAccessToken({id:user._id, role:user.role})
        res.cookie(ACCESS_COOKIE_NAME, token, {
          ...getCookieOptions(),
          maxAge: 1000 * 60 * 60, // 1h
        });
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(201).json({user:userResponse})

    } catch (error) {
      if (error?.code === 11000 && error?.keyPattern?.email) {
        return res.status(409).json({ error: "email already registered" })
      }
        res.status(500).json({error:"signup failed"})
    }
}

export const login= async(req,res)=>{
    const {email,password}=req.body
    try {
        const user= await User.findOne({email})
        if(!user) return res.status(401).json({error:"invalid credentials"})

        const isMatch= await bcrypt.compare(password,user.password)
        if(!isMatch) return res.status(401).json({error:"invalid credentials"})

        const token= signAccessToken({id:user._id, role:user.role})
        res.cookie(ACCESS_COOKIE_NAME, token, {
          ...getCookieOptions(),
          maxAge: 1000 * 60 * 60, // 1h
        });
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(200).json({user:userResponse})

    } catch (error) {
        res.status(500).json({error:"login failed"})
    }
}

export const logout=async (req,res)=>{
  try {
    res.clearCookie(ACCESS_COOKIE_NAME, getCookieOptions());
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
}

export const updateUser = async (req, res) => {
  const { skills = [], role, email } = req.body;
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    await User.updateOne(
      { email },
      { skills, role }
    );
    return res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
};


export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    
    return res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to get user" });
  }
};

export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const users = await User.find().select("-password");
    return res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to get users" });
  }
};

// signup
// event = {
//     data: {
//         email: "user@example.com"
//     }
// }

// inngest toggle flow from onSignup fnc



// logout --
// the jwt is stateless meaning,if someone has the jwt,ha can always be logged in
// unless the cookies are cleared or the token is revoked