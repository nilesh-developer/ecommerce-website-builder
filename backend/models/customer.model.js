import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const CustomerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    pinCode: {
        type: Number
    },
    phoneNo: {
        type: Number
    },
    search: {
        type: Array
    },
    couponsUsed: [{
        type: String
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders"
    }],
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stores"
    }
}, {timestamps: true})

CustomerSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

CustomerSchema.pre(["updateOne", "findByIdAndUpdate", "findOneAndUpdate"], async function (next) {
    const data = this.getUpdate();
    if(data.password) {
        data.password = await bcrypt.hash(data.password, 10)
    }
    next()
})

CustomerSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password)
}

CustomerSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const customers = mongoose.model("customers", CustomerSchema)