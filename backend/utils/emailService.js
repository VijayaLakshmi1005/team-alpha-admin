import nodemailer from 'nodemailer';

// This is a transporter configuration. For production, use real SMTP settings.
// For now, it will log the email attempt if not configured.
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'maddison53@ethereal.email', // generated ethereal user
        pass: 'jn7jnAPss4f63QBp6D', // generated ethereal password
    },
});

export const sendAssignmentEmail = async (photographerEmail, photographerName, leadName, eventType, eventDate) => {
    console.log(`[EMAIL SERVICE] Sending assignment email to ${photographerEmail}...`);

    const mailOptions = {
        from: '"Team Alpha Admin" <admin@teamalpha.com>',
        to: photographerEmail,
        subject: `Project Assignment: ${leadName}`,
        text: `Hello ${photographerName},\n\nYou have been assigned to the upcoming project: ${leadName} (${eventType}) scheduled for ${eventDate}.\n\nPlease check the admin dashboard for more details.\n\nBest,\nTeam Alpha Admin`,
        html: `
            <div style="font-family: sans-serif; color: #1C1C1C; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #F7F5F2; border-radius: 20px;">
                <h1 style="font-family: serif; color: #1C1C1C;">Project Assignment</h1>
                <p>Hello <strong>${photographerName}</strong>,</p>
                <p>You have been assigned to a new project:</p>
                <div style="background: #F7F5F2; padding: 20px; border-radius: 12px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Client:</strong> ${leadName}</p>
                    <p style="margin: 5px 0;"><strong>Type:</strong> ${eventType}</p>
                    <p style="margin: 5px 0;"><strong>Date:</strong> ${eventDate}</p>
                </div>
                <p>Please log in to the Team Alpha Admin dashboard to review the project details and tasks.</p>
                <hr style="border: none; border-top: 1px solid #B8B5B0; margin: 30px 0;" />
                <p style="font-size: 12px; color: #B8B5B0;">Team Alpha Photography • Luxury Studio Management</p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SERVICE] Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`[EMAIL SERVICE] Error sending email:`, error);
        // We don't throw here to avoid breaking the main process, but we log the error
    }
};
