import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import toast from 'react-hot-toast';
import { useCustomerAuth } from '../store/customerAuth'

function CustomerSignUp() {
    const { store, color1, color2 } = useOutletContext();
    const { customerTokenInLS } = useCustomerAuth()
    const [loadingBtn, setLoadingBtn] = useState(false)

    const subdomain = window.location.hostname;
    const [user, setUser] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate()

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoadingBtn(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customer/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...user,
                    storeid: store._id
                })
            })

            setUser({
                email: "",
                password: ""
            })

            const responseData = await response.json()

            if (response.ok) {
                toast.success(responseData.message)
                navigate("/login")
            } else {
                toast.error(responseData.message)
            }

        } catch (error) {
            console.log(error)
        }
        setLoadingBtn(true)
    }

    return (
        <>
            <div className='flex flex-wrap justify-center items-center h-auto py-10'>
                <div className="w-96 mx-auto bg-white p-8 rounded-2xl shadow-none lg:shadow-md">
                    <h1 className="text-3xl font-bold mb-6 flex flex-wrap justify-center" style={{ color: color1 }}>Sign Up</h1>
                    <h3 className="" style={{ color: color1 }}>Already registered? <Link className='font-bold' to="/login">Login</Link></h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-input mt-5 mb-6">
                            <label htmlFor="email" style={{ color: color1 }}>Email</label><br />
                            <input onChange={handleInput} value={user?.email} className='w-full bg-gray-50 rounded-md px-3 py-3' type="email" name='email' id="email" placeholder=" " />
                        </div>
                        <div className="form-input mb-6">
                            <label htmlFor="password" style={{ color: color1 }}>Password</label><br />
                            <input onChange={handleInput} value={user?.password} className='w-full bg-gray-50 rounded-md px-3 py-3' type="password" name="password" id="password" placeholder=" " />
                        </div>
                        <button type="submit"
                            className="w-full text-xl font-bold py-4 px-4 rounded-md hover:brightness-110 transition duration-200" style={{ color: color2, backgroundColor: color1 }}>{!loadingBtn ? "Register" : <span className="loading loading-spinner loading-md"></span>}</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CustomerSignUp