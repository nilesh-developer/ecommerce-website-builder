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

const createCategory = asyncHandler(async (req, res) => {
    const { categoryName, description, storeId } = req.body;
    const slug = createSlug(categoryName)

    if (categoryName === "") {
        return res.status(400)
            .json(
                new ApiResponse(400, "", "Category name is required")
            )
    }

    if (!req.file) {
        return res.status(400)
            .json(
                new ApiResponse(400, "", "Category image is required")
            )
    }

    const store = await stores.findById(storeId)

    const categoryExist = await categories.findOne({ name: categoryName })

    if (categoryExist) {
        return res.status(400)
            .json(
                new ApiResponse("400", "", "Category with this name already exist")
            )
    }

    let imagePath;

    if(req.file?.filename){
        imagePath = await uploadOnCloudinary(req.file?.path)
    }

    const category = await categories.create({
        store: storeId,
        name: categoryName,
        description,
        image: imagePath,
        slug
    })

    store.categories.push(category._id)
    await store.save()

    return res.status(200)
        .json(
            new ApiResponse(200, category, "Category created successfully")
        )
})

const getCategoryData = asyncHandler(async (req, res) => {
    const category = await categories.find({ store: req.params.storeId })

    return res.status(200)
        .json(
            new ApiResponse(200, category, "Category data fetched successfully")
        )
})

const getCategory = asyncHandler(async (req, res) => {
    const category = await categories.findById(req.params.id).populate("products")

    return res.status(200)
        .json(
            new ApiResponse(200, category, "Category data fetched successfully")
        )
})

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { categoryName, description } = req.body;
    const slug = createSlug(categoryName)

    let imagePath;

    if(req.file?.filename){
        imagePath = await uploadOnCloudinary(req.file?.path)
    }

    const category = await categories.findByIdAndUpdate(id, {
        $set: {
            name: categoryName,
            description,
            image: imagePath,
            slug
        }
    },
        {
            new: true
        })

    return res.status(200)
        .json(
            new ApiResponse(200, category, "Category updated successfully")
        )
})

export {
    createCategory,
    getCategoryData,
    updateCategory,
    getCategory
}