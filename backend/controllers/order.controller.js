import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { stores } from "../models/store.model.js";
import { orders } from "../models/order.model.js";
import { customers } from "../models/customer.model.js";
import nodeMailer from "nodemailer";
import crypto from "crypto";
import { Cashfree } from "cashfree-pg";
import { format } from "date-fns";
import { payouts } from "../models/payout.model.js";

const options = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

function generateOrderId() {
    const uniqueId = crypto.randomBytes(16).toString('hex');

    const hash = crypto.createHash('sha256');
    hash.update(uniqueId);

    const orderId = hash.digest('hex');

    return orderId.substr(0, 12);
}

const initiatePayment = asyncHandler(async (req, res) => {
    const paymentOrderId = await generateOrderId();
    const { amount, phoneNo, customerId, customerName, customerEmail, orderData } = req.body;

    if (orderData?.email === "" || orderData?.name === "" || orderData?.address1 === "" || orderData?.address2 === "" || orderData?.state === "" || orderData?.country === "" || orderData?.pinCode === "") {
        return res.status(404).json(new ApiResponse(404, "", "All fields are required"));
    }

    if (orderData?.paymentMethod === "") {
        return res.status(404).json(new ApiResponse(404, "", "Payment method is not selected"));
    }

    const store = await stores.findById(orderData?.storeId).populate("owner");
    if (!store) {
        return res.status(404).json(new ApiResponse(404, "", "Store not found"));
    }

    const customer = await customers.findById(orderData?.custId);
    if (!customer) {
        return res.status(404).json(new ApiResponse(404, "", "Customer not found"));
    }

    const createOrderDB = async () => {
        const ordered = await orders.create({
            store: orderData?.storeId,
            customerId: orderData?.custId,
            email: orderData?.email,
            name: orderData?.name,
            phoneNo: orderData?.phoneNo,
            address1: String(orderData?.address1),
            address2: String(orderData?.address2),
            state: orderData?.state,
            country: orderData?.country,
            pinCode: orderData?.pinCode,
            paymentMethod: orderData?.paymentMethod,
            totalPrice: orderData?.totalPrice,
            isCouponApplied: orderData?.isCouponApplied,
            discountValue: orderData?.discountValue,
            coupon: orderData?.coupon,
            product: orderData?.cart,
            payoutAmount: Number(Number(orderData?.totalPrice) - (Number(orderData?.totalPrice) * 5 / 100)),
            status: "pending",
            paymentOrderId,
            paymentProcess: "initiated"
        });

        store.orders.push(ordered._id);
        customer.orders.push(ordered._id);

        if (orderData?.isCouponApplied === true) {
            customer.couponsUsed.push(orderData?.coupon?.toUpperCase())
        }

        await store.save();
        await customer.save();
    }

    let request = {
        "order_amount": Number(amount),
        "order_currency": "INR",
        "order_id": paymentOrderId,
        "customer_details": {
            "customer_id": customerId,
            "customer_phone": phoneNo,
            "customer_name": customerName,
            "customer_email": customerEmail
        },
        "order_meta": {
            return_url: `https://${process.env.FRONTEND_URI}/payment-response?order_id=${paymentOrderId}`,
            notify_url: `https://${process.env.BACKEND_URI}/api/order/update-cashfree-payment`
        }
    }

    Cashfree.PGCreateOrder("2023-08-01", request).then(async (response) => {
        await createOrderDB(); // Ensure the DB is updated only after order creation
        return res.status(200).json(response.data);
    }).catch(error => {
        console.error(error.response.data.message);
        return res.status(500).json(error.response.data);
    })
})

const verifyPayment = asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    const updateOrderPaymentStatusInDB = async (response) => {
        try {
            const dbOrderData = await orders.updateMany(
                { paymentOrderId: orderId },
                { $set: { paymentProcess: response[0]?.payment_status === "SUCCESS" ? "completed" : "failed", status: response[0]?.payment_status === "SUCCESS" ? "pending" : "canceled" } }
            );

            if (!dbOrderData) {
                console.log("Order Payment Status in DB is not Updated")
            }

            if (response[0]?.payment_status === "SUCCESS") {
                const store = await stores.findById(dbOrderData.store)
                store.revenue = Number(store.revenue) + Number(dbOrderData.totalPrice)
                await store.save()

                return res.status(200).json({
                    message: "Transaction Successful"
                });
            }
            return res.status(400).json({
                message: "Transaction Failed"
            });
        } catch (error) {
            console.log(error)
        }
    }

    const transactionFailed = async () => {
        const dbOrderData = await orders.updateMany(
            { paymentOrderId: orderId },
            { $set: { paymentProcess: "failed", status: "canceled" } }
        );

        if (!dbOrderData) {
            console.log("Order Payment Status is not updated")
        }
    }

    Cashfree.PGOrderFetchPayments("2023-08-01", orderId).then(async (response) => {
        await updateOrderPaymentStatusInDB(response)
    }).catch(async (error) => {
        await transactionFailed()
        console.error(error.response.data.message);
        res.status(400).json({
            message: "Transaction Failed"
        });
    })
})

