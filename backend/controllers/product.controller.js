import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { stores } from "../models/store.model.js";
import { users } from "../models/user.model.js";
import { products } from "../models/product.model.js";
import { categories } from "../models/category.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

function createSlug(name) {
    return name.toLowerCase().replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .substring(0, 50);
}

const addProduct = asyncHandler(async (req, res) => {
    const { name, shortDescription, description, originalPrice, salePrice, category, returnDetails, deliveryDetails, metaTitle, metaDescription, stockQty, stockStatus, tags, variants, storeId, status, affiliateProduct, affiliatePlatformName, affiliateLink } = req.body;
    const images = req.files;

    // Process tags and variants
    const parsedTags = JSON.parse(tags);
    const parsedVariants = JSON.parse(variants);

    // if(name ==
    const slug = createSlug(name)

    const storeExist = await stores.findById(storeId)

    if (!storeExist) {
        return res.status(400)
            .json(
                new ApiResponse(400, "", "Store not exist")
            )
    }

    // Create a new product
    const newProduct = {
        name,
        slug,
        shortDescription,
        description,
        originalPrice,
        salePrice,
        category,
        returnDetails,
        deliveryDetails,
        metaTitle: metaTitle ? metaTitle : name,
        metaDescription: metaDescription ? metaDescription : description,
        stockQty,
        stockStatus,
        tags: parsedTags,
        variants: parsedVariants,
        store: storeId,
        status,
        images: {
            featuredImage: images.featuredImage ? await uploadOnCloudinary(images.featuredImage[0].path) : null,
            image1: images.image1 ? await uploadOnCloudinary(images.image1[0].path) : null,
            image2: images.image2 ? await uploadOnCloudinary(images.image2[0].path) : null,
            image3: images.image3 ? await uploadOnCloudinary(images.image3[0].path) : null,
            image4: images.image4 ? await uploadOnCloudinary(images.image4[0].path) : null
        },
        sizeChartImage: images.sizeChartImage ? await uploadOnCloudinary(images.sizeChartImage[0].path) : null,
        affiliateProduct,
        affiliatePlatformName,
        affiliateLink
    };



    // Save the product to the database (assuming you're using Mongoose)
    const product = await products.create(newProduct);

    storeExist.products.push(product._id)
    await storeExist.save()

    const categoryData = await categories.findById(category)
    categoryData.products.push(product._id)
    await categoryData.save()

    return res.status(200)
        .json(
            new ApiResponse(200, product, "Product added successfully")
        )
})

const getProducts = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const store = await stores.findById(id).populate("products")

    const allProducts = store.products;

    return res.status(200)
        .json(
            new ApiResponse(200, allProducts, "All products fetch successfully")
        )
})

const getProductData = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await products.findById(id).populate("category")

    return res.status(200)
        .json(
            new ApiResponse(200, product, "Product data fetched")
        )
})

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, shortDescription, description, originalPrice, salePrice, category, returnDetails, deliveryDetails, metaTitle, metaDescription, stockQty, stockStatus, tags, variants, storeId, status, affiliateProduct, affiliatePlatformName, affiliateLink } = req.body;
    const images = req.files;

    // Process tags and variants
    const parsedTags = JSON.parse(tags);
    const parsedVariants = JSON.parse(variants);

    // Generate slug
    const slug = createSlug(name);

    // Check if store exists
    const storeExist = await stores.findById(storeId);
    if (!storeExist) {
        return res.status(400).json(new ApiResponse(400, "", "Store not exist"));
    }

    // Fetch the existing product to retain existing images
    const existingProduct = await products.findById(id);
    if (!existingProduct) {
        return res.status(404).json(new ApiResponse(404, "", "Product not found"));
    }

    // Update product with new data and retain existing images if not provided
    const productUpdated = await products.findOneAndUpdate(
        { _id: id },
        {
            name,
            slug,
            shortDescription,
            description,
            originalPrice,
            salePrice,
            category,
            returnDetails,
            deliveryDetails,
            metaTitle: metaTitle ? metaTitle : name,
            metaDescription: metaDescription ? metaDescription : description,
            stockQty,
            stockStatus,
            tags: parsedTags,
            variants: parsedVariants,
            status,
            images: {
                featuredImage: await uploadOnCloudinary(images?.featuredImage?.[0]?.path) || existingProduct.images.featuredImage,
                image1: await uploadOnCloudinary(images?.image1?.[0]?.path) || existingProduct.images.image1,
                image2: await uploadOnCloudinary(images?.image2?.[0]?.path) || existingProduct.images.image2,
                image3: await uploadOnCloudinary(images?.image3?.[0]?.path) || existingProduct.images.image3,
                image4: await uploadOnCloudinary(images?.image4?.[0]?.path) || existingProduct.images.image4,
            },
            sizeChartImage: images.sizeChartImage ? await uploadOnCloudinary(images.sizeChartImage[0].path) : null,
            affiliateProduct,
            affiliatePlatformName,
            affiliateLink
        },
        { new: true } // This option returns the updated document
    );

    return res.status(200).json(new ApiResponse(200, productUpdated, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const productDeleted = await products.findByIdAndDelete(id)

    const store = await stores.findById(productDeleted.store)

    store.products.pop(productDeleted._id)
    await store.save()

    return res.status(200)
        .json(
            new ApiResponse(200, productDeleted, "Product deleted")
        )
})

const searchProducts = asyncHandler(async (req, res) => {
    const query = req.query.q || '';
    const productData = await products.find({
        name: { $regex: query, $options: 'i' },
    });
    return res.status(200)
        .json(
            new ApiResponse(200, productData, "Product Retrieved")
        )
})


export {
    addProduct,
    getProducts,
    getProductData,
    searchProducts,
    updateProduct,
    deleteProduct
}