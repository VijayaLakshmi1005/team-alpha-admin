import nodemailer from 'nodemailer';

const getTransporter = () => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    // Check if credentials exist and are NOT commented out (which makes them undefined)
    // Also check for known placeholder 'abcd'
    const hasCredentials = user && typeof user === 'string' && pass && typeof pass === 'string';
    const isProduction = hasCredentials && pass.length > 5 && !pass.includes('abcd');

    console.log(`[EMAIL SETUP] Mode: ${isProduction ? 'PRODUCTION (Real Gmail)' : 'DEV (Ethereal Fake)'}`);

    if (isProduction) {
        return {
            transporter: nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: user,
                    pass: pass,
                },
            }),
            isProduction: true
        };
    } else {
        return {
            transporter: nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: 'maddison53@ethereal.email',
                    pass: 'jn7jnAPss4f63QBp6D',
                },
            }),
            isProduction: false
        };
    }
};

export const sendAssignmentEmail = async (photographerEmail, photographerName, leadName, eventType, eventDate) => {
    console.log(`[EMAIL SERVICE] Sending assignment email to ${photographerEmail}...`);

    const { transporter, isProduction } = getTransporter();

    const mailOptions = {
        from: isProduction ? `"Team Alpha Admin" <${process.env.EMAIL_USER}>` : '"Team Alpha Admin" <admin@teamalpha.com>',
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
    }
};

export const sendReminderEmail = async (photographerEmail, photographerName, leadName, eventType, eventDate, eventTime, eventLocation) => {
    console.log(`[EMAIL SERVICE] Sending REMINDER email to ${photographerEmail}...`);

    const { transporter, isProduction } = getTransporter();

    const mailOptions = {
        from: isProduction ? `"Team Alpha Admin" <${process.env.EMAIL_USER}>` : '"Team Alpha Admin" <admin@teamalpha.com>',
        to: photographerEmail,
        subject: `REMINDER: Upcoming Shoot for ${leadName}`,
        text: `Hello ${photographerName},\n\nThis is a friendly reminder for your upcoming shoot: ${leadName} (${eventType}) scheduled for ${eventDate} at ${eventTime}.\nLocation: ${eventLocation}\n\nPlease ensure all gear is prepped.\n\nBest,\nTeam Alpha Admin`,
        html: `
            <div style="font-family: sans-serif; color: #1C1C1C; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #F7F5F2; border-radius: 20px;">
                <h1 style="font-family: serif; color: #D4AF37;">Shoot Reminder</h1>
                <p>Hello <strong>${photographerName}</strong>,</p>
                <p>This is a reminder for your upcoming shoot tomorrow/soon:</p>
                <div style="background: #F7F5F2; padding: 20px; border-radius: 12px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Client:</strong> ${leadName}</p>
                    <p style="margin: 5px 0;"><strong>Type:</strong> ${eventType}</p>
                    <p style="margin: 5px 0;"><strong>Date:</strong> ${eventDate}</p>
                    <p style="margin: 5px 0;"><strong>Time:</strong> ${eventTime}</p>
                    <p style="margin: 5px 0;"><strong>Location:</strong> ${eventLocation}</p>
                </div>
                <p>Please ensure all batteries are charged and gear is packed.</p>
                <hr style="border: none; border-top: 1px solid #B8B5B0; margin: 30px 0;" />
                <p style="font-size: 12px; color: #B8B5B0;">Team Alpha Photography • Luxury Studio Management</p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SERVICE] Reminder Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`[EMAIL SERVICE] Error sending reminder email:`, error);
    }
};