const cashfreePaymentDetails = asyncHandler(async (req, res) => {
    const { order_id, order_status, payment_mode, payment_time, cf_payment_id } = req.body;

    const matchedOrders = await orders.find({ paymentOrderId: order_id });
    const store = await stores.findById(matchedOrders?._id)

    if (!matchedOrders || matchedOrders.length === 0) {
        return res.status(404).json({ message: 'Orders not found' });
    }

    const updatePromises = matchedOrders.map(async (order) => {
        if (order_status === 'SUCCESS') {
            order.paymentDetails.status = 'paid';
            order.paymentProcess = 'completed';
            order.paymentDetails.paymentProcess = 'completed';
            order.paymentDetails.paymentMode = payment_mode;
            order.paymentDetails.paymentTime = payment_time;
            order.paymentDetails.paymentId = cf_payment_id;

            const itemsHTML = matchedOrders?.product?.map((product) => `
    <tr>
        <td>${product?.name}</td>
        <td>${product?.quantity}</td>
        <td>&#8377;${product?.salePrice}</td>
    </tr>
`).join('');


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
                from: `${matchedOrders?.store.name} <${process.env.OTP_EMAIL_ID}>`,
                to: matchedOrders?.email,
                subject: `Your Order for ${matchedOrders?.product[0].name} has been successfully placed`,
                html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            font-size: 24px;
            color: #4CAF50;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
        }
        .order-details {
            margin: 20px 0;
        }
        .order-details table {
            width: 100%;
            border-collapse: collapse;
        }
        .order-details table, .order-details th, .order-details td {
            border: 1px solid #ddd;
        }
        .order-details th, .order-details td {
            padding: 10px;
            text-align: left;
        }
        .order-summary {
            margin: 20px 0;
            text-align: right;
        }
        .button-container {
            text-align: center;
            margin-top: 20px;
        }
        .button-container a {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
        }
        .button-container a:hover {
            background-color: #45a049;
        }
        a {
            color: #4CAF50;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>

    <div class="email-container">
        <h1>Order Confirmation - Thank You for Your Purchase!</h1>
        <p>Dear ${matchedOrders?.name},</p>
        <p>We are pleased to confirm that your order has been successfully placed. Thank you for shopping with us!</p>
        
        <div class="order-details">
            <h2>Order Details</h2>
            <table>
                <tr>
                    <th>Order Number</th>
                    <td>${matchedOrders?._id}</td>
                </tr>
                <tr>
                    <th>Order Date</th>
                    <td>${date.toLocaleDateString('en-IN', options)}
                    </td>
                </tr >
    <tr>
        <th>Payment Method</th>
        <td>${matchedOrders?.paymentMethod}</td>
    </tr>
            </table >
        </div >
        
        <div class="order-details">
            <h2>Items Purchased</h2>
            <table>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
                ${itemsHTML}
            </table>
        </div>
        
        <div class="order-summary">
            <p><strong>Total Amount: </strong> &#8377;${matchedOrders?.totalPrice}</p>
        </div>

        <p>Your order will be processed and shipped shortly. You can track your order status by logging into your account.</p>

        <p>If you have any questions, feel free to contact our customer service team at 
            <a href="mailto:${store?.owner?.email}">email</a>.
        </p>

        <p>Thank you again for your purchase! We hope to see you again soon.</p>

        <p>Best Regards,<br>Your Store Team</p>
        </div >

    </body >
            </html >`
            }

            emailProvider.sendMail(receiver, (error, emailResponse) => {
                if (error) {
                    console.log("Something went wrong while sending email to customer")
                } else {
                    console.log("Email sent successfully to customer")
                }
            })

            const sellerReceiver = {
                from: `Eazzy < ${process.env.OTP_EMAIL_ID}> `,
                to: store.owner.email,
                subject: `Order received from your store ${store.name} !`,
                html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Received Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            font-size: 24px;
            color: #4CAF50;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
        }
        .order-details {
            margin: 20px 0;
        }
        .order-details table {
            width: 100%;
            border-collapse: collapse;
        }
        .order-details table, .order-details th, .order-details td {
            border: 1px solid #ddd;
        }
        .order-details th, .order-details td {
            padding: 10px;
            text-align: left;
        }
        .order-summary {
            margin: 20px 0;
            text-align: right;
        }
        .button-container {
            text-align: center;
            margin-top: 20px;
        }
        .button-container a {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1>New Order Received from Your Store!</h1>
        <p>Dear ${store.owner.email},</p>
        <p>We are excited to inform you that a new order has been placed on your store!</p>
        
        <div class="order-details">
            <h2>Order Details</h2>
            <table>
                <tr>
                    <th>Order Number</th>
                    <td>${matchedOrders?._id}</td>
                </tr>
                <tr>
                    <th>Customer Name</th>
                    <td>${matchedOrders?.name}</td>
                </tr>
                <tr>
                    <th>Customer Email</th>
                    <td>${matchedOrders?.email}</td>
                </tr>
                <tr>
                    <th>Customer Mobile no.</th>
                    <td>${matchedOrders?.phoneNo}</td>
                </tr>
            </table>
        </div>
        <div class="order-details">
            <h2>Items Ordered</h2>
            <table>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
                ${itemsHTML}
            </table>
        </div>
        <div class="order-summary">
        <strong>Shipping address: </strong>
            <p>${matchedOrders?.address1},
                ${matchedOrders?.address2},
                ${matchedOrders?.state},
                ${matchedOrders?.country},
                ${matchedOrders?.pinCode}</p>
        </div>
        <div class="order-summary">
            <p><strong>Total Amount: </strong>&#8377;${matchedOrders?.totalPrice}</p>
        </div>
        <p>To view the order details, please log in to your seller dashboard.</p>
        <div class="button-container">
            <a href="https://eazzy.store/seller/orders/${matchedOrders?._id}" target="_blank">View Order</a>
        </div>
        <p>If you have any questions, feel free to contact us at <a href="mailto:${process.env.OTP_EMAIL_ID}">email</a>.</p>
    </div>
    </body>
            </html>`
            }

            emailProvider.sendMail(sellerReceiver, (error, emailResponse) => {
                if (error) {
                    console.log("Something went wrong while sending email to seller")
                } else {
                    console.log("Email sent successfully to seller")
                }
            })

        } else if (order_status === 'FAILED') {
            order.status = 'failed';
            order.paymentProcess = 'failed';
            order.paymentDetails.paymentProcess = 'failed';

            const itemsHTML = matchedOrders?.product?.map((product) => `
    <tr>
        <td>${product?.name}</td>
        <td>${product?.quantity}</td>
        <td>&#8377;${product?.salePrice}</td>
    </tr>
`).join('');


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
                from: `${matchedOrders?.store.name} <${process.env.OTP_EMAIL_ID}>`,
                to: matchedOrders?.email,
                subject: `Your Order for ${matchedOrders?.product[0].name} has been successfully placed`,
                html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    font-size: 24px;
                    color: #4CAF50;
                }
                p {
                    font-size: 16px;
                    line-height: 1.5;
                }
                .order-details {
                    margin: 20px 0;
                }
                .order-details table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .order-details table, .order-details th, .order-details td {
                    border: 1px solid #ddd;
                }
                .order-details th, .order-details td {
                    padding: 10px;
                    text-align: left;
                }
                .order-summary {
                    margin: 20px 0;
                    text-align: right;
                }
                .button-container {
                    text-align: center;
                    margin-top: 20px;
                }
                .button-container a {
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 4px;
                    font-weight: bold;
                }
                .button-container a:hover {
                    background-color: #45a049;
                }
                a {
                    color: #4CAF50;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
        
            <div class="email-container">
                <h1>Order Confirmation - Thank You for Your Purchase!</h1>
                <p>Dear ${matchedOrders?.name},</p>
                <p>We are pleased to confirm that your order has been successfully placed. Thank you for shopping with us!</p>
                
                <div class="order-details">
                    <h2>Order Details</h2>
                    <table>
                        <tr>
                            <th>Order Number</th>
                            <td>${matchedOrders?._id}</td>
                        </tr>
                        <tr>
                            <th>Order Date</th>
                            <td>${date.toLocaleDateString('en-IN', options)}
                            </td>
                        </tr >
            <tr>
                <th>Payment Method</th>
                <td>${matchedOrders?.paymentMethod}</td>
            </tr>
                    </table >
                </div >
                
                <div class="order-details">
                    <h2>Items Purchased</h2>
                    <table>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                        ${itemsHTML}
                    </table>
                </div>
                
                <div class="order-summary">
                    <p><strong>Total Amount: </strong> &#8377;${matchedOrders?.totalPrice}</p>
                </div>
        
                <p>Your order will be processed and shipped shortly. You can track your order status by logging into your account.</p>
        
                <p>If you have any questions, feel free to contact our customer service team at 
                    <a href="mailto:${store?.owner?.email}">email</a>.
                </p>
        
                <p>Thank you again for your purchase! We hope to see you again soon.</p>
        
                <p>Best Regards,<br>Your Store Team</p>
                </div >
        
            </body >
                    </html >`
            }

            emailProvider.sendMail(receiver, (error, emailResponse) => {
                if (error) {
                    console.log("Something went wrong while sending email to customer")
                } else {
                    console.log("Email sent successfully to customer")
                }
            })

            const sellerReceiver = {
                from: `Eazzy < ${process.env.OTP_EMAIL_ID}> `,
                to: store.owner.email,
                subject: `Order received from your store ${store.name} !`,
                html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Received Notification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    font-size: 24px;
                    color: #4CAF50;
                }
                p {
                    font-size: 16px;
                    line-height: 1.5;
                }
                .order-details {
                    margin: 20px 0;
                }
                .order-details table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .order-details table, .order-details th, .order-details td {
                    border: 1px solid #ddd;
                }
                .order-details th, .order-details td {
                    padding: 10px;
                    text-align: left;
                }
                .order-summary {
                    margin: 20px 0;
                    text-align: right;
                }
                .button-container {
                    text-align: center;
                    margin-top: 20px;
                }
                .button-container a {
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 4px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <h1>New Order Received from Your Store!</h1>
                <p>Dear ${store.owner.email},</p>
                <p>We are excited to inform you that a new order has been placed on your store!</p>
                
                <div class="order-details">
                    <h2>Order Details</h2>
                    <table>
                        <tr>
                            <th>Order Number</th>
                            <td>${matchedOrders?._id}</td>
                        </tr>
                        <tr>
                            <th>Customer Name</th>
                            <td>${matchedOrders?.name}</td>
                        </tr>
                        <tr>
                            <th>Customer Email</th>
                            <td>${matchedOrders?.email}</td>
                        </tr>
                        <tr>
                            <th>Customer Mobile no.</th>
                            <td>${matchedOrders?.phoneNo}</td>
                        </tr>
                    </table>
                </div>
                <div class="order-details">
                    <h2>Items Ordered</h2>
                    <table>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                        ${itemsHTML}
                    </table>
                </div>
                <div class="order-summary">
                <strong>Shipping address: </strong>
                    <p>${matchedOrders?.address1},
                        ${matchedOrders?.address2},
                        ${matchedOrders?.state},
                        ${matchedOrders?.country},
                        ${matchedOrders?.pinCode}</p>
                </div>
                <div class="order-summary">
                    <p><strong>Total Amount: </strong>&#8377;${matchedOrders?.totalPrice}</p>
                </div>
                <p>To view the order details, please log in to your seller dashboard.</p>
                <div class="button-container">
                    <a href="https://eazzy.store/seller/orders/${matchedOrders?._id}" target="_blank">View Order</a>
                </div>
                <p>If you have any questions, feel free to contact us at <a href="mailto:${process.env.OTP_EMAIL_ID}">email</a>.</p>
            </div>
            </body>
                    </html>`
            }

            emailProvider.sendMail(sellerReceiver, (error, emailResponse) => {
                if (error) {
                    console.log("Something went wrong while sending email to seller")
                } else {
                    console.log("Email sent successfully to seller")
                }
            })
        }

        return order.save();
    });

    await Promise.all(updatePromises);

    return res.status(200).json({ message: 'Payment status updated for all related orders' });
})

