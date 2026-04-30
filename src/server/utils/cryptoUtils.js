import crypto from "crypto"

export function generateSalt(length = 16) {
  const salt = crypto.randomBytes(length)
  console.log("[generateSalt] Salt generated successfully")
  return salt.toString("hex")
}

export function generateAESKey(uid, salt) {
  const iterations = 100000
  const keyLength = 32

  return new Promise((resolve, reject) => {
    const saltBuffer =
      typeof salt === "string" ? Buffer.from(salt, "hex") : salt

    crypto.pbkdf2(
      uid,
      saltBuffer,
      iterations,
      keyLength,
      "sha256",
      (err, derivedKey) => {
        if (err) {
          console.error("[generateAESKey] Failed to derive AES key:", err)
          reject(err)
        } else {
          console.log("[generateAESKey] AES key derived successfully")
          resolve(derivedKey)
        }
      },
    )
  })
}

export const aesEncrypt = async (sessionName, uid, salt) => {
  try {
    console.log(
      "[aesEncrypt] Starting encryption for sessionName:",
      sessionName,
    )
    const derivedKey = await generateAESKey(uid, salt)

    const iv = crypto.randomBytes(12)
    const cipher = crypto.createCipheriv("aes-256-gcm", derivedKey, iv)

    let encryptedData = cipher.update(
      JSON.stringify({ sessionName }),
      "utf8",
      "hex",
    )
    encryptedData += cipher.final("hex")
    const authTag = cipher.getAuthTag().toString("hex")

    console.log("[aesEncrypt] Encryption successful")
    return {
      iv: iv.toString("hex"),
      authTag,
      data: encryptedData,
    }
  } catch (error) {
    console.error("[aesEncrypt] Encryption failed:", error)
    throw error
  }
}

export const aesDecrypt = async (encryptedData, uid, salt) => {
  try {
    console.log("[aesDecrypt] Starting decryption")
    const iv = Buffer.from(encryptedData.iv, "hex")
    const authTag = Buffer.from(encryptedData.authTag, "hex")
    const ciphertext = encryptedData.data

    const derivedKey = await generateAESKey(uid, salt)
    console.log("[aesDecrypt] Derived key:", derivedKey)

    const decipher = crypto.createDecipheriv("aes-256-gcm", derivedKey, iv)
    decipher.setAuthTag(authTag)

    let decryptedData = decipher.update(ciphertext, "hex", "utf8")
    decryptedData += decipher.final("utf8")

    const { sessionName } = JSON.parse(decryptedData)
    console.log("[aesDecrypt] Decryption successful, sessionName:", sessionName)
    return { sessionName }
  } catch (error) {
    console.error("[aesDecrypt] Decryption failed:", error)
    throw error
  }
}
