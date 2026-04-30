import { admin, defaultDatabase } from "../utils/firebaseAdmin.js"

export async function signUp(req, res) {
  try {
    console.log("[signUp Step 1] Called with idToken:", req.body.idToken)

    const { idToken, name } = req.body
    if (!idToken) {
      console.warn("[signUp Step 1.1] Missing idToken")
      return res.status(400).json({ error: "Missing idToken" })
    }

    if (!name) {
      console.warn("[signUp Step 1.2] Missing name")
      return res.status(400).json({ error: "Missing name" })
    }

    let decoded
    try {
      decoded = await admin.auth().verifyIdToken(idToken)
      console.log("[signUp Step 2] Token verified:", decoded)
    } catch (verifyErr) {
      console.error("[signUp Step 2.1] Token verification failed:", verifyErr)
      return res.status(401).json({ error: "Invalid or expired token" })
    }

    const { email: rawEmail } = decoded
    const email = rawEmail.toLowerCase()
    console.log("[signUp Step 3] and email and name:", email, name)

    const userRef = defaultDatabase.collection("users").doc(email)
    const snap = await userRef.get()

    if (!snap.exists) {
      await userRef.set({
        email,
        name,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })
      console.log("[signUp Step 4] Created Firestore user:", email)
    } else {
      console.log("[signUp Step 4.1] User already exists:", email)
    }

    req.session.user = { email, name }
    console.log("[signUp Step 5] Session set:", req.session.user)

    return res.json({ ok: true })
  } catch (err) {
    console.error("[signUp Step 6] Unexpected error:", err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

export async function signIn(req, res) {
  try {
    console.log("[signIn Step 1] Called with idToken:", req.body.idToken)

    const { idToken } = req.body
    if (!idToken) {
      console.warn("[signIn Step 1.1] Missing idToken")
      return res.status(400).json({ error: "Missing idToken" })
    }

    let decoded
    try {
      decoded = await admin.auth().verifyIdToken(idToken)
      console.log("[signIn Step 2] Token verified:", decoded)
    } catch (verifyErr) {
      console.error("[signIn Step 2.1] Token verification failed:", verifyErr)
      return res.status(401).json({ error: "Invalid or expired token" })
    }

    const { email: rawEmail } = decoded
    const email = rawEmail.toLowerCase()
    console.log("[signIn Step 3] and email:", email)

    const userRef = defaultDatabase.collection("users").doc(email)
    const snap = await userRef.get()
    console.log("[signIn Step 4] User exists in Firestore:", snap.exists)

    if (!snap.exists) {
      console.warn("[signIn Step 4.1] No Firestore doc found for:", email)
      return res.status(404).json({ error: "User not found" })
    }

    const { name } = snap.data()
    console.log("[signIn Step 5] and email and name:", email, name)

    req.session.user = { email, name }
    console.log("[signIn Step 6] Session set:", req.session.user)

    return res.json({ ok: true })
  } catch (err) {
    console.error("[signIn Step 7] Unexpected error:", err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

export const validateSession = async (req, res) => {
  try {
    if (req.session?.user?.email) {
      const { email, name } = req.session.user

      const userRecord = await admin.auth().getUserByEmail(email)
      const emailChanged = userRecord.email !== email
      const nameChanged = userRecord.displayName !== name

      if (emailChanged || nameChanged) {
        console.log(
          "[validateSession] Session out of sync, resyncing:",
          { email, name },
          "->",
          { email: userRecord.email, name: userRecord.displayName },
        )
        req.session.user = {
          email: userRecord.email,
          name: userRecord.displayName,
        }

        await req.session.save()
      }

      return res.json({
        authenticated: true,
        user: {
          name: req.session.user.name,
          email: req.session.user.email,
        },
      })
    }

    console.log("[validateSession] No session found")
    return res.json({ authenticated: false })
  } catch (error) {
    console.error("session validation Error:", error)
    return res.status(500).json({
      authenticated: false,
      error: "Session validation failed",
    })
  }
}

export function logout(req, res) {
  try {
    req.session.destroy((err) => {
      res.clearCookie("connect.sid")

      if (err) {
        console.error("Error destroying session:", err)
        return res.status(500).json({ error: "Could not log out." })
      }

      console.log("logout api: Logged out successfully.")
      return res.status(200).json({ ok: true })
    })
  } catch (error) {
    console.error("Logout error:", error)
    return res
      .status(500)
      .json({ error: "Something went wrong during logout." })
  }
}

export async function updateUserProfile(req, res) {
  console.log("[updateUserProfile Step 1] Called with body:", {
    name: req.body.name,
    email: req.body.email,
    password: "***",
  })

  const { name: rawName, email: rawEmail, password } = req.body
  const name = rawName?.trim()
  const email = rawEmail?.trim()
  const { email: currentEmail, name: currentName } = req.session.user

  if (!password) {
    console.warn("[updateUserProfile Step 1.1] Missing password")
    return res
      .status(400)
      .json({ error: "Password is required to update profile" })
  }

  if (!name || !email) {
    console.warn("[updateUserProfile Step 1.2] No fields to update")
    return res.status(400).json({ error: "No fields to update" })
  }

  if (name === currentName && email === currentEmail) {
    console.warn("[updateUserProfile Step 1.3] No changes detected")
    return res.status(400).json({ error: "No changes detected" })
  }

  try {
    // 1. Verify password
    console.log(
      "[updateUserProfile Step 2] Verifying password for:",
      currentEmail,
    )
    const verifyRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentEmail,
          password,
          returnSecureToken: false,
        }),
      },
    )
    if (!verifyRes.ok) {
      const verifyErr = await verifyRes.json()
      console.warn(
        "[updateUserProfile Step 2.1] Password verification failed:",
        verifyErr.error?.message,
      )
      throw new Error(verifyErr.error?.message || "Invalid password")
    }
    console.log("[updateUserProfile Step 2.2] Password verified")

    const userRecord = await admin.auth().getUserByEmail(currentEmail)
    const uid = userRecord.uid
    console.log("[updateUserProfile Step 3] Got Firebase Auth user:", uid)

    const authUpdates = {}
    if (email && email !== currentEmail) authUpdates.email = email
    if (name && name !== currentName) authUpdates.displayName = name

    if (authUpdates.email) {
      await admin.auth().updateUser(uid, { email: authUpdates.email })
      console.log(
        "[updateUserProfile Step 4] Updated Firebase Auth email:",
        authUpdates.email,
      )
    }

    // 3. Migrate Firestore doc if email changed
    if (email && email !== currentEmail) {
      console.log(
        "[updateUserProfile Step 5] Email changed, migrating Firestore doc:",
        currentEmail,
        "->",
        email,
      )
      const oldDocRef = defaultDatabase.collection("users").doc(currentEmail)
      const newDocRef = defaultDatabase.collection("users").doc(email)

      const oldDoc = await oldDocRef.get()
      if (!oldDoc.exists) {
        console.warn(
          "[updateUserProfile Step 5.1] Firestore doc not found, rolling back Auth email",
        )
        await admin.auth().updateUser(uid, { email: currentEmail }) // rollback
        return res.status(404).json({ error: "User document not found" })
      }

      try {
        const batch = defaultDatabase.batch()
        batch.set(newDocRef, {
          ...oldDoc.data(),
          email,
          ...(name ? { name } : {}),
        })
        batch.delete(oldDocRef)
        await batch.commit()
        console.log(
          "[updateUserProfile Step 5.2] Firestore doc migrated to:",
          email,
        )
      } catch (firestoreErr) {
        console.error(
          "[updateUserProfile Step 5.3] Firestore migration failed, rolling back Auth email",
        )
        await admin.auth().updateUser(uid, { email: currentEmail }) // rollback
        throw firestoreErr
      }

      if (authUpdates.displayName) {
        console.log("[updateUserProfile Step 5.4] name updated")
        await admin
          .auth()
          .updateUser(uid, { displayName: authUpdates.displayName })
      }
    } else if (name && name !== currentName) {
      try {
        await defaultDatabase
          .collection("users")
          .doc(currentEmail)
          .update({ name })
        console.log("[updateUserProfile Step 5] Firestore name updated:", name)
      } catch (firestoreErr) {
        console.error(
          "[updateUserProfile Step 5.1] Firestore name update failed",
        )
        throw firestoreErr
      }

      try {
        await admin.auth().updateUser(uid, { displayName: name })
        console.log(
          "[updateUserProfile Step 5.2] Firebase Auth displayName updated:",
          name,
        )
      } catch (authErr) {
        // Non-critical — session and Firestore are source of truth
        console.error(
          "[updateUserProfile Step 5.3] Auth displayName update failed (non-critical):",
          authErr,
        )
      }
    }

    // 4. Sync session
    if (email && email !== currentEmail) req.session.user.email = email
    if (name && name !== currentName) req.session.user.name = name

    await new Promise((resolve, reject) =>
      req.session.save((err) => (err ? reject(err) : resolve())),
    )
    console.log("[updateUserProfile Step 6] Session synced:", req.session.user)

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        name: req.session.user.name,
        email: req.session.user.email,
      },
    })
  } catch (err) {
    console.error("[updateUserProfile Step 7] Unexpected error:", err)

    if (
      err.message === "INVALID_PASSWORD" ||
      err.message === "INVALID_LOGIN_CREDENTIALS"
    ) {
      return res.status(401).json({ error: "Incorrect password" })
    }
    if (err.code === "auth/email-already-exists") {
      return res.status(409).json({ error: "Email already in use" })
    }
    if (err.code === "auth/invalid-email") {
      return res.status(400).json({ error: "Invalid email address" })
    }

    return res.status(500).json({ error: "Failed to update profile" })
  }
}
