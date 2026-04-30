export const requireSession = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  next()
}