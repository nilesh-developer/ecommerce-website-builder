import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useAdminAuth } from '../../store/adminAuth';

function AdminChangePassword() {
    const [loading, setLoading] = useState(false)
    const [changePassword, setChangePassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    })
    const {adminToken} = useAdminAuth()

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const handleInput = (e) => {
        const { name, value } = e.target;

        setChangePassword({
            ...changePassword,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/change-password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify(changePassword)
            })

            const data = await response.json()
            setChangePassword({
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            })
            if (response.ok) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full h-screen'>
            <div className='lg:my-7 lg:mx-10 my-3 mx-3 pb-10'>
                <h2 className='text-2xl lg:text-4xl text-zinc-900 font-bold tracking-tight'>Change Password</h2>
                <div className='mt-5'>
                    <div className='mt-3'>
                        <form onSubmit={handleSubmit} className='grid grid-flow-row mt-6'>
                            <label className='font-semibold tracking-tight text-zinc-700 text-lg' htmlFor="oldPassword">Enter Old Password</label>
                            <input
                                type="text"
                                name='oldPassword'
                                id="oldPassword"
                                onChange={handleInput}
                                value={changePassword.oldPassword}
                                placeholder="Old Password"
                                className="border outline-none rounded-lg px-3 py-3 text-black bg-transparent w-full max-w-xs"
                            />
                            <label className='font-semibold tracking-tight text-zinc-700 text-lg mt-5' htmlFor="newPassword">Enter New Password</label>
                            <input
                                type="text"
                                name='newPassword'
                                id="newPassword"
                                onChange={handleInput}
                                value={changePassword.newPassword}
                                placeholder="New Password"
                                className="border outline-none rounded-lg px-3 py-3 text-black bg-transparent w-full max-w-xs"
                            />
                            <label className='font-semibold tracking-tight text-zinc-700 text-lg mt-5' htmlFor="newPassword">Confirm New Password</label>
                            <input
                                type="text"
                                name='confirmNewPassword'
                                id="confirmNewPassword"
                                onChange={handleInput}
                                value={changePassword.confirmNewPassword}
                                placeholder="Confirm New Password"
                                className="border outline-none rounded-lg px-3 py-3 text-black bg-transparent w-full max-w-xs"
                            />
                            <button className="bg-orange-600 text-white py-2 rounded-lg tracking-tight hover:bg-orange-700 mt-6 mb-10 w-44">{!loading ? "Update Password" : <span className="loading loading-spinner loading-md"></span>}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminChangePassword