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

    console.log("API HIT");

    return res.status(200).json({
        success: true,
        message: "API Working"
    });

});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});
