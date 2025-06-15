import { payouts } from "../models/payout.model.js"
import { stores } from "../models/store.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"

const payoutRequest = asyncHandler(async (req, res) => {
    const { storeId } = req.body;
    const store = await stores.findById(storeId)

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

const getAllPayouts = asyncHandler(async (req,res) => {
    const {storeId} = req.params;

    const allPayouts = (await payouts.find({store: storeId})).reverse()

    return res.status(200).json({
        message: "Payouts Fetched",
        data: allPayouts
    })
})

export {
    payoutRequest,
    getAllPayouts
}