const getResetEmailBody = (resetUrl) => `Reset your Workout.lol password

Use this link to choose a new password:
${resetUrl}

This link expires in 2 hours. If you did not request this email, you can ignore it.`

export const sendPasswordResetEmail = async ({ to, resetUrl }) => {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return { skipped: true }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Reset your Workout.lol password',
      text: getResetEmailBody(resetUrl),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Could not send password reset email: ${error}`)
  }

  return { skipped: false }
}
