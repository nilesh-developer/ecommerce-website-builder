import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import nodeMailer from "nodemailer"
import { users } from "../models/user.model.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { storeNameValidation } from "../schemas/signUpSchema.js";
import { stores } from "../models/store.model.js";
import { subscriptions } from "../models/subscription.model.js";

const StorenameQuerySchema = z.object({
    storename: storeNameValidation
})

const checkStorenameUnique = async (req, res) => {
    try {
        //validate with zod = StorenameQuerySchema.parseAsync(req.body.storename)
        const result = req.body
        // if(!result.success){
        //     const storenameErrors = result.error.format().storename?._errors || []
        //     console.log(result.error)
        //     return res.status(400)
        //     .json(
        //         new ApiResponse(400, "", storenameErrors)
        //     )
        // }

        const { storename } = result

        const existingStore = await stores.findOne({ storename })

        if (existingStore) {
            return res.status(400)
                .json(
                    new ApiResponse(400, false, "Store name is already taken")
                )
        }

        return res.status(200)
            .json(
                new ApiResponse(200, true, "Store name is available")
            )

    } catch (error) {
        console.error("Error checking store name ", error)
        return res.status(500)
            .json(
                new ApiResponse(500, "", "Error while checking store name")
            )
    }
}

const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await users.findOne({ email })

        if (!user) {
            return res.status(400)
                .json(
                    new ApiResponse(400, "", "User Not Found")
                )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpiry = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpiry) {
            user.isVerified = true
            await user.save()

            return res.status(200)
                .json(
                    new ApiResponse(200, "", "Account verified successfully")
                )
        } else if (!isCodeNotExpiry) {
            return res.status(400)
                .json(
                    new ApiResponse(400, "", "Verification code has expired, please signup again")
                )
        } else {
            return res.status(400)
                .json(
                    new ApiResponse(400, "", "Incorrect Verification code")
                )
        }

    } catch (error) {
        console.error("Error verifying user ", error)
        return res.status(500)
            .json(
                new ApiResponse(500, "", "Error verifying user")
            )
    }
}

