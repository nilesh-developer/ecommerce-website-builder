import { useEffect, useState } from "react";
import { CreditCard, ShoppingBag, Check, ChevronRight, MapPin, Shield } from "lucide-react";
import { useCart } from "../store/CartContext";
import { useCustomerAuth } from "../store/customerAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function QuickCheckout() {
    const navigate = useNavigate()
    const { storeId, customerData } = useCustomerAuth()
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [store, setStore] = useState({});
    const [subtotal, setSubtotal] = useState(0.00);
    const [shipping, setShipping] = useState(0.00);
    const [tax, setTax] = useState(0.00);
    const [total, setTotal] = useState(0.00);
    const [cartItems, setCartItems] = useState([]);
    const [shippingDetails, setShippingDetails] = useState({
        name: "",
        phoneNo: "",
        address1: "",
        address2: "",
        state: "",
        country: "India",
        pinCode: "",
        paymentMethod: "COD"
    })

    const subdomain = window.location.hostname;
    const { addQuickCheckoutProduct, quickCheckoutProduct } = useCart();

    useEffect(() => {
        if(!localStorage.getItem("customerToken")){
            navigate("/login")
        }
    }, [])

    // Fetch store data
    useEffect(() => {
        async function getStoreData() {
            try {
                setIsLoading(true);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/store/subdomain/${subdomain}`);
                const data = await res.json();
                if (res.ok) {
                    setStore(data.data);
                }
            } catch (error) {
                console.error("Error fetching store data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        getStoreData();
    }, [subdomain]);

    // Set cart items when quickCheckoutProduct is available
    useEffect(() => {
        if (quickCheckoutProduct && quickCheckoutProduct._id) {
            setCartItems([{
                id: quickCheckoutProduct._id,
                name: quickCheckoutProduct.name,
                price: Number(quickCheckoutProduct.salePrice) || 0,
                quantity: Number(quickCheckoutProduct.quantity) || 1,
                image: quickCheckoutProduct?.images?.featuredImage || ""
            }]);
        }
    }, [quickCheckoutProduct]);

    // Calculate subtotal, tax, and total
    useEffect(() => {
        if (cartItems.length === 0) return;

        const newSubtotal = cartItems.reduce((sum, item) => {
            const itemTotal = Number(item.price) * Number(item.quantity);
            return sum + (isNaN(itemTotal) ? 0 : itemTotal);
        }, 0);

        const newShipping = 0.00;
        const newTax = newSubtotal * 0.00; // update if tax logic changes
        const newTotal = newSubtotal + newShipping + newTax;

        setSubtotal(newSubtotal);
        setShipping(newShipping);
        setTax(newTax);
        setTotal(newTotal);
    }, [cartItems]);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setShippingDetails({
            ...shippingDetails,
            [name]: value,
        })
    }

    const placeOrder = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/place-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    storeId,
                    custId: customerData._id,
                    ...shippingDetails,
                    email: customerData.email,
                    cart: [{...quickCheckoutProduct}],
                    isCouponApplied: false,
                    coupon: "",
                    discountValue: "",
                    totalPrice: total,
                })
            })

            const responseData = await response.json()

            if (response.ok) {
                toast.success(responseData.message)
                setShippingDetails({
                    name: "",
                    phoneNo: "",
                    address1: "",
                    address2: "",
                    state: "",
                    country: "India",
                    pinCode: "",
                    paymentMethod: "COD"
                })
                navigate("/order-success")
            } else {
                toast.error(responseData.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (isLoading) {
        return (
            <div className='flex h-screen w-full justify-center items-center'>
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center mb-8">
                    <div className="w-full max-w-5xl">
                        <div className="flex items-center justify-center mb-8">
                            <div className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full`}
                                    style={{ backgroundColor: step >= 1 ? store?.themeColorOne : store?.themeColorTwo, color: step >= 1 ? store?.themeColorTwo : store?.themeColorOne }}
                                >
                                    <ShoppingBag size={20} />
                                </div>
                                <div className={`h-1 w-16 mx-2`} style={{ backgroundColor: step >= 2 ? store?.themeColorOne : "#f2f2f2" }}></div>
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full`} style={{ backgroundColor: step >= 2 ? store?.themeColorOne : store?.themeColorTwo, color: step >= 2 ? store?.themeColorTwo : store?.themeColorOne }}>
                                    <MapPin size={20} />
                                </div>
                                <div className={`h-1 w-16 mx-2`} style={{ backgroundColor: step >= 3 ? store?.themeColorOne : "#f2f2f2" }}></div>
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full`} style={{ backgroundColor: step >= 3 ? store?.themeColorOne : store?.themeColorTwo, color: step >= 3 ? store?.themeColorTwo : store?.themeColorOne }}>
                                    <Check size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="flex-1">
                                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                                    <div className="divide-y divide-gray-200">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex py-4">
                                                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                                                </div>
                                                <div className="ml-4 flex flex-1 flex-col">
                                                    <div className="flex justify-between text-base font-medium text-gray-800">
                                                        <h3>{item.name}</h3>
                                                        <p className="ml-4">₹{item?.price?.toFixed(2)}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {step === 2 && (
                                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shipping Information</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                                <input type="text"  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                            </div> */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                                <input type="text" name="name" value={shippingDetails.name} onChange={handleInput} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Address 1</label>
                                                <input type="text" name="address1" value={shippingDetails.address1} onChange={handleInput} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Address 2</label>
                                                <input type="text" name="address2" value={shippingDetails.address2} onChange={handleInput} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                <input type="text" name="city" value={shippingDetails.city} onChange={handleInput} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                                                <input type="text" name="pinCode" onChange={handleInput} value={shippingDetails.pinCode} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                                <input type="text" name="state" value={shippingDetails.state} onChange={handleInput} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                                <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                                    <option>India</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                                <input type="text" name="phoneNo" value={shippingDetails.phoneNo} onChange={handleInput} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                        <div className="text-center">
                                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                                <Check size={32} className="text-green-600" />
                                            </div>
                                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Order Confirmed!</h2>
                                            <p className="text-gray-600 mb-6">Your order has been received and is being processed.</p>
                                            {/* <p className="text-gray-600 font-semibold">Order #: 12345678</p> */}
                                            <div className="mt-8">
                                                <button className="bg-orange-600 text-white py-2 px-6 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50">
                                                    Track Order
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="w-full lg:w-96">
                                <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Total</h2>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">₹{subtotal?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="font-medium">₹{shipping?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tax</span>
                                            <span className="font-medium">₹{tax?.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-3 mt-3">
                                            <div className="flex justify-between">
                                                <span className="font-semibold text-gray-800">Total</span>
                                                <span className="font-bold text-lg">₹{total?.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        {step < 2 ? (
                                            <button
                                                onClick={() => setStep(step + 1)}
                                                className="w-full py-3 rounded-md font-medium flex items-center justify-center"
                                                style={{backgroundColor: store?.themeColorOne, color: store?.themeColorTwo}}
                                            >
                                                {step === 1 && "Continue to Shipping"}
                                                <ChevronRight size={18} className="ml-1" />
                                            </button>
                                        ) : step === 2 ? (
                                            <button
                                            onClick={placeOrder}
                                                className="w-full py-3 rounded-md font-medium flex items-center justify-center"
                                                style={{backgroundColor: store?.themeColorOne, color: store?.themeColorTwo}}
                                            >
                                                Complete Order
                                            </button>
                                        ) : (
                                            <button
                                                className="w-full py-3 rounded-md font-medium flex items-center justify-center"
                                                style={{backgroundColor: store?.themeColorOne, color: store?.themeColorTwo}}
                                            >
                                                Return to Shop
                                            </button>
                                        )}

                                        {step > 1 && step < 3 && (
                                            <button
                                                onClick={() => setStep(step - 1)}
                                                className="w-full text-gray-600 py-2 mt-2 rounded-md font-medium hover:text-gray-800 focus:outline-none"
                                            >
                                                Go Back
                                            </button>
                                        )}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                        <div className="flex items-center text-sm text-gray-600 mb-2">
                                            <Shield size={16} className="mr-2" />
                                            <span>Secure Checkout</span>
                                        </div>
                                        {/* <div className="flex items-center text-sm text-gray-600">
                                            <Check size={16} className="mr-2" />
                                            <span>30-Day Money Back Guarantee</span>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}