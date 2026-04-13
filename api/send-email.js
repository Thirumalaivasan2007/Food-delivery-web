const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        const { subject, text, html } = req.body;
        
        // Vercel Serverless Function SMTP connection to Gmail
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Feastify Engine" <${process.env.EMAIL_USER}>`,
            to: 'thirumalaivasan944@gmail.com',
            subject: subject || 'Feastify Alert',
            text: text,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        
        res.status(200).json({ success: true, messageId: info.messageId });
    } catch (err) {
        console.error('Vercel SMTP Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
}
