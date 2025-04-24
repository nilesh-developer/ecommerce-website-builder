import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stores"
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    images: {
        featuredImage: { type: String },
        image1: { type: String },
        image2: { type: String },
        image3: { type: String },
        image4: { type: String }
    },
    shortDescription: {
        type: String
    },
    description: {
        type: String
    },
    originalPrice: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number
    },
    variants: [{
        type: Object
    }],
    sizeChartImage: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories"
    },
    tags: {
        type: Array
    },
    stockQty: {
        type: Number,
        default: 0
    },
    stockStatus: {
        type: Boolean,
        default: true
    },
    status: {
        type: Boolean,
        default: true
    },
    returnDetails: {
        type: String
    },
    deliveryDetails: {
        type: String
    },
    metaTitle: {
        type: String
    },
    metaDescription: {
        type: String
    },
    affiliateProduct: {
        type: Boolean
    },
    affiliatePlatformName: {
        type: String
    },
    affiliateLink: {
        type: String
    },
})

export const products = mongoose.model("products", ProductSchema)