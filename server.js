require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// Health Check API
app.get("/", (req, res) => {
    res.send("Email API is Running Successfully");
});

// Environment Check API
app.get("/env-check", (req, res) => {
    res.json({
        brevoApiKeyExists: !!process.env.BREVO_API_KEY,
        brevoSenderExists: !!process.env.BREVO_SENDER_EMAIL
    });
});

// Send Email API
app.post("/send-email", async (req, res) => {
    console.log("========== API HIT ==========");
    console.log(req.body);
    try {
        const { to, subject, message } = req.body;

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                sender: { email: process.env.BREVO_SENDER_EMAIL },
                to: [{ email: to }],
                subject,
                htmlContent: `<p>${message}</p>`
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.log("MAIL ERROR");
            console.log(data);
            return res.status(response.status).json({
                success: false,
                message: data.message || "Failed to send email"
            });
        }

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
