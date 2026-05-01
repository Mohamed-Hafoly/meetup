import "dotenv/config"
import fs from "fs"
import https from "https"
import path from "path"
import { fileURLToPath } from "url"
import express from "express"
import cors from "cors"
import session from "express-session"
import cookieParser from "cookie-parser"
import { createClient } from "redis"
import { RedisStore } from "connect-redis"
import authRoutes from "./routes/authRoutes.js"
import meetingRoutes from "./routes/meetingRoutes.js"
import userRoutes from "./routes/userRoutes.js"

const { PORT = 4000, SESSION_SECRET, NODE_ENV } = process.env

const app = express()

const redisClient = createClient({
  url: process.env.REDIS_URL,
})

redisClient.on("error", console.error)
await redisClient.connect()

console.log("Redis connected:", redisClient.isOpen)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.set("trust proxy", 1)

if (NODE_ENV === "development") {
  app.use(
    cors({
      credentials: true,
    }),
  )
}

app.use(
  session({
    secret: SESSION_SECRET,
    store: new RedisStore({ client: redisClient }),
    name: "sid",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
)

app.use("/api/auth", authRoutes)
app.use("/api/meetings", meetingRoutes)
app.use("/api/users", userRoutes)

if (NODE_ENV === "development") {
  const sslOptions = {
    key: fs.readFileSync("../meetup.local+3-key.pem"),
    cert: fs.readFileSync("../meetup.local+3.pem"),
  }

  https.createServer(sslOptions, app).listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on https://meetup.local:${PORT}`)
  })
} else if (NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const distPath = path.resolve(__dirname, "../client/dist")

  app.use(express.static(distPath))

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"))
  })

  if (process.env.APP_URL?.includes("meetup.local")) {
    const sslOptions = {
      key: fs.readFileSync("../meetup.local+3-key.pem"),
      cert: fs.readFileSync("../meetup.local+3.pem"),
    }
    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`Server running on https://meetup.local:${PORT}`)
    })
  } else {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  }
}
