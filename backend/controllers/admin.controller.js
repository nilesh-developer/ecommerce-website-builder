import { admins } from "../models/admin.model.js";
import { customers } from "../models/customer.model.js";
import { orders } from "../models/order.model.js";
import { payouts } from "../models/payout.model.js";
import { stores } from "../models/store.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (email === "" || password === "") {
        return res.status(400)
            .json(
                new ApiResponse(400, "", "All fields are required")
            )
    }

    const emailId = email.trim()
    const userExist = await admins.findOne({ email: emailId })

    if (!userExist) {
        return res.status(400).json(
            new ApiResponse(400, "", "Email is not registered")
        )
    }

    const result = await userExist.isPasswordCorrect(password)

    if (!result) {
        return res.status(400).json(
            new ApiResponse(400, "", "Password is incorrect")
        )
    }

    const token = await userExist.generateAccessToken()

    const user = await admins.findOne({ email: emailId })

    return res.status(200).json(
        new ApiResponse(200, { user, token: token }, "Admin Logged In Successfully")
    )
})

const addVisit = asyncHandler(async (req, res) => {
    const admin = await admins.findOne({ email: "mail.eazzystore@gmail.com" })
    admin.visits = Number(admin.visits) + 1;
    admin.save()

    return res.status(200)
        .json({
            statusCode: 200,
            message: "Visit Added"
        })
})

const allOrders = asyncHandler(async (req, res) => {
    const order = await orders.find().sort({ createdAt: -1 })

    return res.status(200)
        .json({
            statusCode: 200,
            data: order,
            message: "Data fetched"
        })
})

const allStores = asyncHandler(async (req, res) => {
    const store = await stores.find().populate("owner").sort({ createdAt: -1 })

    return res.status(200)
        .json({
            statusCode: 200,
            data: store,
            message: "Data fetched"
        })
})

const allCustomers = asyncHandler(async (req, res) => {
    const customer = await customers.find().sort({ createdAt: -1 })

    return res.status(200)
        .json({
            statusCode: 200,
            data: customer,
            message: "Data fetched"
        })
})

const allPayouts = asyncHandler(async (req, res) => {
    const payout = await payouts.find().sort({ createdAt: -1 })

    return res.status(200)
        .json({
            statusCode: 200,
            data: payout,
            message: "Data fetched"
        })
})

const getStoreData = asyncHandler(async (req, res) => {

    const {id} = req.params
    const store = await stores.findById(id)

    return res.status(200)
        .json({
            statusCode: 200,
            data: store,
            message: "Data fetched"
        })
})

const getCustomerData = asyncHandler(async (req, res) => {

    const {id} = req.params
    const customer = await customers.findById(id).populate("store")

    return res.status(200)
        .json({
            statusCode: 200,
            data: customer,
            message: "Data fetched"
        })
})

const getPayoutDetails = asyncHandler(async (req, res) => {

    const {id} = req.params
    const payout = await payouts.findById(id).populate("store")

    return res.status(200)
        .json({
            statusCode: 200,
            data: payout,
            message: "Data fetched"
        })
})

const noOfAllData = asyncHandler(async (req, res) => {
    const order = await orders.countDocuments();
    const store = await stores.countDocuments();
    const customer = await customers.countDocuments();
    const admin = await admins.find()

    return res.status(200)
        .json({
            statusCode: 200,
            data: {
                noOfOrders: order,
                noOfCustomers: customer,
                noOfStores: store,
                noOfVisits: admin[0].visits
            },
            message: "Data fetched"
        })
})

const changeAdminPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const admin = await admins.findOne({email: "mail.eazzystore@gmail.com"})
    const result = await admin.isPasswordCorrect(oldPassword)

    if (!result) {
        return res.status(400).json(
            new ApiResponse(400, "", "Old Password is incorrect")
        )
    }

    const updatedPassword = await admins.findOneAndUpdate({ _id: req.user._id }, { password: newPassword })

    return res.status(200)
        .json(
            new ApiResponse(200, { admin: updatedPassword }, "Password changed successfully")
        )
})

export {
    loginAdmin,
    addVisit,
    noOfAllData,
    allOrders,
    allStores,
    allCustomers,
    allPayouts,
    getStoreData,
    getCustomerData,
    getPayoutDetails,
    changeAdminPassword
}