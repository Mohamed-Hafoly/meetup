import express from "express"
import { requireSession } from "../middleware/auth.js"
import {
  signUp,
  signIn,
  validateSession,
  logout,
  updateUserProfile,
} from "../controllers/authController.js"

const router = express.Router()

router.get("/validate-session", validateSession)
router.post("/signin", signIn)
router.post("/signup", signUp)

router.post("/logout", requireSession, logout)
router.post("/update-profile", requireSession, updateUserProfile)


export default router