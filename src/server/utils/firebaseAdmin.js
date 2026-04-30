import admin from "firebase-admin"

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const defaultDatabase = admin.firestore()

export { admin, defaultDatabase }

console.log("Firebase initialized successfully")