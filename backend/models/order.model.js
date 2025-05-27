import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customers"
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stores"
    },
    product: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number
    },
    paymentOrderId: {
        type: String
    },
    paymentProcess: {
        type: String
    },
    paymentDetails: {
        status: {
            type: String
        },
        paymentProcess: {
            type: String
        },
        paymentMode: {
            type: String
        },
        paymentTime: {
            type: String
        },
        paymentId: {
            type: String
        },
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pinCode: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    isCouponApplied: {
        type: Boolean,
        default: false
    },
    discountValue: {
        type: Number
    },
    payoutAmount: {
        type: Number
    },
    coupon: {
        type: String
    },
    isTrackingDetailsProvided: {
        type: Boolean,
        default: false
    },
    trackingNo: {
        type: String
    },
    trackingPageUrl: {
        type: String
    }
}, { timestamps: true })

export const orders = mongoose.model("orders", OrderSchema)