import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { stores } from "../models/store.model.js";
import nodeMailer from "nodemailer"
import { users } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { payouts } from "../models/payout.model.js";
import { orders } from "../models/order.model.js";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

const createStore = asyncHandler(async (req, res) => {
    const { name, storename, owner, subdomain } = req.body;

    const existingStore = await stores.findOne({ storename })

    if (existingStore) {
        return res.status(400)
            .json(
                new ApiError(400, "Store name is already taken")
            )
    }

    const userStoreAlreadyExist = await stores.findOne({ owner: owner })

    if (userStoreAlreadyExist) {
        return res.status(400)
            .json(
                new ApiResponse(400, "", "User already have a store. One user can have only one store")
            )
    }

    const user = await users.findById(owner)

    const storeCreated = await stores.create({
        storename,
        owner,
        email: user.email,
        name,
        subdomain: subdomain.toLowerCase(),
        metaTitle: name,
        logo: "",
        favicon: "",
        banner: ""
    })

    user.store = storeCreated._id
    await user.save()

    return res.status(200)
        .json(
            new ApiResponse(200, storeCreated, "Store created successfully")
        )
})

const businessdetails = asyncHandler(async (req, res) => {
    const { storename, businessName, category, address, mobileNo } = req.body;
    const store = await stores.findOneAndUpdate({ storename }, {
        businessName,
        businessCategory: category,
        address,
        phoneNo: mobileNo
    })

    if (!store) {
        return res.status(400)
            .json(
                new ApiResponse(400, "", "Something went wrong while adding business details")
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(200, "", "Business Details Submitted")
        )
})

const getCurrentStoreData = asyncHandler(async (req, res) => {
    const { subdomain } = req.body;
    const storeExist = await stores.findOne({
        $or: [
            { subdomain: subdomain },
            { customDomain: subdomain }
        ]
    })

    if (!storeExist) {
        return res.status(400)
            .json(
                new ApiResponse(400, "", "Store not Found")
            )
    }

    const store = await stores.findOne({
        $or: [
            { subdomain: subdomain },
            { customDomain: subdomain }
        ]
    }).select("-customers -address -businessName -businessCategory -phoneNo -updatedAt -orders -coupon -revenue -password -storename -razorpay -razorpayKeyId -razorpayKeySecret")

    return res.status(200)
        .json(
            new ApiResponse(200, { store }, "Store Found")
        )

})

const updateStoreName = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, metaTitle, metaDescription, color1, color2, hideCategory } = req.body;

    const store = await stores.findByIdAndUpdate(id,
        {
            $set: {
                name,
                metaTitle,
                metaDescription,
                themeColorOne: color1,
                themeColorTwo: color2,
                hideCategory
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res.status(200)
        .json(
            new ApiResponse(200, store, "Store data updated successfully")
        )
})

const addCustomDomain = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { customDomain } = req.body;

    const store = await stores.findByIdAndUpdate(id, {
        customDomain
    })

    if (store) {
        const emailProvider = nodeMailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.OTP_EMAIL_ID,
                pass: process.env.OTP_EMAIL_PASS
            },
            tls: { rejectUnauthorized: false }
        })

        const receiver = {
            from: `Eazzy <${process.env.OTP_EMAIL_ID}>`,
            to: process.env.ADMIN_EMAIL_ID,
            subject: "New Custom Domain Registration Request on Eazzy",
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Domain Request</title>
    </head>
    <body>
            Store Name: <b>${store.storename}</b><br>
            Custom Domain: <b>${store.customDomain}</b>
            </body>
            </html>
            `,
        }

        emailProvider.sendMail(receiver, (error, emailResponse) => {
            if (error) {
                console.log("Something went wrong while sending email to admin")
            } else {
                console.log("Email sent successfully to admin")
            }
        })
    }

    return res.status(200)
        .json(
            new ApiResponse(200, store, "Domain Added Successfully")
        )
})

const updateSocial = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { bio, email, instagram, facebook, twitter, youtube } = req.body;

    const store = await stores.findByIdAndUpdate(id,
        {
            $set: {
                bio,
                email,
                instagram,
                facebook,
                twitter,
                youtube
            }
        },
        {
            new: true
        }
    )

    return res.status(200)
        .json(
            new ApiResponse(200, store, "Store data updated successfully")
        )
})

const updatePolicies = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { returnPolicy, shippingPolicy } = req.body;

    const store = await stores.findByIdAndUpdate(id,
        {
            $set: {
                returnPolicy,
                shippingPolicy
            }
        },
        {
            new: true
        }
    )

    return res.status(200)
        .json(
            new ApiResponse(200, store, "Store data updated successfully")
        )
})

const updateAboutPage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { aboutContent } = req.body;

    const store = await stores.findByIdAndUpdate(id,
        {
            $set: {
                aboutContent
            }
        },
        {
            new: true
        }
    )

    return res.status(200)
        .json(
            new ApiResponse(200, store, "Store About Page updated")
        )
})

const changeStoreStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const store = await stores.findByIdAndUpdate(id,
        {
            $set: { status: status }
        },
        {
            new: true
        }).select("-password")

    if (store.status === true) {
        return res.status(200)
            .json(
                new ApiResponse(200, store, "Store activated successfully")
            )
    } else {
        return res.status(200)
            .json(
                new ApiResponse(200, store, "Store deactivated successfully")
            )
    }
})

const deleteStore = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const store = await stores.findByIdAndDelete(id).select("-password")

    const user = await users.findByIdAndUpdate(store.owner, {
        $unset: {
            store
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(200, store, "Your store is deleted")
        )
})

const storeData = asyncHandler(async (req, res) => {
    const { subdomain } = req.params;
    const store = await stores.findOne({
        $or: [
            { subdomain: subdomain },
            { customDomain: subdomain }
        ]
    }).select("-customers -address -businessName -businessCategory -phoneNo -updatedAt -orders -coupon -revenue -password -storename -razorpay -razorpayKeyId -razorpayKeySecret").populate("products categories")

    return res.status(200)
        .json(
            new ApiResponse(200, store, "Store data fetched successfully")
        )
})

const changeCodStatus = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const { status } = req.body;

    const store = await stores.findByIdAndUpdate(storeId,
        {
            $set: { cod: status }
        },
        {
            new: true
        })

    if (store.cod) {
        return res.status(200)
            .json(
                new ApiResponse(200, store, "Payment method Activated")
            )
    } else {
        return res.status(200)
            .json(
                new ApiResponse(200, store, "Payment method deactivated"))
    }

})

const changeCashfreeStatus = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const { status } = req.body;

    const store = await stores.findByIdAndUpdate(storeId,
        {
            $set: { cashfree: status }
        },
        {
            new: true
        })

    if (store.cashfree) {
        return res.status(200)
            .json(
                new ApiResponse(200, store, "Payment method Activated")
            )
    } else {
        return res.status(200)
            .json(
                new ApiResponse(200, store, "Payment method deactivated"))
    }

})

const addUpi = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const { name, upiId } = req.body;

    if (name === "" || upiId === "") {
        return res.status(400)
            .json(
                new ApiResponse(400, "", "All feilds are required")
            )
    }
    const checkUpiAlreadyAdded = await stores.findOne({ _id: storeId })

    if (checkUpiAlreadyAdded.upiId) {
        return res.status(400)
            .json(
                new ApiResponse(400, "", "You can add only one UPI ID")
            )
    }

    const store = await stores.findByIdAndUpdate(storeId,
        {
            $set: {
                upiId,
                upiReceiverName: name,
                upiStatus: true
            }
        },
        {
            new: true
        })

    return res.status(200)
        .json(
            new ApiResponse(200, store, "Payment details saved successfully")
        )
})

const changeUpiStatus = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const { status } = req.body;

    const store = await stores.findByIdAndUpdate(storeId,
        {
            $set: { upiStatus: status }
        },
        {
            new: true
        })

    if (store.upiStatus) {
        return res.status(200)
            .json(
                new ApiResponse(200, store, "Payment method Activated")
            )
    } else {
        return res.status(200)
            .json(
                new ApiResponse(200, store, "Payment method deactivated"))
    }

})

const deleteUpiId = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const store = await stores.findByIdAndUpdate(storeId,
        {
            $set: {
                upiId: "",
                upiReceiverName: "",
                upiStatus: false
            }
        },
        {
            new: true
        })

    return res.status(200)
        .json(
            new ApiResponse(200, store, "Payment method deleted")
        )

})

const uploadStoreImage = asyncHandler(async (req, res) => {
    const store = await stores.findById(req.body.storeId)

    const uploadImages = await stores.findOneAndUpdate({ _id: req.body.storeId }, {
        logo: req.files.logo ? await uploadOnCloudinary(req.files.logo[0].path) : store.logo,
        favicon: req.files.favicon ? await uploadOnCloudinary(req.files.favicon[0].path) : store.favicon,
        banner: req.files.banner ? await uploadOnCloudinary(req.files.banner[0].path) : store.banner,
        mobileBanner: req.files.mobileBanner ? await uploadOnCloudinary(req.files.mobileBanner[0].path) : store.mobileBanner

    })


    return res.status(200)
        .json(
            new ApiResponse(200, { store: uploadImages }, "Images uploaded successfully")
        )

})

const getCustomerData = asyncHandler(async (req, res) => {
    const { storeId } = req.params;

    const storeExist = await stores.findById(storeId).populate("customers")

    if (!storeExist) {
        return res.status(400)
            .json(
                new ApiResponse(400, "", "Store not exist")
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(200, storeExist, "Store data fetched along with Customer data")
        )

})

const setStorePaymentDetails = asyncHandler(async (req, res) => {
    const { storeId, type, bankName, ifsc, accountNo, accountHolderName, upiId } = req.body;

    let set;
    if (type === "bankTransfer") {
        set = await stores.findByIdAndUpdate(storeId, {
            paymentDetails: {
                type,
                bankName,
                ifsc,
                accountNo,
                accountHolderName,
            }
        })
    } else {
        set = await stores.findByIdAndUpdate(storeId, {
            paymentDetails: {
                type,
                upiId
            }
        })
    }

    if (!set) {
        return res.status(400).json({
            statusCode: 400,
            message: "Something went wrong"
        })
    }

    return res.status(200).json({
        statusCode: 200,
        message: "Payment details saved!"
    })
})

const getNumbersOfThirtyDays = asyncHandler(async (req, res) => {
    const { storeId } = req.params;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
        const noOfOrders = await orders.countDocuments({
            store: storeId,
            createdAt: { $gte: thirtyDaysAgo }
        });

        const totalRevenue = await orders.aggregate([
            {
                $match: {
                    store: new ObjectId(storeId),
                    status: "delivered",
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    lastThirtyDays: { $sum: "$totalPrice" }
                }
            }
        ]);

        return res.status(200).json({
            statusCode: 200,
            data: {
                noOfOrders,
                totalRevenueOfLastThirtyDays: totalRevenue[0].lastThirtyDays
            },
            message: "Data Fetched"
        })
    } catch (error) {
        console.log(error)
    }
})

const getStorePayout = asyncHandler(async (req, res) => {
    const { storeId } = req.params;

    const payoutData = await payouts.find({ store: storeId })

    if (!payoutData) {
        return res.status(400).json({
            statusCode: 400,
            message: 'Something went wrong'
        })
    }

    return res.status(200).json({
        statusCode: 200,
        data: payoutData.reverse(),
        message: "All payouts fetched"
    })

})

// Function to get current week's Sunday to Saturday range
const calculateCurrentWeekPayout = async (storeId) => {
    const now = new Date();
    const day = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

    // Get Sunday
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - day);
    sunday.setHours(0, 0, 0, 0);

    // Get Saturday
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);

    try {
        const weeklyPayout = await orders.aggregate([
            {
                $match: {
                    store: new ObjectId(storeId), // Match the store
                    status: "delivered",
                    paymentMethod: "cashfree",
                    paymentProcess: "completed",
                    createdAt: { $gte: sunday, $lte: saturday } // Match orders within this week
                }
            },
            {
                $group: {
                    _id: null,
                    totalCurrentWeekPayout: { $sum: "$payoutAmount" } // Sum the delivery charges
                }
            }
        ]);

        return weeklyPayout.length > 0 ? weeklyPayout[0].totalCurrentWeekPayout : 0;
    } catch (err) {
        console.error('Error calculating weekly earnings:', err);
        return 0;
    }
}

const getCurrentWeekPayout = async (req, res) => {
    try {
        const { storeId } = req.params;

        const currentWeekPayout = await calculateCurrentWeekPayout(storeId);

        return res.status(200).json({ currentWeekPayout });

    } catch (error) {
        console.log(error);
    }
};

export {
    createStore,
    businessdetails,
    getCurrentStoreData,
    addCustomDomain,
    updateStoreName,
    updateSocial,
    updatePolicies,
    updateAboutPage,
    changeStoreStatus,
    deleteStore,
    storeData,
    changeCodStatus,
    changeCashfreeStatus,
    addUpi,
    changeUpiStatus,
    deleteUpiId,
    uploadStoreImage,
    getCustomerData,
    getNumbersOfThirtyDays,
    setStorePaymentDetails,
    getStorePayout,
    getCurrentWeekPayout
}