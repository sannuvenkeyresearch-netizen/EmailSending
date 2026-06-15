require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.get("/", (req, res) => {
    res.send("Email API is Running Successfully");
});

app.post("/send-email", async (req, res) => {

    console.log("========== API HIT ==========");
    console.log(req.body);
    console.log("EMAIL_USER:", process.env.EMAIL_USER);

    try {

        const { to, subject, message } = req.body;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: `<p>${message}</p>`
        });

        console.log("MAIL SENT");

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
