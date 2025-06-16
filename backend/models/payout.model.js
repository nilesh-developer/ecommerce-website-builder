import mongoose from "mongoose";

const PayoutSchema = new mongoose.Schema({
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stores"
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders"
    }],
    paymentMethod: {
        type: String,
    },
    paymentTransactionNo: {
        type: String
    },
    notes: {
        type: String
    },
    amount: {
        type: Number
    },
    status: {
        type: String,
        enum: ["requested", "accepted", "processing", "completed"],
        default: "requested"
    }
}, { timestamps: true })

export const payouts = mongoose.model("payouts", PayoutSchema)