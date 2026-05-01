import { admin, defaultDatabase } from "../utils/firebaseAdmin.js"
import { createEmailInvitations } from "../utils/emailUtils.js"
import { aesEncrypt } from "../utils/cryptoUtils.js"
import { generateInviteLink } from "../utils/linkUtils.js"

export const sendMeetingInvitations = async (meetingDetails) => {
  const {
    title,
    host,
    sessionName,
    invitees,
    meetingSalt,
    createdAt,
    expiresAt,
  } = meetingDetails
  console.log("[sendMeetingInvitations] Starting with:", {
    title,
    host,
    sessionName,
    inviteeCount: invitees?.length,
  })

  const errors = []

  if (!invitees) {
    errors.push("invitees array is missing")
  } else if (!Array.isArray(invitees)) {
    errors.push("invitees must be an array")
  }

  if (!title) errors.push("title is missing")
  if (!host) errors.push("host is missing")
  if (!sessionName) errors.push("sessionName is missing")
  if (!meetingSalt) errors.push("meetingSalt is missing")

  if (errors.length > 0) {
    console.warn("[sendMeetingInvitations] Validation failed:", errors)
    return {
      success: false,
      message: "Validation failed",
      errors,
      received: {
        invitees: invitees ?? null,
        title: title ?? null,
        host: host ?? null,
        sessionName: sessionName ?? null,
        meetingSalt: meetingSalt ?? null,
      },
    }
  }

  try {
    console.log(
      "[sendMeetingInvitations] Fetching host display name for:",
      host,
    )
    const hostDoc = await defaultDatabase.collection("users").doc(host).get()
    const hostName = hostDoc.data()?.name
    console.log(
      "[sendMeetingInvitations] Host display name resolved:",
      hostName,
    )

    const sendInvitesPromises = invitees.map(async (invitee) => {
      const email = invitee.email
      console.log("[sendMeetingInvitations] Processing invitee:", email)

      const userRecord = await admin.auth().getUserByEmail(email)
      const uid = userRecord.uid
      const displayName = userRecord.displayName
      console.log("[sendMeetingInvitations] Auth record found:", {
        uid,
        displayName,
      })

      const encryptedData = await aesEncrypt(sessionName, uid, meetingSalt)
      console.log("[sendMeetingInvitations] Data encrypted for:", email)

      const inviteLink = await generateInviteLink(
        title,
        email,
        encryptedData,
        meetingSalt,
        expiresAt,
      )
      console.log(
        "[sendMeetingInvitations] Invite link generated for:",
        email,
        inviteLink,
      )

      await createEmailInvitations({
        email,
        displayName,
        host: hostName,
        createdAt,
        inviteLink,
      })
      console.log("[sendMeetingInvitations] Email sent to:", email)
    })

    await Promise.all(sendInvitesPromises)
    console.log("[sendMeetingInvitations] All invitations sent successfully")

    return {
      success: true,
      message: "Invitations sent successfully to all attendees!",
    }
  } catch (err) {
    console.error("[sendMeetingInvitations] Error:", err)
    return {
      success: false,
      message: "Failed to send invitations",
      error: err.message,
    }
  }
}
