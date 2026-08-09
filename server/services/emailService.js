import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export const sendResetEmail = async (email, resetToken) => {
  const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset your password',
    html: `
      <h2>Password Reset</h2>

      <p>Click the link below to reset your password:</p>

      <a href="${resetUrl}">
        Reset Password
      </a>

      <p>This link will expire soon.</p>
    `,
  })
}
