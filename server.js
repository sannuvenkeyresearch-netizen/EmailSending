require("dotenv").config();

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASSWORD
    }
});

// Health Check API
app.get("/", (req, res) => {
    res.send("Email API is Running Successfully");
});

// Email API
app.post("/send-email", async (req, res) => {

    console.log("========== API HIT ==========");
    console.log(req.body);

    try {

        const { to, subject, message } = req.body;

        // Verify SMTP connection
        await transporter.verify();
        console.log("SMTP Connected Successfully");

        // Send Email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: `<p>${message}</p>`
        });

        console.log("MAIL SENT SUCCESSFULLY");

        return res.status(200).json({
            success: true,
            message: "Email sent successfully"
        });

    } catch (error) {

        console.log("MAIL ERROR");
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});
