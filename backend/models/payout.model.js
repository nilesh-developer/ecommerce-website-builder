import mongoose from "mongoose";

const PayoutSchema = new mongoose.Schema({
    // owner: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "admins"
    // },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stores"
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders"
    }],
    week: {
        type: String,
        unique: true,
        required: true
    },
    paymentWeekStart: {
        type: Date,
        required: true
    },
    paymentWeekEnd: {
        type: Date,
        required: true
    },
    paymentMethod: {
        type: String,
    },
    paymentTransactionNo: {
        type: String
    },
    amount: {
        type: Number
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    }
}, { timestamps: true })

export const payouts = mongoose.model("payouts", PayoutSchema)