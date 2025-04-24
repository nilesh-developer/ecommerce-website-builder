import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import nodeMailer from "nodemailer";
import { subscriptions } from "../models/subscription.model.js"

const createTransaction = asyncHandler(async (req, res) => {
    const { userId, period, price } = req.body;

    const created = await subscriptions.create({
        userId,
        period,
        price
    })

    const startDate = new Date(created.createdAt);
    startDate.setMonth(startDate.getMonth() + created.period);

    const updateDates = await subscriptions.findByIdAndUpdate(created._id, {
        $set: {
            expiresOn: startDate.toISOString()
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(200, created, "Transaction initaited")
        )
})
const getUserTransaction = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const transactions = await subscriptions.find({ userId }).sort({ _id: -1 });
    return res.status(200).json(
        new ApiResponse(200, transactions, "Data retrieved Successfully")
    )
})

export {
    createTransaction,
    getUserTransaction
}