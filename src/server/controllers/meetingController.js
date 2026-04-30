import { admin, defaultDatabase } from "../utils/firebaseAdmin.js"
import { getMeetingDoc, generateMeetingJWT } from "./../utils/meetingUtils.js"
import { verifyInviteJWT } from "../utils/linkUtils.js"
import { sendMeetingInvitations } from "../utils/invitesUtils.js"
import { generateSalt, aesDecrypt } from "../utils/cryptoUtils.js"

export const createMeeting = async (req, res) => {
  const { title, invitees } = req.body
  console.log("[createMeeting] Request received:", { title, invitees })
  try {
    const meetingSalt = generateSalt()
    const createdAt = new Date()

    const formattedCreatedAt = createdAt.toLocaleString("en-US", {
      timeZone: "Asia/Baghdad", // UTC+3
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    })

    const expiresAt = Date.now() + 24 * 60 * 60 * 1000

    console.log(
      "[createMeeting] Generated salt and createdAt and formattedCreatedAt and expiresAt:",
      {
        meetingSalt,
        createdAt,
        formattedCreatedAt,
      },
    )

    const meetingDataFirestore = {
      title: title,
      host: req.session.user.email,
      meetingSalt,
      participants: invitees.map((invitee) => invitee.email),
      date: admin.firestore.Timestamp.fromDate(createdAt),
      expiresAt: admin.firestore.Timestamp.fromDate(new Date(expiresAt)),
    }
    console.log(
      "[createMeeting] Firestore data prepared:",
      meetingDataFirestore,
    )

    const docRef = await defaultDatabase
      .collection("meetings")
      .add(meetingDataFirestore)
    const sessionName = docRef.id
    console.log(
      "[createMeeting] Firestore doc created, sessionName:",
      sessionName,
    )

    const meetingDetails = {
      title,
      host: req.session.user.email,
      sessionName,
      invitees,
      meetingSalt,
      createdAt: formattedCreatedAt,
      expiresAt: Math.floor(expiresAt / 1000),
    }
    console.log("[createMeeting] meetingDetails prepared:", meetingDetails)

    const invitationData = await sendMeetingInvitations(meetingDetails)
    console.log(
      "[createMeeting] sendMeetingInvitations result:",
      invitationData,
    )

    if (!invitationData.success) {
      console.log(
        "[createMeeting] Invitations failed, rolling back Firestore doc...",
      )
      await docRef.delete()
      throw new Error(invitationData.message || "Failed to send invitations")
    }

    try {
      req.session.hostMeeting = {
        title,
        sessionName,
        signature: generateMeetingJWT(sessionName, 1),
        participants: invitees.map((invitee) => invitee.email),
      }
      await req.session.save()
      console.log(
        "[createMeeting] Host meeting saved to session:",
        req.session.hostMeeting,
      )
    } catch (error) {
      console.error(
        "[createMeeting] Unable to save host meeting data to session:",
        error,
      )
    }

    console.log(
      "[createMeeting] Meeting created successfully, responding with id:",
      sessionName,
    )
    res.status(200).json({ id: sessionName })
  } catch (error) {
    console.error("[createMeeting] Error:", error)
    return res.status(500).json({ message: error.message })
  }
}

export const participantJoin = async (req, res) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({ message: "Invitation code is required" })
    }

    console.log("[participantJoin] Request received, code:", code)

    const inviteDoc = await defaultDatabase
      .collection("invites")
      .doc(code)
      .get()

    console.log("[participantJoin] Invite doc exists:", inviteDoc.exists)

    if (!inviteDoc.exists) {
      return res.status(400).json({ message: "Invalid invitation code" })
    }

    const inviteData = inviteDoc.data()
    const token = inviteData.token

    // // 2. Check if invite has expired (if you store expiration)
    // if (inviteData.expiresAt && inviteData.expiresAt.toDate() < new Date()) {
    //   return res.status(410).json({ message: "Invitation link has expired" })
    // }

    let encryptedData, role, meetingSalt, sessionName

    try {
      ;({ encryptedData, role, meetingSalt } = verifyInviteJWT(token))
      console.log("[participantJoin] JWT verified:", {
        encryptedData,
        role,
        meetingSalt,
      })
    } catch (error) {
      console.log("[participantJoin] Error verifying JWT:", error)
    }

    try {
      const uid = await admin
        .auth()
        .getUserByEmail(req.session.user.email)
        .then((userRecord) => userRecord.uid)

      ;({ sessionName } = await aesDecrypt(encryptedData, uid, meetingSalt))
      console.log("[participantJoin] Decrypted sessionName:", sessionName)
    } catch (error) {
      console.log("[participantJoin] Error decrypting data:", error)
    }

    const meetingRef = defaultDatabase.collection("meetings").doc(sessionName)
    const meetingDoc = await meetingRef.get()

    if (!meetingDoc.exists) {
      return res.status(410).json({ message: "This meeting no longer exists" })
    }

    const meetingData = meetingDoc.data()

    const signature = generateMeetingJWT(sessionName, role)
    console.log("[participantJoin] Generated signature:", signature)

    const title = meetingData.title

    console.log("[participantJoin] Responding with:", {
      title,
      sessionName,
      name: req.session.user.name,
    })

    res.json({
      title,
      sessionName,
      signature,
      name: req.session.user.name,
    })
  } catch (error) {
    console.error("[participantJoin] Unexpected error:", error)
    res.status(500).json({
      message: "Failed to join meeting. Please try again later.",
    })
  }
}

