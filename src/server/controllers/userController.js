import { defaultDatabase } from "../utils/firebaseAdmin.js"

export async function searchUsers(req, res) {
  const { email } = req.query

  if (!email || email.length < 3) {
    return res.status(400).json({ error: "email too short" })
  }

  try {
    const snapshot = await defaultDatabase
      .collection("users")
      .where("email", ">=", email.toLowerCase())
      .where("email", "<=", email.toLowerCase() + "\uf8ff")
      .limit(3)
      .get()

    const users = snapshot.docs
      .map((doc) => ({ email: doc.data().email, name: doc.data().name }))
      .filter((user) => user.email !== req.session.user.email)

    res.status(200).json(users)
  } catch (error) {
    console.error("[SearchUsers] Error fetching users:", error)
    res.status(500).json({ error: "Failed to fetch users" })
  }
}