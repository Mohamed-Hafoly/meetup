export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = "HttpError"
  }
}

export type MeetingData = {
  sessionName: string
  signature: string
  title: string
  name: string
  role: 0 | 1
  participants?: string[]
}
