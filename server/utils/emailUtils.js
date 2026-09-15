import nodemailer from "nodemailer"

const {
  NODEMAILER_USER_EMAIL,
  NODEMAILER_USER_PASSWORD,
  APP_URL,
} = process.env

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: NODEMAILER_USER_EMAIL,
    pass: NODEMAILER_USER_PASSWORD,
  },
})

const generateEmailHTML = ({ host, displayName, createdAt, inviteLink }) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Meeting Invitation</title>
  </head>
  <body
    style="
      height: 100%;
      margin: 0;
      padding: 0;
      background-color: #fff;
      font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;
    "
  >
    <table
      width="100%"
      height="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="background-color: #fff"
    >
      <tr>
        <td align="center">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="width: 100%"
          >
            <!-- Header / Logo -->
            <tr style="background-color: #434e7821">
              <td align="center" style="padding-block: 16px">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr background-color="#000">
                    <td style="padding: 20px 22px">
                      <h1
                        style="
                          margin: 0;
                          font-weight: 700;
                          letter-spacing: -0.5px;
                          word-spacing: -6px;
                        "
                      >
                        <span style="color: #434e78">Meet</span>
                        <span style="color: #ff9292">UP</span>
                      </h1>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Card -->
            <tr>
              <td
                style="
                  background-color: #434e78;
                  border: 1px solid #434e78;
                  overflow: hidden;
                "
              >
                <!-- Card top accent bar -->
                <tr>
                  <td
                    style="
                      background: #434e78;
                      height: 4px;
                      font-size: 0;
                      line-height: 0;
                    "
                  >
                    &nbsp;
                  </td>
                </tr>

                <!-- Card body -->
                <tr>
                  <td style="padding: 48px 48px 40px">
                    <!-- Greeting -->
                    <p
                      style="
                        margin: 0 0 8px;
                        color: #2d2d2d;
                        font-size: 16px;
                        font-weight: 500;
                      "
                    >
                      Hello,
                    </p>
                    <h1
                      style="
                        margin: 0 0 20px;
                        color: #434e78;
                        font-size: 28px;
                        font-weight: 700;
                        letter-spacing: -0.5px;
                        line-height: 1.2;
                        padding-left: 10px;
                      "
                    >
                      ${displayName}
                    </h1>

                    <!-- Message -->
                    <p
                      style="
                        margin: 0 0 32px;
                        color: #2d2d2d;
                        font-size: 16px;
                        line-height: 1.7;
                      "
                    >
                      <strong style="color: #434e78">${host}</strong> has
                      invited you to a meeting. We'd love to see you there — all
                      the details are below.
                    </p>

                    <!-- Meeting details card -->
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="
                        background-color: #434e78;
                        border: 1px solid #2d2d2d;
                        border-radius: 14px;
                        margin-bottom: 36px;
                      "
                    >
                      <tr>
                        <td style="padding: 28px 28px 24px">
                          <!-- Host row -->
                          <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                          >
                            <tr>
                              <td
                                style="
                                  color: #ff9292;
                                  font-size: 11px;
                                  font-weight: 700;
                                  letter-spacing: 1.2px;
                                  text-transform: uppercase;
                                  padding-bottom: 6px;
                                "
                              >
                                Hosted By
                              </td>
                            </tr>
                            <tr>
                              <td
                                style="
                                  color: #fff;
                                  font-size: 17px;
                                  font-weight: 600;
                                  padding-bottom: 20px;
                                  border-bottom: 1px solid #ff9292;
                                "
                              >
                                ${host}
                              </td>
                            </tr>
                          </table>

                          <!-- Date row -->
                          <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="margin-top: 20px"
                          >
                            <tr>
                              <td
                                style="
                                  color: #ff9292;
                                  font-size: 11px;
                                  font-weight: 700;
                                  letter-spacing: 1.2px;
                                  text-transform: uppercase;
                                  padding-bottom: 6px;
                                "
                              >
                                Date &amp; Time
                              </td>
                            </tr>
                            <tr>
                              <td
                                style="
                                  color: #fff;
                                  font-size: 17px;
                                  font-weight: 600;
                                "
                              >
                                ${createdAt}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA Button -->
                    <table
                      align="center"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="margin-bottom: 32px"
                    >
                      <tr>
                        <td
                          align="center"
                          style="
                            background-color: #434e78;
                            border-radius: 12px;
                            border-bottom: 4px solid #ff9292;
                          "
                        >
                          <a
                            href="${inviteLink}"
                            style="
                              display: inline-block;
                              padding: 16px 36px;
                              color: #ff9292;
                              font-size: 16px;
                              font-weight: 700;
                              text-decoration: none;
                              letter-spacing: 0.2px;
                            "
                            >Join the Meeting →</a
                          >
                        </td>
                      </tr>
                    </table>

                    <!-- Fallback link -->
                    <p
                      style="
                        text-align: center;
                        margin: 0 0 0;
                        color: #2d2d2d;
                        font-size: 15px;
                        line-height: 1.6;
                      "
                    >
                      Or copy this link into your browser:<br />
                      <a
                        href="${inviteLink}"
                        style="
                          color: #434e78;
                          word-break: break-all;
                          text-decoration: none;
                        "
                        >${inviteLink}</a
                      >
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 48px">
                    <div
                      style="
                        border-top: 1px solid #434e78;
                        font-size: 0;
                        line-height: 0;
                      "
                    >
                      &nbsp;
                    </div>
                  </td>
                </tr>

                <!-- Footer inside card -->
                <tr>
                  <td style="padding: 28px 48px">
                    <p
                      style="
                        margin: 0;
                        color: #2d2d2d;
                        font-size: 13px;
                        line-height: 1.7;
                      "
                    >
                      Looking forward to seeing you there!<br />
                      <strong style="font-size: 16px; color: #434e78; padding-left: 10px"
                        >— ${host}</strong
                      >
                    </p>
                  </td>
                </tr>
              </td>
            </tr>

            <!-- Bottom footer -->
            <tr>
              <td align="center" style="padding-top: 0px">
                <p
                  style="
                    margin: 0;
                    color: #404058;
                    font-size: 12px;
                    line-height: 1.7;
                  "
                >
                  Sent via
                  <a
                    href="${APP_URL}"
                    style="text-decoration: none"
                  >
                    <strong
                      style="
                        font-size: 15px;
                        font-weight: 700;
                        word-spacing: -3px;
                      "
                    >
                      <span style="color: #434e78">Meet</span>
                      <span style="color: #ff9292">UP</span>
                    </strong>
                  </a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`

const generatePlainText = ({ host, displayName, createdAt, inviteLink }) =>
  `
Hi ${displayName},

${host} has invited you to a meeting.

Date & Time: ${createdAt}
Hosted by: ${host}

Join the meeting here:
${inviteLink}

Looking forward to seeing you there!
— ${host}

Sent via MeetUP (${APP_URL})
`.trim()

export const createEmailInvitations = async ({
  host,
  email,
  displayName,
  createdAt,
  inviteLink,
}) => {
  console.log("[createEmailInvitations] Preparing email for:", email)

  const emailMessage = {
    from: `"${host} via MeetUP" <${NODEMAILER_USER_EMAIL}>`,
    to: email,
    subject: "Meeting Invitation",
    html: generateEmailHTML({ host, displayName, createdAt, inviteLink }),
    text: generatePlainText({ host, displayName, createdAt, inviteLink }),
    replyTo: host,
  }

  try {
    await transporter.sendMail(emailMessage)
    console.log("[createEmailInvitations] Email sent successfully to:", email)
  } catch (error) {
    console.error(
      "[createEmailInvitations] Failed to send email to:",
      email,
      error,
    )
    throw error
  }
}