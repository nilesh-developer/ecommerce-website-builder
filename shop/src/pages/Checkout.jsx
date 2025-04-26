import React, { useState } from 'react'
import { useCart } from '../store/CartContext';
import toast from 'react-hot-toast';
import { useCustomerAuth } from '../store/customerAuth';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useEffect } from 'react';
import axios from "axios"
import { load } from '@cashfreepayments/cashfree-js'

function Checkout() {
    const { storeId, customerData } = useCustomerAuth()
    const [store, setStore] = useState({})
    const navigate = useNavigate()
    const { cart, removeAllProductsFromCart, calculateTotal } = useCart();
    const [coupon, setCoupon] = useState("")
    const [isCouponApplied, setIsCouponApplied] = useState(false)
    const [discountValue, setDiscountValue] = useState(0)
    const [billingDetails, setBillingDetails] = useState({
        email: "",
        name: "",
        phoneNo: "",
        address1: "",
        address2: "",
        state: "",
        country: "India",
        pinCode: "",
        paymentMethod: ""
    })
    const [loading, setLoading] = useState(false)
    const statesOfIndia = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
        "Andaman and Nicobar Islands",
        "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu",
        "Lakshadweep",
        "Delhi",
        "Puducherry",
        "Ladakh",
        "Jammu & Kashmir"
    ];
    const [loadingBtn, setLoadingBtn] = useState(false)

    //Start CashFree PG
    const [orderId, setOrderId] = useState("")

    const getSessionId = async () => {
        try {
            let res = await axios.post(`${import.meta.env.VITE_API_URL}/api/order/initiate-payment`, {
                customerId: customerData._id,
                customerName: billingDetails.name,
                customerEmail: billingDetails.email,
                amount: (calculateTotal() - discountValue),
                phoneNo: billingDetails.phoneNo,
                orderData: {
                    storeId,
                    custId: customerData._id,
                    ...billingDetails,
                    cart: [...cart],
                    isCouponApplied,
                    coupon,
                    discountValue,
                    totalPrice: (calculateTotal() - discountValue),
                }
            });

            console.log(res)

            if (res.data && res.data.payment_session_id) {
                setOrderId(res.data.order_id); // still update state if needed elsewhere
                return {
                    sessionId: res.data.payment_session_id,
                    orderId: res.data.order_id
                };
            } else {
                toast.error("Something went wrong while placing order");
                return null;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const verifyPayment = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/verify-payment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    orderId: id
                })
            })

            if (response.ok) {
                const responseData = await response.json()
                toast.success(responseData?.message)
                navigate(`/payment-response?order_id=${id}`)
            } else {
                const responseData = await response.json()
                toast.error(responseData?.message)
                navigate(`/payment-response?order_id=${id}`)
            }
        } catch (error) {
            console.log(error)
        }
    }
    // End Cashfree PG

    async function getStoreData() {
        const subdomain = window.location.hostname;
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/subdomain/${subdomain}`)
            const responseData = await response.json()
            if (response.ok) {
                setStore(responseData.data)
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        getStoreData()
    }, [])

    useEffect(() => {
        if (customerData) {
            setBillingDetails({
                ...billingDetails,
                email: customerData?.email
            })
        }
    }, [customerData])

    if (loading) {
        return <div className='flex h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    const handleInput = (e) => {
        const { name, value } = e.target;
        setBillingDetails({
            ...billingDetails,
            [name]: value,
        })
    }

    const handleCouponInput = (e) => {
        setCoupon(e.target.value)
    }

    const checkCoupon = async (e) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/coupon/check`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    coupon,
                    storeId,
                    customerId: customerData._id
                })
            })

            const responseData = await response.json();


            if (response.ok) {
                const currentDate = new Date();

                // Convert validFrom and validTill to Date objects
                const fromDate = new Date(responseData.data.validFrom);
                const tillDate = new Date(responseData.data.validTill);

                // Check if the current date is between validFrom and validTill
                if (currentDate >= fromDate && currentDate <= tillDate) {
                    if (responseData.data.type === "percentage") {
                        if (calculateSubtotal() >= responseData.data.minimumOrderValue) {
                            if ((calculateSubtotal() * ((responseData.data.percentValue) / 100)) > responseData.data.minimumOrderValue) {
                                setDiscountValue(responseData.data.maximumDiscount)
                            } else {
                                setDiscountValue(Math.floor(calculateSubtotal() * ((responseData.data.percentValue) / 100)))
                            }
                        }
                    }
                    if (responseData.data.type === "flat") {
                        if (calculateSubtotal() >= responseData.data.minimumOrderValue) {
                            setDiscountValue(responseData.data.flatDiscountAmount)
                        } else {
                            toast.error(`This coupon is valid on shopping above ${"₹" + responseData.data.minimumOrderValue}`)
                        }
                    }
                    toast.success(responseData.message)
                    setIsCouponApplied(true)
                } else {
                    toast.error("Coupon is invalid");
                }
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleCheckout = async (e) => {
        e.preventDefault()
        try {
            setLoadingBtn(true)
            //Start CashFree PG
            if (billingDetails.email === "" || billingDetails.name === "" || billingDetails.address1 === "" || billingDetails.address2 === "" || billingDetails.state === "" || billingDetails.country === "" || billingDetails.pinCode === "") {
                toast.error("All feilds are required")
                return
            }

            if (billingDetails.paymentMethod === "") {
                toast.error("Select atleast one payment method")
            }

            if (billingDetails.paymentMethod === "cashfree") {
                const sessionInfo = await getSessionId();
                if (!sessionInfo) return;

                const { sessionId, orderId } = sessionInfo;
                const cashfree = await load({ mode: "production" }); // or "sandbox"

                let checkoutOptions = {
                    paymentSessionId: sessionId,
                    redirectTarget: "_modal",
                }; // _self

                await cashfree.checkout(checkoutOptions)
                    .then(async (res) => {
                        await verifyPayment(orderId); // now using correct orderId
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }

            //End CashFree PG

            if (billingDetails.paymentMethod === "COD") {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/place-order-cod`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        storeId,
                        custId: customerData._id,
                        ...billingDetails,
                        cart: [...cart],
                        isCouponApplied,
                        coupon,
                        discountValue,
                        totalPrice: (calculateTotal() - discountValue),
                    })
                })

                const responseData = await response.json()

                if (response.ok) {
                    removeAllProductsFromCart()
                    toast.success(responseData.message)
                    setBillingDetails({
                        email: "",
                        name: "",
                        phoneNo: "",
                        address1: "",
                        address2: "",
                        state: "",
                        country: "India",
                        pinCode: "",
                        paymentMethod: ""
                    })
                    navigate("/order-success")
                } else {
                    toast.error(responseData.message)
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingBtn(false)
        }
    }


    const calculateSubtotal = () => {
        return cart.reduce((subtotal, item) => subtotal + item.salePrice * item.quantity, 0);
    };

    return (
        <>
            <Helmet>
                <title>Checkout</title>
            </Helmet>
            <h2 className='text-center text-3xl lg:text-4xl mt-3 font-extrabold'>Checkout</h2>
            <div className="grid sm:px-10 lg:grid-cols-2 lg:px-24">
                <div data-theme="light" className="px-4 pt-3">
                    <p className="text-xl font-medium">Shipping Details</p>
                    <p className="text-zinc-400">Complete your order by providing your billing and shipping details.</p>
                    <div className="">
                        <label htmlFor="email" className="mt-4 mb-2 block text-base font-medium">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={billingDetails.email}
                                className="w-full rounded-md border border-zinc-200 px-4 py-3 text-base shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="your.email@gmail.com"
                                disabled
                            />
                        </div>
                        <label htmlFor="card-holder" className="mt-4 mb-2 block text-base font-medium">Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                onChange={handleInput}
                                value={billingDetails.name}
                                className="w-full rounded-md border border-zinc-200 px-4 py-3 text-base shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <label htmlFor="phoneNo" className="mt-4 mb-2 block text-base font-medium">Phone no.</label>
                        <div className="relative">
                            <input
                                type="number"
                                id="phoneNo"
                                name="phoneNo"
                                onChange={handleInput}
                                value={billingDetails.phoneNo}
                                className="w-full rounded-md border border-zinc-200 px-4 py-3 text-base shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter your phone no."
                                required
                            />
                        </div>

                        <div className="gap-2 flex flex-col lg:flex-row">
                            <div className='w-full'>
                                <label htmlFor="address1" className="mt-4 mb-2 block text-base font-medium">Address 1</label>
                                <input
                                    type="text"
                                    name='address1'
                                    id='address1'
                                    onChange={handleInput}
                                    value={billingDetails.address1}
                                    placeholder='House/Room/Floor No.'
                                    required
                                    className="w-full rounded-md border border-zinc-200 px-4 py-3 text-base shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className='w-full'>
                                <label htmlFor="address2" className="mt-4 mb-2 block text-base font-medium">Address 2</label>
                                <input type="text"
                                    name='address2'
                                    id='address2'
                                    onChange={handleInput}
                                    value={billingDetails.address2}
                                    placeholder='Street/Colony/Landmark'
                                    required
                                    className="w-full rounded-md border border-zinc-200 px-4 py-3 text-base shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="gap-2 flex flex-col lg:flex-row">
                            <div className='w-full'>
                                <label htmlFor="state" className="mt-4 mb-2 block text-base font-medium">State</label>
                                <select
                                    name="state"
                                    id="state"
                                    onChange={handleInput}
                                    value={billingDetails.state}
                                    className="w-full rounded-md border border-zinc-200 px-4 py-3 text-base shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="" disabled>Select State</option>
                                    {statesOfIndia.map((state, index) => (
                                        <option key={index} value={state}>{state}</option>
                                    ))
                                    }
                                </select>
                            </div>
                            <div className='w-full'>
                                <label htmlFor="country" className="mt-4 mb-2 block text-base font-medium">Country</label>
                                <select
                                    name="country"
                                    id="country"
                                    onChange={handleInput}
                                    value={billingDetails.country}
                                    className="w-full rounded-md border border-zinc-200 px-4 py-3 text-base shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="India"> India</option>
                                </select>

                            </div>
                        </div>
                        <div>
                            <label htmlFor="pinCode" className="mt-4 mb-2 block text-base font-medium">Pin code</label>
                            <input
                                type="number"
                                name='pinCode'
                                id='pinCode'
                                onChange={handleInput}
                                value={billingDetails.pinCode}
                                placeholder='Pin Code'
                                required
                                className="w-full rounded-md border border-zinc-200 px-4 py-3 text-base shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <p className="mt-8 text-lg font-medium">Payment Methods</p>
                        <form className="mt-5 grid gap-6 mb-10">
                            {store?.cod ?
                                <div className="relative">
                                    <input
                                        className="peer hidden"
                                        id="radio_1"
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        onChange={handleInput}
                                    />
                                    <span className="peer-checked:border-zinc-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-zinc-300 bg-white"></span>
                                    <label className="peer-checked:border-2 peer-checked:border-zinc-700 peer-checked:bg-zinc-50 flex cursor-pointer select-none rounded-lg border border-zinc-300 p-4" htmlFor="radio_1">
                                        <img className="w-14 object-contain" src="./cash-on-delivery.png" alt="" />
                                        <div className="ml-5">
                                            <span className="mt-2 font-semibold">Cash on delivery</span>
                                            <p className="text-slate-500 text-base leading-6">Pay on delivery by cash</p>
                                        </div>
                                    </label>
                                </div>
                                : <></>
                            }
                            {store?.cashfree ?
                                <div className="relative">
                                    <input
                                        className="peer hidden"
                                        id="radio_2"
                                        type="radio"
                                        name="paymentMethod"
                                        value="cashfree"
                                        onChange={handleInput}
                                    />
                                    <span className="peer-checked:border-zinc-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-zinc-300 bg-white"></span>
                                    <label className="peer-checked:border-2 peer-checked:border-zinc-700 peer-checked:bg-zinc-50 flex cursor-pointer select-none rounded-lg border border-zinc-300 p-4" htmlFor="radio_2">
                                        <img className="w-14 object-contain" src="./cashfree.png" alt="" />
                                        <div className="ml-5">
                                            <span className="mt-2 font-semibold">Online Payment</span>
                                            <p className="text-slate-500 text-base leading-6">UPI/Debit Card/Credit Card/Net Banking</p>
                                        </div>
                                    </label>
                                </div>
                                :
                                <></>
                            }

                            {/* <div className='flex justify-center items-center text-xl text-center bg-zinc-200 p-6 rounded-lg font-semibold text-black'>
                                No Payment Method Available
                            </div> */}
                        </form>
                    </div>
                </div>
                <div className="px-4 lg:pt-4">
                    <p className="text-xl font-medium">Apply coupon</p>
                    <p className="text-zinc-400">Apply your coupon to get offers</p>
                    <div className="mt-2 space-y-3 mb-8 rounded-lg border bg-white px-2 py-4 sm:px-6">
                        <div data-theme="light" className='w-full'>
                            <input
                                type="text"
                                name='coupon'
                                id='coupon'
                                onChange={handleCouponInput}
                                value={coupon}
                                placeholder='Coupon code'
                                required
                                className="w-full rounded-md border border-zinc-200 px-4 py-3 text-base shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <button
                                onClick={checkCoupon}
                                className="mt-4 w-full rounded-md bg-zinc-900 px-6 py-3 font-medium text-white">Apply</button>
                        </div>
                    </div>

                    <p className="text-xl font-medium">Order Summary</p>
                    <p className="text-zinc-400">Check your items. And select a suitable shipping method.</p>
                    <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
                        {cart.map((product, index) => (
                            <div key={index} className="flex flex-col rounded-lg bg-white sm:flex-row">
                                <img className="m-2 h-24 w-28 rounded-md border object-cover object-center" src={product?.images?.featuredImage} alt="" />
                                <div className="flex w-full flex-col px-4 py-4">
                                    <span className="font-semibold">{product.name}</span>
                                    <span className="float-right text-zinc-600 text-sm font-semibold">{"Qty: " + product?.quantity}</span>
                                    {product?.selectColor ? <span className="float-right text-zinc-600">{"Color: " + product?.selectColor}</span> : <></>}
                                    {product?.selectSize ? <span className="float-right text-zinc-600">{"Size: " + product?.selectSize}</span> : <></>}
                                    {product?.selectOther ? <span className="float-right text-zinc-600">{"Other: " + product?.selectOther}</span> : <></>}
                                    <p className="text-lg font-bold">&#8377;{product?.salePrice}</p>
                                </div>
                            </div>
                        ))}

                        <div className="mt-6 border-t border-b py-2">
                            <div className="flex items-center justify-between">
                                <p className="text-base font-medium text-zinc-900">Subtotal</p>
                                <p className="font-semibold text-zinc-900">&#8377;{calculateSubtotal().toFixed(2)}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-base font-medium text-zinc-900">Shipping</p>
                                <p className="font-semibold text-zinc-900">&#8377;0.00</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-base font-medium text-zinc-900">Coupon</p>
                                <p className="font-semibold text-zinc-900">&#8377;{discountValue}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-base font-medium text-zinc-900">Total</p>
                            <p className="text-2xl font-semibold text-zinc-900">&#8377;{(calculateTotal() - discountValue).toFixed(2)}</p>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="mt-4 mb-8 w-full flex items-center justify-center rounded-md px-6 py-3 font-medium bg-black text-white">{loadingBtn ? <span className="loading loading-spinner loading-sm"></span> : "Place Order"}</button>
                    </div>



                </div>
            </div>

        </>
    )
}

export default Checkout