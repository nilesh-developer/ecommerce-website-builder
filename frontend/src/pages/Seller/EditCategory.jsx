import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../store/auth';

const EditCategory = () => {
    const {user} = useAuth()
    const { id } = useParams()
    const [categoryData, setCategoryData] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [categoryName, setCategoryName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate()

    async function getCategoryData() {
        try {
            setIsLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/category/data/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                const responseData = await response.json()
                setCategoryData(responseData.data)
                setCategoryName(responseData.data.name)
                setDescription(responseData.data.description)
            }

            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getCategoryData()
    }, [])

    if (isLoading) {
        return <div className='flex h-[calc(100vh-100px)] lg:h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic
        const formdata = new FormData()
        formdata.append('image', image)
        formdata.append('categoryName', categoryName)
        formdata.append('description', description)
        axios.patch(`${import.meta.env.VITE_API_URL}/api/category/edit/${id}`, formdata)
            .then(res => {
                toast.success(res.data.message)
            })
            .catch(err => console.log(err))
        navigate("../categories")
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <div className="md:flex items-center justify-center h-dvh lg:min-h-screen bg-white md:bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg md:shadow-lg">
                <h2 className="text-2xl font-bold md:text-center text-gray-700">Edit Category</h2>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Category Name</label>
                        <input
                            type="text"
                            id="categoryName"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                    </div>
                    {categoryData?.image ?
                        <>
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload new image</label>
                                <input
                                    type="file"
                                    id="image"
                                    onChange={handleImageChange}
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Current Image</label>
                                <img className='h-20 w-20 border mt-1 border-black p-3 rounded-md' src={categoryData?.image} alt={categoryData.name} />
                            </div>
                        </>
                        :
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload Image</label>
                            <input
                                type="file"
                                id="image"
                                onChange={handleImageChange}
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                            />
                        </div>
                    }
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        Update Category
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditCategory;
