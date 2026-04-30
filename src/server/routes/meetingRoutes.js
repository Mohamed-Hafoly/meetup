import express from "express"
import { requireSession } from "../middleware/auth.js"
import {
  createMeeting,
  hostJoin,
  participantJoin,
  sendInvites,
  currentHost,
  deleteMeeting,
} from "../controllers/meetingController.js"

const router = express.Router()

router.use(requireSession)

router.post("/create-meeting", createMeeting)

router.get("/host-join", hostJoin)
router.post("/participant-join", participantJoin)

router.post("/send-invites", sendInvites)
router.get("/current-host", currentHost)

router.delete("/:sessionName", deleteMeeting)

export default router
