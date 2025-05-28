import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
    storename: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    businessName: {
        type: String,
    },
    businessCategory: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: "Welcome to [Your Store Name], your ultimate online destination for a wide range of high-quality products at great prices. Whether you're shopping for trendy fashion, the latest tech gadgets, stylish home decor, or beauty essentials, we offer an easy, secure, and enjoyable shopping experience. With a curated selection of top brands, fast shipping, and excellent customer service, we make sure every order exceeds your expectations. Browse our collections today and discover the perfect items to enhance your lifestyle—all from the comfort of your home!"
    },
    status: {
        type: Boolean,
        default: true
    },
    logo: {
        type: String
    },
    favicon: {
        type: String
    },
    banner: {
        type: String,
    },
    mobileBanner: {
        type: String
    },
    themeColorOne: {
        type: String,
        default: "#000000"
    },
    themeColorTwo: {
        type: String,
        default: "#f7f7f7"
    },
    hideCategory: {
        type: Boolean,
        default: false
    },
    address: {
        type: String
    },
    phoneNo: {
        type: Number
    },
    email: {
        type: String
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    }],
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories"
    }],
    customers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "customers"
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders"
    }],
    coupon: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "coupons"
    }],
    upiId: {
        type: String
    },
    upiReceiverName: {
        type: String
    },
    upiStatus: {
        type: Boolean
    },
    cod: {
        type: Boolean,
        default: true
    },
    cashfree: {
        type: Boolean,
        default: true
    },
    subdomain: {
        type: String,
        required: true
    },
    customDomain: {
        type: String
    },
    revenue: {
        type: Number,
        default: 0
    },
    currentWeekPendingPayout: {
        type: Number,
        default: 0
    },
    additionalPreviousWeekPayout: {
        orders: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "orders"
        }],
        amount: {
            type: Number,
            default: 0
        }
    },
    metaTitle: {
        type: String
    },
    metaDescription: {
        type: String
    },
    returnPolicy: {
        type: String
    },
    shippingPolicy: {
        type: String
    },
    aboutContent: {
        type: String
    },
    paymentDetails: {
        type: {
            type: String,
            enum: ['bankTransfer', 'upi']
        },
        bankName: {
            type: String,
        },
        ifsc: {
            type: String,
        },
        accountNo: {
            type: String,
        },
        accountHolderName: {
            type: String,
        },
        upiId: {
            type: String
        }
    },
    whatsApp: {
        type: Number
    },
    instagram: {
        type: String
    },
    youtube: {
        type: String
    },
    twitter: {
        type: String
    },
    facebook: {
        type: String
    }
}, { timestamps: true })

export const stores = mongoose.model("stores", StoreSchema)