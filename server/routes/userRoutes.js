import express from "express"
import { requireSession } from "../middleware/auth.js"
import { searchUsers } from "../controllers/userController.js"

const router = express.Router()

router.use(requireSession)
router.get("/search-users", searchUsers)

export default router