export const hostJoin = async (req, res) => {
  try {
    console.log("[hostJoin] Request received")
    console.log("[hostJoin] Session hostMeeting:", req.session.hostMeeting)

    if (!req.session.hostMeeting) {
      console.log("[hostJoin] No active meeting in session")
      return res.status(404).json({ message: "No active meeting found" })
    }

    const { sessionName, title, role, participants } = req.session.hostMeeting

    const meetingRef = defaultDatabase.collection("meetings").doc(sessionName)
    const meetingDoc = await meetingRef.get()

    if (!meetingDoc.exists) {
      req.session.hostMeeting = null
      await req.session.save()
      return res.status(404).json({ message: "No active meeting found" })
    }

    const signature = generateMeetingJWT(sessionName, role || 1)

    console.log("[hostJoin] Responding with:", {
      name: req.session.user.name,
      sessionName,
      title,
      signature,
      participants
    })

    res.json({
      name: req.session.user.name,
      sessionName,
      title,
      signature,
      participants
    })
  } catch (error) {
    console.error("[hostJoin] Unexpected error:", error)
    res.status(500).json({
      message: "Failed to join as host. Please try again later.",
    })
  }
}

export const sendInvites = async (req, res) => {
  const { invitees } = req.body
  const { sessionName } = req.session.hostMeeting
  console.log("[addUsers] Request received:", { invitees, sessionName })

  try {
    const { meetingRef, meetingData } = await getMeetingDoc(sessionName)

    console.log("[addUsers] Meeting data:", meetingData)

    const formattedCreatedAt = meetingData.date
      .toDate()
      .toLocaleString("en-US", {
        timeZone: "Asia/Baghdad",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })

    console.log("[addUsers] Formatted date:", formattedCreatedAt)

    const meetingDetails = {
      title: meetingData.title,
      host: req.session.user.email,
      sessionName,
      meetingSalt: meetingData.meetingSalt,
      invitees,
      createdAt: formattedCreatedAt,
      expiresAt: Math.floor(meetingData.expiresAt.toMillis() / 1000),
    }
    console.log("[addUsers] meetingDetails prepared:", meetingDetails)

    const invitationData = await sendMeetingInvitations(meetingDetails)
    console.log("[addUsers] sendMeetingInvitations result:", invitationData)

    if (!invitationData.success) {
      throw new Error(invitationData.message || "Failed to send invitations")
    }

    const newEmails = invitees.map((i) => i.email)
    console.log("[addUsers] Adding new emails to participants:", newEmails)

    await meetingRef.update({
      participants: admin.firestore.FieldValue.arrayUnion(...newEmails),
    })
    console.log("[addUsers] Firestore participants updated")

    const updatedDoc = await meetingRef.get()
    const updatedParticipants = updatedDoc.data().participants
    console.log("[addUsers] Updated participants:", updatedParticipants)

    req.session.hostMeeting.participants = updatedParticipants
    console.log(
      "[addUsers] Session updated with new participants:",
      updatedParticipants,
    )

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("[addUsers] Error:", error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

export async function currentHost(req, res) {
  try {
    const currentHost = !!req.session?.hostMeeting
    return res.json({ currentHost })
  } catch (error) {
    console.error("[currentHost] Error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

export const deleteMeeting = async (req, res) => {
  const { sessionName } = req.params
  console.log("[deleteMeeting] Request received, sessionName:", sessionName)

  try {
    const { meetingRef, meetingData } = await getMeetingDoc(sessionName)
    console.log("[deleteMeeting] Meeting data retrieved:", meetingData)

    if (meetingData.host !== req.session.user.email) {
      console.log(
        "[deleteMeeting] Unauthorized delete attempt by:",
        req.session.user.email,
      )
      return res.status(403).json({ message: "Unauthorized" })
    }

    await meetingRef.delete()
    console.log("[deleteMeeting] Meeting document deleted")
    if (
      req.session.hostMeeting &&
      req.session.hostMeeting.sessionName === sessionName
    ) {
      delete req.session.hostMeeting
      await req.session.save()
      console.log("[deleteMeeting] Host meeting data removed from session")
    }
    return res.status(200).json({ message: "Meeting deleted successfully" })
  } catch (error) {
    console.error("[deleteMeeting] Error:", error)
    return res.status(500).json({ message: error.message })
  }
}
