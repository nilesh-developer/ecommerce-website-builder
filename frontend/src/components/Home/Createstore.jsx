import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { useAuth } from '../../store/auth'

function Createstore() {

    const [name, setName] = useState("")
    const [storename, setStorename] = useState("")
    const [storeAvailable, setStoreAvailable] = useState(false)
    const navigate = useNavigate()
    const { userId } = useAuth()

    const domain = window.location.hostname

    const handleStore = async (e) => {
        setName(e.target.value)
    }

    const handleInput = async (e) => {
        setStorename(e.target.value)
    }

    const check = async () => {
        if (storename !== "") {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/check-storename`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ storename: storename })
                })

                const responseData = await response.json()
                setStoreAvailable(responseData.data)

            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        check();
    }, [storename])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/create-store`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ storename, owner: userId, name, subdomain: `${storename}.${domain}` })
            })

            const responseData = await response.json()

            if (response.ok) {
                toast.success(responseData.message)
                navigate(`/business-details/${storename}`)
            } else {
                toast.error(responseData.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className='flex flex-wrap justify-center items-center h-auto py-10 lg:py-3'>
                <div className="lg:w-[700px] w-96 mx-5 lg:mx-auto bg-white py-8 rounded-2xl shadow-none">
                    <div className="grid place-items-center lg:mt-2 sm:mt-10">
                        <img className="sm:w-96 lg:w-[700] h-auto" src="/explore.png" alt="image2" />
                    </div>
                    <h1 className="text-xl lg:text-4xl mt-8 text-black font-bold flex flex-wrap justify-center">Let's start creating your Store</h1>
                    <p className='text-gray-400 mb-6 text-center mt-2 lg:text-base text-sm'>Add name and link to your eazzy store</p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-input mt-5 mb-6">
                            <label className='font-bold' htmlFor="storename">Enter your store name</label><br />
                            <input onChange={handleStore} value={name} className='w-full bg-gray-50 text-xl rounded-md px-4 py-4' type="text" name='name' id="name" placeholder=" " />
                        </div>
                        <div className="form-input mt-5 mb-6">
                            <label className='font-bold' htmlFor="storename">Set your Store link</label><br />
                            <input onChange={handleInput} value={storename} className='w-full bg-gray-50 text-xl rounded-md px-4 py-4' type="text" name='storename' id="storename" placeholder=" " />
                            {storeAvailable ?
                                <p className='text-green-600 font-semibold'>Store name is available</p>
                                :
                                <p>
                                {storename !== "" ?
                                <p className='text-red-600 font-semibold'>Store name is already taken</p>
                                : null
                                }
                                </p>
                            }
                            <p className='text-gray-500'>Store link looks like <span className='text-gray-700 font-semibold'>{storename ? storename : "storename"}.{import.meta.env.VITE_HOSTNAME}</span></p>
                        </div>
                        <button type="submit"
                            className="bg-black w-full text-xl font-bold text-white py-4 px-4 rounded-md hover:bg-zinc-900 transition duration-200">Create</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Createstore