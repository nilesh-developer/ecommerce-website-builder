import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { customers } from "../models/customer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { stores } from "../models/store.model.js";

const registerCustomer = asyncHandler(async (req,res) => {
    const {email,password,storeid} = req.body;
    const username = email.split('@')[0]

    if(email === "" || password === "" || storeid === ""){
        return res.status(400)
        .json(
            new ApiResponse(200,"","All fields are required")
        )
    }

    if(!storeid){
        return res.status(500)
        .json(
            new ApiResponse(500,"","Something went wrong! Please reload the login page")
        )
    }

    const customerExist = await customers.findOne({email, store: storeid})

    if(customerExist){
        return res.status(400)
        .json(
            new ApiResponse(400, "", "User already registered")
        )
    }

    const customer = await customers.create({
        username,
        name: username,
        email,
        password,
        store: storeid
    })

    const store = await stores.findById(storeid)
    store.customers.push(customer._id)
    await store.save()

    return res.status(200)
    .json(
        new ApiResponse(200,{customer},"User registered successfully")
    )
})

const loginCustomer = asyncHandler(async (req,res) => {
    const {email,password,storeid} = req.body;

    if(email === "" || password === "" || storeid === ""){
        return res.status(400)
        .json(
            new ApiResponse(200,"","All fields are required")
        )
    }

    const customerExist = await customers.findOne({email,store: storeid})

    if(!customerExist){
        return res.status(400)
        .json(
            new ApiResponse(400,"","User not exist")
        )
    }

    const result = await customerExist.isPasswordCorrect(password)

    if(!result){
        return res.status(400)
        .json(
            new ApiResponse(400,"", "Password is incorrect")
        )
    }

    const token = await customerExist.generateAccessToken()

    return res.status(200)
    .json(
        new ApiResponse(200,{customerToken: token},"User logged in successfully")
    )
})

const getCurrentCustomer = asyncHandler(async (req,res) => {
    const customer = await customers.findById(req.customer._id).select("-password").populate("orders")
    
    return res.status(200)
        .json(
            new ApiResponse(200, customer, "current customer fetched successfully")
        )
})

const updateProfile = asyncHandler(async (req,res) => {
    const {name, phone, address, state, country, pinCode} = req.body;

    const customer = await customers.findOneAndUpdate({_id: req.customer._id},{
        name,
        phoneNo: phone,
        address,
        state,
        country,
        pinCode
    })

    return res.status(200)
    .json(
        new ApiResponse(200,customer,"Profile updated successfully")
    )
})

const updatePassword = asyncHandler(async (req,res) => {
    const {oldPassword, newPassword} = req.body;

    const customer = await customers.findById(req.customer._id)
    const result = await customer.isPasswordCorrect(oldPassword)

    if(!result){
        return res.status(400).json(
            new ApiResponse(400,"","Old Password is incorrect")
        )
    }

    const updatedPassword = await customers.findOneAndUpdate({ _id: req.customer._id }, { password: newPassword })
    
    return res.status(200)
    .json(
        new ApiResponse(200,updatedPassword,"Password changed successfully")
    )
})

export {
    registerCustomer,
    loginCustomer,
    getCurrentCustomer,
    updateProfile,
    updatePassword
}