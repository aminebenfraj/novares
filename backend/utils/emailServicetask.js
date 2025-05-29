const nodemailer = require("nodemailer")
require("dotenv").config()

// Create a transporter using the provided SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})


// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection error:", error)
  } else {
    console.log("✅ SMTP server is ready to send emails")
  }
})

/**
 * Send task assignment email to a user
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.username - Recipient name
 * @param {string} options.taskName - Task name
 * @param {string} options.taskDescription - Task description
 * @returns {Promise} - Email sending result
 */
exports.sendTaskAssignmentEmail = async (options) => {
  try {
    const { to, username, taskName, taskDescription } = options

    // Email HTML template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          Task Assignment Notification
        </h2>
        
        <p>Dear ${username},</p>
        
        <p>You have been assigned to a new task that requires your attention:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">
            📋 Task: ${taskName}
          </h3>
          <p style="margin: 10px 0;">
            <strong>Description:</strong> ${taskDescription}
          </p>
          <p style="margin: 10px 0;">
            <strong>Action Required:</strong> Please open the system and check in to acknowledge this task assignment.
          </p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
          <p style="margin: 0; color: #856404;">
            <strong>⚠️ Important:</strong> Please log into the system and check in to confirm your assignment and review the task details.
          </p>
        </div>
        
        <p style="margin-top: 20px;">
          If you have any questions about this assignment, please contact your project manager or team lead.
        </p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
        
        <p style="color: #6c757d; font-size: 12px;">
          This is an automated notification from the Task Management System. Please do not reply to this email.
        </p>
      </div>
    `

    // Plain text version for email clients that don't support HTML
    const textContent = `
      Task Assignment Notification
      
      Dear ${username},
      
      You have been assigned to a new task: ${taskName}
      
      Description: ${taskDescription}
      
      Action Required: Please open the system and check in to acknowledge this task assignment.
      
      If you have any questions about this assignment, please contact your project manager or team lead.
    `

    // Email options
    const mailOptions = {
      from: `"Task Management System" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Task Assignment: ${taskName}`,
      html: htmlContent,
      text: textContent,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log("📧 Email sent:", info.messageId)
    return info
  } catch (error) {
    console.error("❌ Error sending email:", error)
    throw error
  }
}
