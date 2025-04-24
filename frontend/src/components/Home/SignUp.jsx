import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { useAuth } from '../../store/auth'
import { useEffect } from 'react';

function SignUp() {
    const [user, setUser] = useState({
        email: "",
        password: ""
    })
    const [otpsend, setOtpsend] = useState(false)
    const [otp, setOtp] = useState('')
    const [loadingBtn, setLoadingBtn] = useState(false)
    const navigate = useNavigate()

    const { storeTokenInLS, setUserId } = useAuth()

    useEffect(() => {
        window.scrollTo(0, 0);
    },[])

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setUser({
            ...user,
            [name]: value,
        })
    }

    const sendOTP = async (e) => {
        e.preventDefault();
        try {
            setLoadingBtn(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/sendotp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: user.email })
            })
            const responseData = await response.json()

            if (response.ok) {
                localStorage.setItem('code', responseData.otp)
                setOtpsend(true)
                toast.success(responseData.message)
            } else {
                toast.error(responseData.message)
            }
            setLoadingBtn(false)

        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }

    const verifyOtp = async (e) => {
        e.preventDefault()
        try {
            setLoadingBtn(true)
            const otpToken = localStorage.getItem('code');
            const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/user/verifyotp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ otpToken })
            })

            const verifyResponseData = await verifyResponse.json()

            if (verifyResponse.ok) {
                if (verifyResponseData.otp.otp === Number(otp)) {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/register`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(user)
                    })

                    setUser({
                        email: "",
                        password: ""
                    })

                    const responseData = await response.json()

                    if (response.ok) {
                        setUserId(responseData.data.user._id)
                        storeTokenInLS(responseData.data.token)
                        localStorage.removeItem("code")
                        toast.success(responseData.message)
                        navigate("/pricing")
                        // navigate("/create-store")
                    } else {
                        toast.error(responseData.message)
                    }
                } else {
                    toast.error("Incorrect OTP")
                }
            } else {
                toast.error(verifyResponseData.message)
            }

            setLoadingBtn(false)
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     try {
    //         const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/register`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify(user)
    //         })

    //         setUser({
    //             email: "",
    //             password: ""
    //         })

    //         const responseData = await response.json()

    //         if (response.ok) {
    //             setUserId(responseData.data.user._id)
    //             storeTokenInLS(responseData.data.token)
    //             toast.success(responseData.message)
    //             navigate("/create-store")
    //         } else {
    //             toast.error(responseData.message)
    //         }

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    return (
        <>
            <div className='flex flex-wrap justify-center items-center h-auto py-10'>
                <div className="w-96 mx-auto bg-white p-8 rounded-2xl shadow-none lg:shadow-md">
                    <h1 className="text-3xl text-black font-bold mb-6 flex flex-wrap justify-center">Sign Up</h1>
                    <h3 className="text-gray-700">Already registered? <Link className='font-bold text-orange-600' to="/login">Login</Link></h3>
                    <form>
                        <div className="form-input mt-5 mb-6">
                            <label htmlFor="email">Email</label><br />
                            <input onChange={handleInput} value={user.email} className='w-full bg-gray-50 rounded-md px-3 py-3' type="email" name='email' id="email" placeholder=" " />
                        </div>
                        <div className="form-input mb-6">
                            <label htmlFor="password">Password</label><br />
                            <input onChange={handleInput} value={user.password} className='w-full bg-gray-50 rounded-md px-3 py-3' type="password" name="password" id="password" placeholder=" " />
                        </div>
                        {otpsend ?
                            <div className="form-input mb-6">
                                <label htmlFor="otp">Enter the OTP sent on your email</label><br />
                                <input onChange={(e) => setOtp(e.target.value)} value={otp} className='w-full bg-gray-50 rounded-md px-3 py-3' type="text" name="otp" id="otp" placeholder=" " />
                            </div>
                            :
                            null
                        }
                        {otpsend ?
                            <button onClick={verifyOtp}
                                className="bg-orange-600 w-full text-xl font-bold text-white py-4 px-4 rounded-md hover:bg-orange-700 transition duration-200">{!loadingBtn ? "Verify" : <span className="loading loading-spinner loading-md"></span>}</button>
                            :
                            <button onClick={sendOTP}
                                className="bg-orange-600 w-full text-xl font-bold text-white py-4 px-4 rounded-md hover:bg-orange-700 transition duration-200">{!loadingBtn ? "Send OTP" : <span className="loading loading-spinner loading-md"></span>}</button>
                        }
                    </form>
                </div>
            </div>
        </>
    )
}

export default SignUp