const sendotp = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const OTP = Math.floor(1 + Math.random() * 9000);

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
        to: email,
        subject: "OTP Verification",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Requested</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: white;
            padding: 20px;
            text-align: center;
            border-bottom: 4px solid #ff8c00;
        }
        .header img {
            width: 120px;
        }
        .content {
            padding: 20px 30px;
            color: #333;
        }
        .content h2 {
            font-size: 24px;
            color: #333;
        }
        .otp-box {
            background-color: #f9f9f9;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            border: 2px dashed #ff9100;
            border-radius: 8px;
        }
        .otp-box .otp {
            font-size: 28px;
            font-weight: bold;
            color: #000000;
        }
        .content p {
            line-height: 1.7;
            font-size: 16px;
            color: #555;
        }
        .support {
            text-align: center;
            margin-top: 20px;
            margin-bottom: 20px;
        }
        .support a {
            background-color: #ee7401;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            font-size: 16px;
            border-radius: 50px;
            display: inline-block;
            margin-top: 10px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .support a:hover {
            background-color: #fd6900;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 15px 30px;
            text-align: center;
            font-size: 12px;
            color: #888;
            border-top: 1px solid #eee;
        }
        .footer p {
            margin: 5px 0;
        }
        .footer a {
            color: #007ad9;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header with logo and background -->
        <div class="header">
            <img src="https://eazzy.store/eazzy.png" alt="Eazzy Logo">
        </div>

        <!-- Main Content -->
        <div class="content">
            <h2>OTP Requested</h2>
            <p>Hi,</p>
            <p>Your One Time Password (OTP) is:</p>

            <!-- OTP Box with dashed border -->
            <div class="otp-box">
                <span class="otp">${OTP}</span>
            </div>

            <p>This password will expire in ten minutes if not used.</p>
            <p>If you did not request this, please contact our customer support immediately to secure your account.</p>

            <p>Thank You,<br><strong>Eazzy Team</strong></p>
        </div>

        <!-- Support Button -->
        <div class="support">
            <a href="https://eazzy.store/contact-us">Contact 24x7 Help & Support</a>
        </div>

        <!-- Footer with security warning -->
        <div class="footer">
            <p>Never share your OTP with anyone. Even if the caller claims to be from Eazzy.</p>
            <p>Sharing these details can lead to unauthorized access to your account.</p>
            <p>This is an automatically generated email, please do not reply.</p>
        </div>
    </div>
</body>
</html>
`,
    }

    const otpToken = await jwt.sign({ otp: OTP }, process.env.OTP_TOKEN_SECRET, { expiresIn: process.env.OTP_TOKEN_EXPIRY })

    emailProvider.sendMail(receiver, (error, emailResponse) => {
        if (error) {
            return res.status(400).json({ message: error })
        } else {
            return res.status(200).json({ message: "OTP send successfully on your email account", otp: otpToken })
        }
    })
})

const verifyOtp = asyncHandler(async (req, res) => {
    const { otpToken } = req.body;

    const otp = await jwt.verify(otpToken, process.env.OTP_TOKEN_SECRET);

    return res.status(200).json({ message: "OTP send", otp })
})

const registerUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await users.findOne({ email })

    if (existingUser) {
        return res.status(400).json(
            new ApiResponse(400, "", "User already registered")
        )
    }

    const user = await users.create({
        email,
        password,
        isVerified: true
    })

    const created = await subscriptions.create({
        userId: user._id,
        period: 120, //no. of month free subscription
        price: 0,
        planType: "Free",
        upiId: "Eazzy Free Trial",
        failed: false,
        status: true
    })

    const startDate = new Date(created.createdAt);
    startDate.setMonth(startDate.getMonth() + created.period);

    const updateDates = await subscriptions.findByIdAndUpdate(created._id, {
        $set: {
            expiresOn: startDate.toISOString()
        }
    })

    const userFree = await users.findOneAndUpdate({_id: user._id},{
        transactionId: created._id,
        subcription: true
    })

    const token = await user.generateAccessToken()

    if (user) {
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
            subject: "New user registered on eazzy",
            text: `User Email: ${user.email}`,
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
            new ApiResponse(200, { user, token: token }, "User registered successfully")
        )

})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (email === "" || password === "") {
        return res.status(400)
            .json(
                new ApiResponse(400, "", "All fields are required")
            )
    }

    const emailId = email.trim()
    const userExist = await users.findOne({ email: emailId })

    if (!userExist) {
        return res.status(400).json(
            new ApiResponse(400, "", "Email is not registered")
        )
    }

    const result = await userExist.isPasswordCorrect(password)

    if (!result) {
        return res.status(400).json(
            new ApiResponse(400, "", "Password is incorrect")
        )
    }

    const token = await userExist.generateAccessToken()

    const user = await users.findOne({ email: emailId }).populate("store")

    return res.status(200).json(
        new ApiResponse(200, { user, token: token }, "User Logged In Successfully")
    )
})

const updatePassword = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await users.findById(id)
    const result = await user.isPasswordCorrect(oldPassword)

    if (!result) {
        return res.status(400).json(
            new ApiResponse(400, "", "Old Password is incorrect")
        )
    }

    const updatedPassword = await users.findOneAndUpdate({ _id: req.user._id }, { password: newPassword })

    return res.status(200)
        .json(
            new ApiResponse(200, { user: updatedPassword }, "Password changed successfully")
        )
})

const deleteAccount = asyncHandler(async (req, res) => {
    const user = await users.findByIdAndDelete(req.user._id)
    const store = await stores.findByIdAndDelete(user.store)

    return res.status(200)
        .json(
            new ApiResponse(200, "", "Account deleted successfully")
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {

    const user = await users.findById(req.user._id).select("-password").populate("store").populate("transactionId")

    const currentDate = new Date();

    if(user?.transactionId?.expiresOn < currentDate){
        const userUpdated = await users.findOneAndUpdate({_id: user._id},{
            transactionId: null,
            subcription: false
        })
    }

    return res.status(200)
        .json(
            new ApiResponse(200, user, "current user fetched successfully")
        )
})

const getUserData = asyncHandler(async (req, res) => {
    const { userid } = req.params

    if (!userid?.trim()) {
        throw new ApiError(500, "User Id is missing")
    }

    const user = await users.findById(userid).populate("store")

    return res.status(200)
        .json(
            new ApiResponse(200, user, "User Data fetched successfully")
        )
})

const subscriptionPayment = asyncHandler(async (req, res) => {

    const {userId,
        tId,
        subcription,
        upiId} = req.body;

    const user = await users.findOneAndUpdate({_id: userId},{
        transactionId: tId,
        subcription: subcription
    })

    const transaction = await subscriptions.findOneAndUpdate({_id: tId},{
        upiId,
        failed: false
    })


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
        to: user.email,
        subject: "Payment Confirmation for Your Eazzy Store Subscription",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Requested</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: white;
            padding: 20px;
            text-align: center;
            border-bottom: 4px solid #ff8c00;
        }
        .header img {
            width: 120px;
        }
        .content {
            padding: 20px 30px;
            color: #333;
        }
        .content h2 {
            font-size: 24px;
            color: #333;
        }
        .otp-box {
            background-color: #f9f9f9;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            border: 2px dashed #ff9100;
            border-radius: 8px;
        }
        .otp-box .otp {
            font-size: 28px;
            font-weight: bold;
            color: #000000;
        }
        .content p {
            line-height: 1.7;
            font-size: 16px;
            color: #555;
        }
        .support {
            text-align: center;
            margin-top: 20px;
            margin-bottom: 20px;
        }
        .support a {
            background-color: #ee7401;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            font-size: 16px;
            border-radius: 50px;
            display: inline-block;
            margin-top: 10px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .order-details {
            margin: 20px 0;
        }
        .order-details table {
            width: 100%;
            border-collapse: collapse;
        }
        .order-details table, .order-details th, .order-details td {
            border: 1px solid #ddd;
        }
        .order-details th, .order-details td {
            padding: 10px;
            text-align: left;
        }
        .support a:hover {
            background-color: #fd6900;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 15px 30px;
            text-align: center;
            font-size: 12px;
            color: #888;
            border-top: 1px solid #eee;
        }
        .footer p {
            margin: 5px 0;
        }
        .footer a {
            color: #007ad9;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header with logo and background -->
        <div class="header">
            <img src="https://eazzy.store/eazzy.png" alt="Eazzy Logo">
        </div>

        <!-- Main Content -->
        <div class="content">
            <h2>Payment Confirmation for Your Eazzy Store Subscription</h2>
            <p>Hi user,</p>
            <p>We are pleased to confirm that your payment for the Eazzy Store subscription has been successfully processed. Below are the details of your transaction:</p>
            <div class="order-details">
            <h2>Transaction Details</h2>
            <table>
                <tr>
                    <th>Transaction Id</th>
                    <td>${transaction._id}</td>
                </tr>
                <tr>
                    <th>Subscription Plan</th>
                    <td>${transaction.period} months</td>
                </tr>
                <tr>
                    <th>Amount Paid</th>
                    <td>Rs. ${transaction.price}</td>
                </tr>
                <tr>
                    <th>Date of Payment</th>
                    <td>${transaction.createdAt}</td>
                </tr>
            </table>
        </div>
        <p>Your subscription payment verification is under review. It will take 5 to 8 hours to be verified.</p>

            <p>Thank you for trusting Eazzy Store. We're excited to support your journey!</p>
            <p>If you did not made this payment, please contact our customer support immediately to secure your account.</p>

            <p>Best regards,<br><strong>Eazzy Team</strong></p>
        </div>

        <!-- Support Button -->
        <div class="support">
            <a href="https://eazzy.store/contact-us">Contact 24x7 Help & Support</a>
        </div>

        <!-- Footer with security warning -->
        <div class="footer">
            <p>Never share your OTP with anyone. Even if the caller claims to be from Eazzy.</p>
            <p>Sharing these details can lead to unauthorized access to your account.</p>
            <p>This is an automatically generated email, please do not reply.</p>
        </div>
    </div>
</body>
</html>
`,
    }

    emailProvider.sendMail(receiver, (error, emailResponse) => {
        if (error) {
            return res.status(400).json({ message: error })
        } else {
            return res.status(200).json({ message: "Payment made successfully" })
        }
    })


    const receiverAdmin = {
        from: `Eazzy <${process.env.OTP_EMAIL_ID}>`,
        to: process.env.ADMIN_EMAIL_ID,
        subject: "Eazzy Store Subscribtion Payment Request",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Requested</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: white;
            padding: 20px;
            text-align: center;
            border-bottom: 4px solid #ff8c00;
        }
        .header img {
            width: 120px;
        }
        .content {
            padding: 20px 30px;
            color: #333;
        }
        .content h2 {
            font-size: 24px;
            color: #333;
        }
        .otp-box {
            background-color: #f9f9f9;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            border: 2px dashed #ff9100;
            border-radius: 8px;
        }
        .otp-box .otp {
            font-size: 28px;
            font-weight: bold;
            color: #000000;
        }
        .content p {
            line-height: 1.7;
            font-size: 16px;
            color: #555;
        }
        .support {
            text-align: center;
            margin-top: 20px;
            margin-bottom: 20px;
        }
        .support a {
            background-color: #ee7401;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            font-size: 16px;
            border-radius: 50px;
            display: inline-block;
            margin-top: 10px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .order-details {
            margin: 20px 0;
        }
        .order-details table {
            width: 100%;
            border-collapse: collapse;
        }
        .order-details table, .order-details th, .order-details td {
            border: 1px solid #ddd;
        }
        .order-details th, .order-details td {
            padding: 10px;
            text-align: left;
        }
        .support a:hover {
            background-color: #fd6900;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 15px 30px;
            text-align: center;
            font-size: 12px;
            color: #888;
            border-top: 1px solid #eee;
        }
        .footer p {
            margin: 5px 0;
        }
        .footer a {
            color: #007ad9;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header with logo and background -->
        <div class="header">
            <img src="https://eazzy.store/eazzy.png" alt="Eazzy Logo">
        </div>

        <!-- Main Content -->
        <div class="content">
            <h2>Eazzy Store Subscribtion Payment Request</h2>
            <p>Hi Admin,</p>
            <p>Eazzy store received a subscription request. Below are the details of the transaction:</p>
            <div class="order-details">
            <h2>Transaction Details</h2>
            <table>
                <tr>
                    <th>Transaction Id</th>
                    <td>${transaction._id}</td>
                </tr>
                <tr>
                    <th>Subscription Plan</th>
                    <td>${transaction.period} months</td>
                </tr>
                <tr>
                    <th>Amount Paid</th>
                    <td>Rs. ${transaction.price}</td>
                </tr>
                <tr>
                    <th>Date of Payment</th>
                    <td>${transaction.createdAt}</td>
                </tr>
                <tr>
                    <th>Store Id</th>
                    <td>${user.store._id}</td>
                </tr>
            </table>
        </div>

        <p>Best regards,<br><strong>Eazzy Store</strong></p>
        </div>

        <!-- Support Button -->
        <div class="support">
            <a href="https://eazzy.store/contact-us">Contact 24x7 Help & Support</a>
        </div>

        <!-- Footer with security warning -->
        <div class="footer">
            <p>Never share your OTP with anyone. Even if the caller claims to be from Eazzy.</p>
            <p>Sharing these details can lead to unauthorized access to your account.</p>
            <p>This is an automatically generated email, please do not reply.</p>
        </div>
    </div>
</body>
</html>
`,
    }

    emailProvider.sendMail(receiverAdmin, (error, emailResponse) => {
        if (error) {
            console.log("Something went wrong while sending email to admin")
        } else {
            console.log("Email sent successfully to admin")
        }
    })


    return res.status(200)
        .json(
            new ApiResponse(200, user, "Payment Completed")
        )
})

export {
    registerUser,
    checkStorenameUnique,
    verifyCode,
    sendotp,
    verifyOtp,
    loginUser,
    updatePassword,
    deleteAccount,
    getCurrentUser,
    getUserData,
    subscriptionPayment
}