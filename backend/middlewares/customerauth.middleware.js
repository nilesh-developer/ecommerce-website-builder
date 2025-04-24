import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";

export const verifyCustomerJwt = async function (req, res, next) {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if (!token) {
            return res.status(400).json(
                new ApiResponse(400,"", "Unauthorized request")
            )
        } else {
            const tokenDetails = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
                req.customer = tokenDetails
                next()
        }
    } catch (error) {
        console.log(error)
    }
}
