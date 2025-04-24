import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { customers } from "../models/customer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { stores } from "../models/store.model.js";
import { coupons } from "../models/coupon.model.js";

function countOccurrences(array, element) {
    let count = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === element) {
        count++;
      }
    }
    return count;
  }

const createCoupon = asyncHandler(async (req, res) => {
    const {
        storeId,
        code,
        type,
        perCustomer,
        discountPercent,
        flatDiscount,
        minimumOrder,
        maximumDiscount,
        validFromDate,
        validFromTime,
        validTillDate,
        validTillTime,
        status
    } = req.body;

    // Check if store exists
    const storeExist = await stores.findById(storeId);
    if (!storeExist) {
        return res.status(400).json(new ApiResponse(400, "", "Store does not exist"));
    }

    // Check if coupon with the same code already exists for the store
    const couponAlreadyExist = await coupons.findOne({ code: code.toUpperCase(), store: storeExist._id });
    if (couponAlreadyExist) {
        return res.status(400).json(new ApiResponse(400, "", "This coupon code already exists"));
    }

    // Combine date and time fields
    const validFrom = new Date(`${validFromDate}T${validFromTime}`);
    const validTill = new Date(`${validTillDate}T${validTillTime}`);

    // Create a new coupon
    const couponCreated = await coupons.create({
        store: storeId,
        code: code.toUpperCase(),
        perCustomer,
        type,
        percentValue: Number(discountPercent) ? Number(discountPercent) : null,
        flatDiscountAmount: Number(flatDiscount) ? Number(flatDiscount) : null,
        minimumOrderValue: Number(minimumOrder) ? Number(minimumOrder) : null,
        maximumDiscount: Number(maximumDiscount) ? Number(maximumDiscount) : null,
        status: status !== undefined ? status : false, // default to false if status is not provided
        validFrom,
        validTill
    });

    // Add the newly created coupon to the store's coupon list
    storeExist.coupon.push(couponCreated._id);
    await storeExist.save();

    return res.status(201).json(new ApiResponse(201, couponCreated, "Coupon created successfully"));
});


const getCouponData = asyncHandler(async (req, res) => {
    const { storeid } = req.params;

    const store = await stores.findById(storeid).populate("coupon")

    return res.status(200)
        .json(
            new ApiResponse(200, store, "Store coupon data fetched")
        )
})

const getSingleCouponData = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const coupon = await coupons.findById(id)

    return res.status(200)
        .json(
            new ApiResponse(200, coupon, "")
        )
})

const editCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { code, type, perCustomer, discountPercent, flatDiscount, minimumOrder, maximumDiscount, validFromDate, validFromTime, validTillDate, validTillTime, status } = req.body;

    // Combine date and time fields
    const validFrom = new Date(`${validFromDate}T${validFromTime}`);
    const validTill = new Date(`${validTillDate}T${validTillTime}`);

    const editCoupon = await coupons.findOneAndUpdate({ _id: id }, {
        code,
        perCustomer,
        type,
        percentValue: Number(discountPercent) ? Number(discountPercent) : null,
        flatDiscountAmount: Number(flatDiscount) ? Number(flatDiscount) : null,
        minimumOrderValue: Number(minimumOrder) ? Number(minimumOrder) : null,
        maximumDiscount: Number(maximumDiscount) ? Number(maximumDiscount) : null,
        status,
        validFrom,
        validTill
    })

    return res.status(200)
        .json(
            new ApiResponse(200, editCoupon, "Coupon Updated Successfully")
        )
})

const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const couponDeleted = await coupons.findByIdAndDelete(id)

    const store = await stores.findById(couponDeleted.store)
    store.coupon.pop(couponDeleted._id)
    await store.save()

    return res.status(200)
        .json(
            new ApiResponse(200, couponDeleted, "Coupon Deleted")
        )
})

const checkCoupon = asyncHandler(async (req, res) => {
    const { coupon, storeId, customerId } = req.body;

    const couponValid = await coupons.findOne({store: storeId, code: coupon.toUpperCase(), status: true})

    if(!couponValid){
        return res.status(400)
        .json(
            new ApiResponse(400,"","Invaild coupon code")
        )
    }

    const customerAlreadyUsedCoupon = await customers.findOne({ _id: customerId })

    const noOfTimesCouponUsed = countOccurrences(customerAlreadyUsedCoupon.couponsUsed, coupon.toUpperCase())

    if(noOfTimesCouponUsed >= couponValid.perCustomer){
        return res.status(400)
            .json(
                new ApiResponse(400, "", `This coupon can be use ${couponValid.perCustomer} times by a customer`)
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(200, couponValid, "Coupon Applied")
        )
})

export {
    createCoupon,
    getCouponData,
    getSingleCouponData,
    editCoupon,
    deleteCoupon,
    checkCoupon
};
