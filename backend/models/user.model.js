import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stores"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subscriptions"
    },
    subcription: {
        type: Boolean,
        default: false
    },
    verifyCode: {
        type: String
    },
    verifyCodeExpiry: {
        type: Date
    }

}, {timestamps: true})


UserSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.pre(["updateOne", "findByIdAndUpdate", "findOneAndUpdate"], async function (next) {
    const data = this.getUpdate();
    if(data.password) {
        data.password = await bcrypt.hash(data.password, 10)
    }
    next()
})

UserSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function () {
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


export const users = mongoose.model("users", UserSchema)