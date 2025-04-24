import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { contactforms } from "../models/contactform.model.js";
import nodeMailer from "nodemailer"

const submitForm = asyncHandler(async (req, res) => {
    const {email, firstName, lastName, subject, message} = req.body;

    const form = await contactforms.create({
        email,
        firstName,
        lastName,
        subject,
        message
    })

    if(form){
        const emailProvider = nodeMailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.OTP_EMAIL_ID,
                pass: process.env.OTP_EMAIL_PASS
            },
            tls: { rejectUnauthorized: false }
        })

        const receiver = {
            from: `Eazzy <${process.env.OTP_EMAIL_ID}>`,
            to: process.env.ADMIN_EMAIL_ID,
            subject: "New Contact Form Submission",
            html: `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form Submission</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 20px auto;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }

        .header {
            background-color: #eb7804;
            color: white;
            text-align: center;
            padding: 20px;
        }

        .content {
            padding: 30px;
            color: #333;
        }

        .content h2 {
            color: #333;
            font-size: 22px;
        }

        .content p {
            font-size: 16px;
            line-height: 1.6;
        }

        .content .details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
        }

        .content .details p {
            margin: 5px 0;
        }

        .footer {
            background-color: #333;
            color: white;
            text-align: center;
            padding: 15px;
            font-size: 12px;
        }

        .footer a {
            color: #fff;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Email Header -->
        <div class="header">
            <h1>New Contact Form Submission</h1>
        </div>

        <!-- Email Content -->
        <div class="content">
            <h2>Hello Admin,</h2>
            <p>You have received a new contact form submission from your website.</p>
            <div class="details">
                <h3>Contact Form Details:</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>First Name:</strong> ${firstName}</p>
                <p><strong>Last Name:</strong> ${lastName}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong> ${message}</p>
            </div>
            <p>Please respond to the user as soon as possible.</p>
        </div>

        <!-- Email Footer -->
        <div class="footer">
            <p>Thank you,</p>
            <p>Eazzy Team</p>
            <p><a href="https://www.eazzy.store">www.eazzy.store</a></p>
        </div>
    </div>
</body>

</html>
`,
        }

        emailProvider.sendMail(receiver, (error, emailResponse) => {
            if (error) {
                console.log("Something went wrong while sending email to admin")
            } else {
                console.log("Email sent successfully to admin")
            }
        })
    }

    return res.status(200)
        .json(
            new ApiResponse(200, form, "Contact form submitted successfully")
        )
})

export {
    submitForm
}