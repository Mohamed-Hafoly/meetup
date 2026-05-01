import { KJUR } from "jsrsasign"
import { defaultDatabase } from "./firebaseAdmin.js"

const { VIDEO_SDK_KEY, VIDEO_SDK_SECRET } = process.env

export const getMeetingDoc = async (sessionName) => {
  const meetingRef = defaultDatabase.collection("meetings").doc(sessionName)
  const meetingDoc = await meetingRef.get()
  if (!meetingDoc.exists) throw new Error("Meeting not found")
  return { meetingRef, meetingData: meetingDoc.data() }
}

export const generateMeetingJWT = (sessionName, role) => {
  console.log(
    "[generateMeetingJWT] Generating JWT for sessionName:",
    sessionName,
    "role:",
    role,
  )
  const iat = Math.floor(Date.now() / 1000) - 30
  const exp = iat + 60 * 60 * 24

  const payload = {
    app_key: VIDEO_SDK_KEY,
    tpc: sessionName,
    role_type: role,
    version: 1,
    iat,
    exp,
  }

  const token = KJUR.jws.JWS.sign(
    "HS256",
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
    JSON.stringify(payload),
    VIDEO_SDK_SECRET,
  )

  console.log("[generateMeetingJWT] JWT generated successfully:", token)
  return token
}