const paymentDataByPaymentOrderId = asyncHandler(async (req, res) => {
    const { paymentOrderId } = req.params;
    const dbOrderData = await orders.findOne(
        { paymentOrderId: paymentOrderId }
    );

    if (!dbOrderData) {
        console.log("Not Found Payment")
        return res.status(400).json({
            message: "Not Found Payment"
        })
    }

    return res.status(200).json({ paymentProcess: dbOrderData.paymentProcess })
})

const orderPlaced = asyncHandler(async (req, res) => {
    const { storeId, custId, email, name, phoneNo, address1, address2, state, country, pinCode, paymentMethod, isCouponApplied, discountValue, coupon, totalPrice, cart } = req.body;

    if (email === "" || name === "" || address1 === "" || address2 === "" || state === "" || country === "" || pinCode === "") {
        return res.status(404).json(new ApiResponse(404, "", "All fields are required"));
    }

    if (paymentMethod === "") {
        return res.status(404).json(new ApiResponse(404, "", "Payment method is not selected"));
    }

    const store = await stores.findById(storeId).populate("owner");
    if (!store) {
        return res.status(404).json(new ApiResponse(404, "", "Store not found"));
    }

    const customer = await customers.findById(custId);
    if (!customer) {
        return res.status(404).json(new ApiResponse(404, "", "Customer not found"));
    }

    const ordered = await orders.create({
        store: storeId,
        customerId: custId,
        email,
        name,
        phoneNo,
        address1: String(address1),
        address2: String(address2),
        state,
        country,
        pinCode,
        paymentMethod,
        totalPrice,
        isCouponApplied,
        discountValue,
        coupon,
        product: cart,
        status: "pending"
    });

    store.orders.push(ordered._id);
    customer.orders.push(ordered._id);

    const date = new Date(ordered.createdAt);

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
        from: `${store.name} <${process.env.OTP_EMAIL_ID}>`,
        to: customer.email,
        subject: `Your Order for ${ordered.product[0].name} has been successfully placed`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            font-size: 24px;
            color: #4CAF50;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
        }
        .order-details {
            margin: 20px 0;
        }
        .order-details table {
            width: 100%;
            border-collapse: collapse;
        }
        .order-details table, .order-details th, .order-details td {
            border: 1px solid #ddd;
        }
        .order-details th, .order-details td {
            padding: 10px;
            text-align: left;
        }
        .order-summary {
            margin: 20px 0;
            text-align: right;
        }
        .button-container {
            text-align: center;
            margin-top: 20px;
        }
        .button-container a {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
        }
        .button-container a:hover {
            background-color: #45a049;
        }
        a {
            color: #4CAF50;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>

    <div class="email-container">
        <h1>Order Confirmation - Thank You for Your Purchase!</h1>
        <p>Dear ${ordered.name},</p>
        <p>We are pleased to confirm that your order has been successfully placed. Thank you for shopping with us!</p>
        
        <div class="order-details">
            <h2>Order Details</h2>
            <table>
                <tr>
                    <th>Order Number</th>
                    <td>${ordered._id}</td>
                </tr>
                <tr>
                    <th>Order Date</th>
                    <td>${date.toLocaleDateString('en-IN', options)}
                    </td>
                </tr >
    <tr>
        <th>Payment Method</th>
        <td>${ordered.paymentMethod}</td>
    </tr>
            </table >
        </div >

        <div class="order-details">
            <h2>Items Purchased</h2>
            <table>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
                ${ordered.product.map(async (product) => (
            `<tr>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>&#8377;{product.salePrice}</td>
                </tr>`
        ))
            }
            </table>
        </div>

        <div class="order-summary">
            <p><strong>Total Amount: </strong> &#8377;${ordered.totalPrice}</p>
        </div>

        <p>Your order will be processed and shipped shortly. You can track your order status by logging into your account.</p>

        <p>If you have any questions, feel free to contact our customer service team at 
            <a href="mailto:${store.owner.email}">email</a>.
        </p>

        <p>Thank you again for your purchase! We hope to see you again soon.</p>

        <p>Best Regards,<br>Your Store Team</p>
        </div >

    </body >
            </html >`
    }

    emailProvider.sendMail(receiver, (error, emailResponse) => {
        if (error) {
            console.log("Something went wrong while sending email to customer")
        } else {
            console.log("Email sent successfully to customer")
        }
    })

    const sellerReceiver = {
        from: `Eazzy < ${process.env.OTP_EMAIL_ID}> `,
        to: store.owner.email,
        subject: `Order received from your store ${store.name} !`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Received Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            font-size: 24px;
            color: #4CAF50;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
        }
        .order-details {
            margin: 20px 0;
        }
        .order-details table {
            width: 100%;
            border-collapse: collapse;
        }
        .order-details table, .order-details th, .order-details td {
            border: 1px solid #ddd;
        }
        .order-details th, .order-details td {
            padding: 10px;
            text-align: left;
        }
        .order-summary {
            margin: 20px 0;
            text-align: right;
        }
        .button-container {
            text-align: center;
            margin-top: 20px;
        }
        .button-container a {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1>New Order Received from Your Store!</h1>
        <p>Dear ${store.owner.email},</p>
        <p>We are excited to inform you that a new order has been placed on your store!</p>
        
        <div class="order-details">
            <h2>Order Details</h2>
            <table>
                <tr>
                    <th>Order Number</th>
                    <td>${ordered._id}</td>
                </tr>
                <tr>
                    <th>Customer Name</th>
                    <td>${ordered.name}</td>
                </tr>
                <tr>
                    <th>Customer Email</th>
                    <td>${ordered.email}</td>
                </tr>
                <tr>
                    <th>Customer Mobile no.</th>
                    <td>${ordered.phoneNo}</td>
                </tr>
            </table>
        </div>
        <div class="order-details">
            <h2>Items Ordered</h2>
            <table>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
                ${ordered.product.map(async (product) => (
            `<tr>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>&#8377;{product.salePrice}</td>
                </tr>`
        ))
            }
            </table>
        </div>
        <div class="order-summary">
        <strong>Shipping address: </strong>
            <p>${ordered.address1},
                ${ordered.address2},
                ${ordered.state},
                ${ordered.country},
                ${ordered.pinCode}</p>
        </div>
        <div class="order-summary">
            <p><strong>Total Amount: </strong>&#8377;${ordered.totalPrice}</p>
        </div>
        <p>To view the order details, please log in to your seller dashboard.</p>
        <div class="button-container">
            <a href="https://eazzy.store/seller/orders/${ordered._id}" target="_blank">View Order</a>
        </div>
        <p>If you have any questions, feel free to contact us at <a href="mailto:${process.env.OTP_EMAIL_ID}">email</a>.</p>
    </div>
    </body>
            </html>`
    }

    emailProvider.sendMail(sellerReceiver, (error, emailResponse) => {
        if (error) {
            console.log("Something went wrong while sending email to seller")
        } else {
            console.log("Email sent successfully to seller")
        }
    })

    if (isCouponApplied === true) {
        customer.couponsUsed.push(coupon.toUpperCase())
    }

    store.revenue = Number(store.revenue) + Number(totalPrice)
    await store.save();
    await customer.save();


    return res.status(200).json(
        new ApiResponse(200, "", "Order Placed Successfully")
    );
});

