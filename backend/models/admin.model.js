import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const AdminSchema = new mongoose.Schema({
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
    visits: {
        type: Number,
        default: 0
    }
}, {timestamps: true})


AdminSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

AdminSchema.pre(["updateOne", "findByIdAndUpdate", "findOneAndUpdate"], async function (next) {
    const data = this.getUpdate();
    if(data.password) {
        data.password = await bcrypt.hash(data.password, 10)
    }
    next()
})

AdminSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password)
}

AdminSchema.methods.generateAccessToken = function () {
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


export const admins = mongoose.model("admins", AdminSchema)