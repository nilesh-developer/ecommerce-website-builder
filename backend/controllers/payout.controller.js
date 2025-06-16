import { payouts } from "../models/payout.model.js"
import { stores } from "../models/store.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"

const payoutRequest = asyncHandler(async (req, res) => {
    const { storeId } = req.body;
    const store = await stores.findById(storeId)

    if (store.pendingPayout.amount === 0) {
        return res.status(400).json({
            message: "Pending Payout is less than Rs.1"
        })
    }

    const createPayout = await payouts.create({
        store: storeId,
        orders: store?.pendingPayout?.orders,
        amount: store?.pendingPayout?.amount,
        status: "requested"
    })

    store.pendingPayout.orders = []
    store.pendingPayout.amount = 0
    store.payouts.push(createPayout._id)
    await store.save()

    if (!createPayout) {
        return res.status(400).json({
            message: "Something Went Wrong While Requesting Payout"
        })
    }

    return res.status(200).json({
        message: "Payout requested successfully"
    })
})

const getStorePayouts = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const allPayouts = (await payouts.find({ store: storeId })).reverse()

    return res.status(200).json({
        message: "Payouts Fetched",
        data: allPayouts
    })
})

const getAllPayouts = asyncHandler(async (req, res) => {

    const allPayouts = (await payouts.find().populate("orders store")).reverse()

    return res.status(200).json({
        message: "Payouts Fetched",
        data: allPayouts
    })
})


const getPayoutData = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const payout = await payouts.findById(id).populate("store orders");
    // const store = await stores.findById(payout.store).populate("owner")

    if (!payout) {
        return res.status(400).json({
            message: "Something went wrong"
        })
    }

    return res.status(200).json({
        payout,
        message: "Data fetched"
    })

})

const updatePayoutStatus = asyncHandler(async (req, res) => {
    const { payoutId, newStatus } = req.body;

    const updatePayout = await payouts.findByIdAndUpdate(payoutId, {
        status: newStatus
    })

    if (!updatePayout) {
        return res.status(400).json({
            message: "Something went wrong while updating payout status"
        })
    }

    return res.status(200).json({
        message: "Payout Status Updated"
    })
})

const addPayoutTransactionDetails = asyncHandler(async (req, res) => {
    const { payoutId, paymentTransactionNo, paymentMethod, notes } = req.body;

    const addedTransactionDetails = await payouts.findByIdAndUpdate(payoutId, {
        paymentMethod,
        paymentTransactionNo,
        notes,
        status: "processing"
    })

    if (!addedTransactionDetails) {
        return res.status(400).json({
            message: "Something went wrong while adding payment transaction details"
        })
    }

    return res.status(200).json({
        message: "Added Transaction details successfully"
    })
})

export {
    payoutRequest,
    getStorePayouts,
    getAllPayouts,
    getPayoutData,
    updatePayoutStatus,
    addPayoutTransactionDetails
}