const codOrderPlaced = asyncHandler(async (req, res) => {
    const { storeId, custId, email, name, phoneNo, address1, address2, state, country, pinCode, paymentMethod, isCouponApplied, discountValue, coupon, totalPrice, cart } = req.body;

    if (email === "" || name === "" || address1 === "" || address2 === "" || state === "" || country === "" || pinCode === "") {
        return res.status(404).json(new ApiResponse(404, "", "All fields are required"));
    }

    if (paymentMethod === "") {
        return res.status(404).json(new ApiResponse(404, "", "Payment method is not selected"));
    }

    const store = await stores.findById(storeId).populate("owner");
    if (!store) {
        return res.status(404).json(new ApiResponse(404, "", "Store not found"));
    }

    const customer = await customers.findById(custId);
    if (!customer) {
        return res.status(404).json(new ApiResponse(404, "", "Customer not found"));
    }

    const ordered = await orders.create({
        store: storeId,
        customerId: custId,
        email,
        name,
        phoneNo,
        address1: String(address1),
        address2: String(address2),
        state,
        country,
        pinCode,
        paymentMethod,
        totalPrice,
        isCouponApplied,
        discountValue,
        coupon,
        product: cart,
        status: "pending"
    });

    store.orders.push(ordered._id);
    customer.orders.push(ordered._id);

    const date = new Date(ordered.createdAt);

    const itemsHTML = ordered.product?.map((product) => `
    <tr>
        <td>${product?.name}</td>
        <td>${product?.quantity}</td>
        <td>&#8377;${product?.salePrice}</td>
    </tr>
`).join('');


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
        from: `${store.name} <${process.env.OTP_EMAIL_ID}>`,
        to: customer.email,
        subject: `Your Order has been successfully placed`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            font-size: 24px;
            color: #4CAF50;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
        }
        .order-details {
            margin: 20px 0;
        }
        .order-details table {
            width: 100%;
            border-collapse: collapse;
        }
        .order-details table, .order-details th, .order-details td {
            border: 1px solid #ddd;
        }
        .order-details th, .order-details td {
            padding: 10px;
            text-align: left;
        }
        .order-summary {
            margin: 20px 0;
            text-align: right;
        }
        .button-container {
            text-align: center;
            margin-top: 20px;
        }
        .button-container a {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
        }
        .button-container a:hover {
            background-color: #45a049;
        }
        a {
            color: #4CAF50;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>

    <div class="email-container">
        <h1>Order Confirmation - Thank You for Your Purchase!</h1>
        <p>Dear ${ordered.name},</p>
        <p>We are pleased to confirm that your order has been successfully placed. Thank you for shopping with us!</p>
        
        <div class="order-details">
            <h2>Order Details</h2>
            <table>
                <tr>
                    <th>Order Number</th>
                    <td>${ordered._id}</td>
                </tr>
                <tr>
                    <th>Order Date</th>
                    <td>${date.toLocaleDateString('en-IN', options)}
                    </td>
                </tr >
    <tr>
        <th>Payment Method</th>
        <td>${ordered.paymentMethod}</td>
    </tr>
            </table >
        </div >
        
        <div class="order-details">
            <h2>Items Purchased</h2>
            <table>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
                ${itemsHTML}
            </table>
        </div>
        
        <div class="order-summary">
            <p><strong>Total Amount: </strong> &#8377;${ordered?.totalPrice}</p>
        </div>

        <p>Your order will be processed and shipped shortly. You can track your order status by logging into your account.</p>

        <p>If you have any questions, feel free to contact our customer service team at 
            <a href="mailto:${store.owner.email}">email</a>.
        </p>

        <p>Thank you again for your purchase! We hope to see you again soon.</p>

        <p>Best Regards,<br>Your Store Team</p>
        </div >

    </body >
            </html >`
    }

    emailProvider.sendMail(receiver, (error, emailResponse) => {
        if (error) {
            console.log("Something went wrong while sending email to customer")
        } else {
            console.log("Email sent successfully to customer")
        }
    })

    const sellerReceiver = {
        from: `Eazzy < ${process.env.OTP_EMAIL_ID}> `,
        to: store.owner.email,
        subject: `Order received from your store ${store.name} !`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Received Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            font-size: 24px;
            color: #4CAF50;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
        }
        .order-details {
            margin: 20px 0;
        }
        .order-details table {
            width: 100%;
            border-collapse: collapse;
        }
        .order-details table, .order-details th, .order-details td {
            border: 1px solid #ddd;
        }
        .order-details th, .order-details td {
            padding: 10px;
            text-align: left;
        }
        .order-summary {
            margin: 20px 0;
            text-align: right;
        }
        .button-container {
            text-align: center;
            margin-top: 20px;
        }
        .button-container a {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1>New Order Received from Your Store!</h1>
        <p>Dear ${store.owner.email},</p>
        <p>We are excited to inform you that a new order has been placed on your store!</p>
        
        <div class="order-details">
            <h2>Order Details</h2>
            <table>
                <tr>
                    <th>Order Number</th>
                    <td>${ordered._id}</td>
                </tr>
                <tr>
                    <th>Customer Name</th>
                    <td>${ordered.name}</td>
                </tr>
                <tr>
                    <th>Customer Email</th>
                    <td>${ordered.email}</td>
                </tr>
                <tr>
                    <th>Customer Mobile no.</th>
                    <td>${ordered.phoneNo}</td>
                </tr>
            </table>
        </div>
        <div class="order-details">
            <h2>Items Ordered</h2>
            <table>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
                ${itemsHTML}
            </table>
        </div>
        <div class="order-summary">
        <strong>Shipping address: </strong>
            <p>${ordered.address1},
                ${ordered.address2},
                ${ordered.state},
                ${ordered.country},
                ${ordered.pinCode}</p>
        </div>
        <div class="order-summary">
            <p><strong>Total Amount: </strong>&#8377;${ordered.totalPrice}</p>
        </div>
        <p>To view the order details, please log in to your seller dashboard.</p>
        <div class="button-container">
            <a href="https://eazzy.store/seller/orders/${ordered._id}" target="_blank">View Order</a>
        </div>
        <p>If you have any questions, feel free to contact us at <a href="mailto:${process.env.OTP_EMAIL_ID}">email</a>.</p>
    </div>
    </body>
            </html>`
    }

    emailProvider.sendMail(sellerReceiver, (error, emailResponse) => {
        if (error) {
            console.log("Something went wrong while sending email to seller")
        } else {
            console.log("Email sent successfully to seller")
        }
    })

    if (isCouponApplied === true) {
        customer.couponsUsed.push(coupon.toUpperCase())
    }

    store.revenue = Number(store.revenue) + Number(totalPrice)
    await store.save();
    await customer.save();

    return res.status(200).json(
        new ApiResponse(200, "", "Order Placed Successfully")
    );
});

