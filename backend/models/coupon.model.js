import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stores',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    perCustomer: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    percentValue: {
        type: Number,
        default: null
    },
    flatDiscountAmount: {
        type: Number,
        default: null
    },
    minimumOrderValue: {
        type: Number,
        default: null
    },
    maximumDiscount: {
        type: Number,
        default: null
    },
    status: {
        type: Boolean,
        default: false
    },
    validFrom: {
        type: Date,
        required: true
    },
    validTill: {
        type: Date,
        required: true
    }
});

export const coupons = mongoose.model('coupons', CouponSchema);
