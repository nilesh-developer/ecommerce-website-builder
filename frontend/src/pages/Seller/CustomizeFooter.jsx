import React, { useEffect, useState } from 'react'
import { useAuth } from '../../store/auth';
import toast from 'react-hot-toast';

function CustomizeFooter() {

    const [storeId, setStoreId] = useState("")
    const [store, setStore] = useState({})
    const [loading, setLoading] = useState(true);
    const { token } = useAuth()
    const [updateData, setUpdateData] = useState({
        bio: "",
        email: "",
        instagram: "",
        facebook: "",
        twitter: "",
        youtube: "",
    })

    const getStoreData = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/current-user`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const responseData = await response.json()
                setStoreId(responseData.data.store._id)
                setStore(responseData.data.store)
                setUpdateData({
                    bio: responseData.data.store.bio,
                    email: responseData.data.store.email,
                    instagram: responseData.data.store.instagram,
                    facebook: responseData.data.store.facebook,
                    twitter: responseData.data.store.twitter,
                    youtube: responseData.data.store.youtube
                })
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    useEffect(() => {
        getStoreData()
    }, [])

    if (loading) {
        return <div className='flex h-[calc(100vh-100px)] lg:h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    const handleInput = (e) => {
        let { name, value } = e.target

        setUpdateData({
            ...updateData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/update/social/${storeId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...updateData
                }),
            });

            if (response.ok) {
                toast.success("Store updated successfully");
            } else {
                console.log(response)
                toast.error("Failed to update store");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }
    }

    return (
        <div className='flex-grow h-screen'>
            <div className='lg:my-7 lg:mx-10 my-3 mx-3'>
                <h2 className='text-xl lg:text-3xl text-zinc-900 font-bold tracking-tighter'>About Store & Social Links</h2>
                <div className='mt-8 pb-6'>
                    <form onSubmit={handleSubmit} className='grid grid-flow-row'>
                        <label className='font-semibold tracking-tight text-zinc-700 text-lg' htmlFor="bio">Write something about your store</label>
                        <textarea
                            className="textarea textarea-bordered resize-none bg-white mt-1 h-[200px] w-[250px] lg:w-[380px]"
                            name='bio'
                            id='bio'
                            onChange={handleInput}
                            value={updateData.bio}
                            placeholder="Store Bio">
                            {updateData.bio}
                        </textarea>
                        <label className='font-semibold tracking-tight text-zinc-700 text-lg mt-7' htmlFor="email">Email</label>
                        <input
                            type="email"
                            name='email'
                            id="email"
                            onChange={handleInput}
                            value={updateData.email}
                            placeholder="Store Email"
                            className="input input-bordered text-black bg-white w-[250px] lg:w-full max-w-xs"
                        />

                        <h2 className='mt-8 text-2xl font-bold text-zinc-900'>Social Links</h2>
                        <label className="input input-bordered flex items-center bg-white gap-2 w-[250px] lg:w-[324px] mt-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className='h-5 text-gray-500' viewBox="0 0 512 512"><path d="M170.663 256.157c-.083-47.121 38.055-85.4 85.167-85.482 47.121-.092 85.407 38.029 85.499 85.159.091 47.13-38.047 85.4-85.176 85.492-47.112.09-85.399-38.039-85.49-85.169zm-46.108.092c.141 72.602 59.106 131.327 131.69 131.185 72.592-.14 131.35-59.089 131.209-131.691-.141-72.577-59.114-131.336-131.715-131.194-72.585.141-131.325 59.114-131.184 131.7zm237.104-137.092c.033 16.954 13.817 30.682 30.772 30.649 16.961-.034 30.689-13.811 30.664-30.765-.033-16.954-13.818-30.69-30.78-30.656-16.962.033-30.689 13.818-30.656 30.772zm-208.696 345.4c-24.958-1.086-38.511-5.234-47.543-8.709-11.961-4.628-20.496-10.177-29.479-19.093-8.966-8.951-14.532-17.461-19.202-29.397-3.508-9.033-7.73-22.569-8.9-47.527-1.269-26.983-1.559-35.078-1.683-103.433-.133-68.338.116-76.434 1.294-103.441 1.069-24.941 5.242-38.512 8.709-47.536 4.628-11.977 10.161-20.496 19.094-29.478 8.949-8.983 17.459-14.532 29.403-19.202 9.025-3.526 22.561-7.715 47.511-8.9 26.998-1.278 35.085-1.551 103.423-1.684 68.353-.133 76.448.108 103.456 1.294 24.94 1.086 38.51 5.217 47.527 8.709 11.968 4.628 20.503 10.145 29.478 19.094 8.974 8.95 14.54 17.443 19.21 29.413 3.524 8.999 7.714 22.552 8.892 47.494 1.285 26.998 1.576 35.094 1.7 103.432.132 68.355-.117 76.451-1.302 103.442-1.087 24.957-5.226 38.52-8.709 47.56-4.629 11.953-10.161 20.488-19.103 29.471-8.941 8.949-17.451 14.531-29.403 19.201-9.009 3.517-22.561 7.714-47.494 8.9-26.998 1.269-35.086 1.56-103.448 1.684-68.338.133-76.424-.124-103.431-1.294zM149.977 1.773c-27.239 1.286-45.843 5.648-62.101 12.019-16.829 6.561-31.095 15.353-45.286 29.603C28.381 57.653 19.655 71.944 13.144 88.79c-6.303 16.299-10.575 34.912-11.778 62.168C.172 178.264-.102 186.973.031 256.489c.133 69.508.439 78.234 1.741 105.548 1.302 27.231 5.649 45.827 12.019 62.092 6.569 16.83 15.353 31.089 29.611 45.289 14.25 14.2 28.55 22.918 45.404 29.438 16.282 6.294 34.902 10.583 62.15 11.777 27.305 1.203 36.022 1.468 105.521 1.336 69.532-.133 78.25-.44 105.555-1.734 27.239-1.302 45.826-5.664 62.1-12.019 16.829-6.585 31.095-15.353 45.288-29.611 14.191-14.251 22.917-28.55 29.428-45.404 6.304-16.282 10.592-34.904 11.777-62.134 1.195-27.323 1.478-36.049 1.344-105.557-.133-69.516-.447-78.225-1.741-105.522-1.294-27.256-5.657-45.844-12.019-62.118-6.577-16.829-15.352-31.08-29.602-45.288-14.25-14.192-28.55-22.935-45.404-29.429-16.29-6.304-34.903-10.6-62.15-11.778C333.747.164 325.03-.101 255.506.031c-69.507.133-78.224.431-105.529 1.742z" /></svg>
                            <input
                                type="text"
                                className="grow"
                                name="instagram"
                                onChange={handleInput}
                                value={updateData.instagram}
                                placeholder="Instagram Link"
                            />
                        </label>
                        <label className="input input-bordered flex items-center bg-white gap-2 w-[250px] lg:w-[324px] mt-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className='h-5 text-gray-500' viewBox="0 0 509 507.14"><path d="M509 254.5C509 113.94 395.06 0 254.5 0S0 113.94 0 254.5C0 373.86 82.17 474 193.02 501.51V332.27h-52.48V254.5h52.48v-33.51c0-86.63 39.2-126.78 124.24-126.78 16.13 0 43.95 3.17 55.33 6.33v70.5c-6.01-.63-16.44-.95-29.4-.95-41.73 0-57.86 15.81-57.86 56.91v27.5h83.13l-14.28 77.77h-68.85v174.87C411.35 491.92 509 384.62 509 254.5z" /></svg>
                            <input
                                type="text"
                                className="grow"
                                name='facebook'
                                onChange={handleInput}
                                value={updateData.facebook}
                                placeholder="Facebook Link"
                            />
                        </label>
                        <label className="input input-bordered flex items-center bg-white gap-2 w-[250px] lg:w-[324px] mt-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className='h-4 text-gray-500' viewBox="0 0 512 462.799"><path d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z" /></svg>
                            <input
                                type="text"
                                className="grow"
                                name='twitter'
                                onChange={handleInput}
                                value={updateData.twitter}
                                placeholder="Twitter Link"
                            />
                        </label>
                        <label className="input input-bordered flex items-center bg-white gap-2 w-[250px] lg:w-[324px] mt-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className='h-5 text-gray-500' viewBox="0 0 640 640"><path d="M633.468 192.038s-6.248-44.115-25.477-63.485c-24.366-25.477-51.65-25.642-64.123-27.118-89.493-6.52-223.904-6.52-223.904-6.52h-.236s-134.352 0-223.893 6.52c-12.52 1.523-39.768 1.63-64.123 27.118-19.24 19.37-25.358 63.485-25.358 63.485S-.012 243.806-.012 295.681v48.509c0 51.768 6.366 103.643 6.366 103.643s6.248 44.114 25.358 63.52c24.355 25.477 56.363 24.65 70.655 27.367 51.237 4.89 217.644 6.366 217.644 6.366s134.529-.237 224.022-6.638c12.52-1.477 39.756-1.63 64.123-27.119 19.24-19.37 25.476-63.532 25.476-63.532S640 396.03 640 344.154v-48.508c-.13-51.769-6.497-103.643-6.497-103.643l-.035.035zm-379.8 211.007V223.173L426.56 313.41l-172.892 89.635z" /></svg>
                            <input
                                type="text"
                                className="grow"
                                name='youtube'
                                onChange={handleInput}
                                value={updateData.youtube}
                                placeholder="Youtube Link"
                            />
                        </label>

                        <button className="bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 text-lg mt-6 w-28 mb-12">Save</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CustomizeFooter