const getAllOrders = asyncHandler(async (req, res) => {
    const { custId } = req.params;

    const allOrders = await orders.find({ customerId: custId }).sort({ createdAt: -1 })

    return res.status(200)
        .json(
            new ApiResponse(200, allOrders, "all orders fetched")
        )
})

const storeOrders = asyncHandler(async (req, res) => {
    const { storeId } = req.params;

    const order = await orders.find({ store: storeId }).sort({ createdAt: -1 })

    return res.status(200)
        .json(
            new ApiResponse(200, order, "Orders fetched")
        )
})

const getOrderData = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const order = await orders.findById(id)

    if (!order) {
        return res.status(200)
            .json(
                new ApiResponse(400, "", "Something went wrong")
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(200, order, "Order data fetched successfully")
        )
})

const updateStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const updatedStatus = await orders.findOneAndUpdate({ _id: orderId }, {
        status: req.body.status
    }, {
        new: true
    })

    if (!updatedStatus) {
        return res.status(500)
            .json(
                new ApiResponse(500, "", "Something went wrong while updating status")
            )
    }

    const orderData = await orders.findById(orderId).populate("store").populate("customerId");

    const date = new Date(orderData.createdAt);

    if (updatedStatus.status === "delivered") {

        if (updatedStatus.paymentMethod === "cashfree" && updatedStatus.paymentProcess === "completed") {
            const orderDate = new Date(orderData?.createdAt);
            const day = orderDate.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

            // Get Sunday
            const sunday = new Date(orderDate);
            sunday.setDate(orderDate.getDate() - day);
            sunday.setHours(0, 0, 0, 0);

            // Get Saturday
            const saturday = new Date(sunday);
            saturday.setDate(sunday.getDate() + 6);
            saturday.setHours(23, 59, 59, 999);

            const orderWeekGroup = format(sunday, 'dd MMM') + " - " + format(saturday, 'dd MMM')

            const checkWeekPayoutExist = await payouts.findOne({ week: orderWeekGroup })

            if (checkWeekPayoutExist) {
                const now = new Date()
                const currentDay = now.getDay()

                // Get Sunday
                const currentWeekSunday = new Date(now);
                currentWeekSunday.setDate(now.getDate() - currentDay);
                currentWeekSunday.setHours(0, 0, 0, 0);

                // Get Saturday
                const currentWeekSaturday = new Date(sunday);
                currentWeekSaturday.setDate(currentWeekSunday.getDate() + 6);
                currentWeekSaturday.setHours(23, 59, 59, 999);

                const currentWeek = format(currentWeekSunday, 'dd MMM') + " - " + format(currentWeekSaturday, 'dd MMM')

                if (currentWeek === orderWeekGroup) {
                    checkWeekPayoutExist.orders.push(updatedStatus._id)
                    checkWeekPayoutExist.amount = Number(checkWeekPayoutExist.amount) + Number(updatedStatus.payoutAmount)
                    await checkWeekPayoutExist.save()
                } else {
                    if (checkWeekPayoutExist.status === "pending") {
                        checkWeekPayoutExist.orders.push(updatedStatus._id)
                        checkWeekPayoutExist.amount = Number(checkWeekPayoutExist.amount) + Number(updatedStatus.payoutAmount)
                        await checkWeekPayoutExist.save()
                    } else {
                        const store = await stores.findById(orderData?.store?._id)
                        store.additionalPreviousWeekPayout.orders.push(updatedStatus._id)
                        store.additionalPreviousWeekPayout.amount = Number(store?.additionalPreviousWeekPayout?.amount) + Number(updatedStatus.payoutAmount)
                        await store.save()
                    }
                }

            } else {
                const createWeekPayout = await payouts.create({
                    store: updatedStatus.store,
                    week: orderWeekGroup,
                    orders: [updatedStatus._id],
                    paymentWeekStart: sunday,
                    paymentWeekEnd: saturday,
                    amount: updatedStatus.payoutAmount,
                    status: "pending"
                })
            }
        }

        // Send Email
        const itemsHTML = orderData.product?.map((product) => `
    <tr>
        <td>${product?.name}</td>
        <td>${product?.quantity}</td>
        <td>&#8377;${product?.salePrice}</td>
    </tr>
`).join('');
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
            from: `${orderData.store.name} <${process.env.OTP_EMAIL_ID}>`,
            to: orderData.customerId.email,
            subject: `${orderData.product[0].name} from your order have been delivered`,
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            font-size: 24px;
            color: #4CAF50;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
        }
        .order-details {
            margin: 20px 0;
        }
        .order-details table {
            width: 100%;
            border-collapse: collapse;
        }
        .order-details table, .order-details th, .order-details td {
            border: 1px solid #ddd;
        }
        .order-details th, .order-details td {
            padding: 10px;
            text-align: left;
        }
        .order-summary {
            margin: 20px 0;
            text-align: right;
        }
        .button-container {
            text-align: center;
            margin-top: 20px;
        }
        .button-container a {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
        }
        .button-container a:hover {
            background-color: #45a049;
        }
        a {
            color: #4CAF50;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>

    <div class="email-container">
        <h1>Order have been delivered successfully - Thank You for Your Purchase!</h1>
        <p>Hi ${orderData.customerId.name},</p>
        <p>We are happy to let you know that items from your order have been delivered. You can download a copy of the invoice for item(s) delivered by ${orderData.store.name}. Thank you for shopping with us!</p>
        
        <div class="order-details">
            <h2>Order Details</h2>
            <table>
                <tr>
                    <th>Order Number</th>
                    <td>${orderData._id}</td>
                </tr>
                <tr>
                    <th>Order Date</th>
                    <td>${date.toLocaleDateString('en-IN', options)}
                    </td>
                </tr >
    <tr>
        <th>Payment Method</th>
        <td>${orderData.paymentMethod}</td>
    </tr>
            </table >
        </div >

        <div class="order-details">
            <h2>Items Purchased</h2>
            <table>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
                 ${itemsHTML}
            </table>
        </div>

        <div class="order-summary">
            <p><strong>Total Amount: </strong> &#8377;${orderData.totalPrice}</p>
        </div>

        <p>Your order will be processed and shipped shortly. You can track your order status by logging into your account.</p>

        <p>If you have any questions, feel free to contact our customer service team at 
            <a href="mailto:${process.env.OTP_EMAIL_ID}">email</a>.
        </p>

        <p>Thank you again for your purchase! We hope to see you again soon.</p>

        <p>Best Regards,<br>Your Store Team</p>
        </div >

    </body >
            </html >`
        }

        emailProvider.sendMail(receiver, (error, emailResponse) => {
            if (error) {
                console.log(error)
                console.log("Something went wrong while sending email to customer")
            } else {
                console.log("Email sent successfully to customer")
            }
        })

    }

    return res.status(200)
        .json(
            new ApiResponse(200, updatedStatus, "Status updated")
        )
})

const acceptOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { trackingId, trackingUrl, selectedOption } = req.body;

    const updatedStatus = await orders.findOneAndUpdate({ _id: orderId }, {
        status: req.body.status,
        isTrackingDetailsProvided: selectedOption,
        trackingNo: trackingId,
        trackingPageUrl: trackingUrl
    })

    if (!updatedStatus) {
        return res.status(500)
            .json(
                new ApiResponse(500, "", "Something went wrong while updating status")
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(200, updatedStatus, "Order accepted")
        )
})

const cancelOrder = asyncHandler((async (req, res) => {
    const { orderId } = req.params;
    const { customerId } = req.body;

    const updatedStatus = await orders.findOneAndUpdate({ _id: orderId, customerId: customerId }, {
        status: req.body.status
    })

    if (!updatedStatus) {

        return res.status(500)
            .json(
                new ApiResponse(500, "", "Failed to cancel order")
            )
    }

    const store = await stores.findById(updatedStatus.store.toString());
    store.revenue = Number(store.revenue) - Number(updatedStatus.totalPrice);
    await store.save();

    return res.status(200)
        .json(
            new ApiResponse(200, updatedStatus, "Order canceled")
        )
}))

export {
    initiatePayment,
    verifyPayment,
    cashfreePaymentDetails,
    paymentDataByPaymentOrderId,
    orderPlaced,
    codOrderPlaced,
    getAllOrders,
    storeOrders,
    getOrderData,
    updateStatus,
    acceptOrder,
    cancelOrder
}