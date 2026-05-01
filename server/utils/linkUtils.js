import { KJUR } from "jsrsasign"
import { v4 as uuidv4 } from "uuid"
import { admin, defaultDatabase } from "../utils/firebaseAdmin.js"
import e from "express"

const { JWT_SECRET_KEY, APP_URL } = process.env

export async function generateInviteLink(
  title,
  email,
  encryptedData,
  meetingSalt,
  expiresAt,
) {
  console.log("[generateInviteLink] Generating invite link for:", email)
  const code = await generateInviteCode(
    title,
    email,
    encryptedData,
    meetingSalt,
    expiresAt,
  )
  const inviteLink = `${APP_URL}/meeting?code=${code}`
  console.log("[generateInviteLink] Invite link generated:", inviteLink)
  return inviteLink
}

export const generateInviteCode = async (
  title,
  email,
  encryptedData,
  meetingSalt,
  expiresAt,
) => {
  const code = uuidv4().slice(0, 8).toUpperCase()
  console.log("[generateInviteCode] Generated code:", code)

  const inviteToken = generateInviteJWT(encryptedData, meetingSalt, expiresAt)
  console.log("[generateInviteCode] Invite JWT generated")

  try {
    await defaultDatabase.collection("invites").doc(code).set({
      code,
      meetingTitle: title,
      invitee: email,
      token: inviteToken,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(new Date(expiresAt * 1000)),
    })
    console.log(
      "[generateInviteCode] Invite doc saved to Firestore for:",
      email,
    )
  } catch (error) {
    console.error(
      "[generateInviteCode] Failed to save invite doc to Firestore:",
      error,
    )
    throw error
  }

  return code
}

export const generateInviteJWT = (
  encryptedData,
  meetingSalt,
  expiresAt,
  role = 0,
) => {
  console.log("[generateInviteJWT] Generating JWT with expiresAt:", expiresAt)
  const iat = Math.floor(Date.now() / 1000)
  const exp = expiresAt

  const oHeader = { alg: "HS256", typ: "JWT" }
  const oPayload = {
    encryptedData,
    meetingSalt,
    role,
    iat,
    exp,
  }

  const sHeader = JSON.stringify(oHeader)
  const sPayload = JSON.stringify(oPayload)
  const sJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, JWT_SECRET_KEY)
  console.log("[generateInviteJWT] JWT signed successfully")
  return sJWT
}

export function verifyInviteJWT(token) {
  console.log("[verifyInviteJWT] Verifying JWT")
  try {
    const decoded = KJUR.jws.JWS.parse(token)
    const isValid = KJUR.jws.JWS.verifyJWT(token, JWT_SECRET_KEY, {
      alg: ["HS256"],
    })

    if (isValid) {
      const { encryptedData, role, meetingSalt } = JSON.parse(decoded.payloadPP)
      console.log("[verifyInviteJWT] JWT verified successfully, role:", role)
      return { encryptedData, role, meetingSalt }
    } else {
      console.warn("[verifyInviteJWT] JWT verification failed — invalid token")
      return null
    }
  } catch (error) {
    console.error("[verifyInviteJWT] Error verifying JWT:", error)
    return null
  }
}
