import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    price: {
        type: Number
    },
    planType: {
        type: String,
        required: true
    },
    upiId: {
        type: String
    },
    upiReferenceNo: {
        type: String,
        default: "None"
    },
    status: {
        type: Boolean,
        default: false
    },
    failed: {
        type: Boolean,
        default: true
    },
    period: {
        type: Number
    },
    expiresOn: {
        type: Date
    }
}, {timestamps: true})


export const subscriptions = mongoose.model("subscriptions", SubscriptionSchema)