import React, { useState } from 'react';
import useStoreData from '../../Hooks/useStoreData';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
    const {user} = useStoreData()
    const [categoryName, setCategoryName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate()

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic
        const formdata = new FormData()
        formdata.append('image', image)
        formdata.append('categoryName', categoryName)
        formdata.append('description', description)
        formdata.append('storeId', user.store._id)
        axios.post(`${import.meta.env.VITE_API_URL}/api/category/create`, formdata)
            .then(res => {
                toast.success(res.data.message)
                navigate("../categories")
            })
            .catch(err => {
                console.log(err)
                toast.error(err.response.data.message)
            })
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <div className="md:flex items-center justify-center h-dvh lg:min-h-screen bg-white md:bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg md:shadow-lg">
                <h2 className="text-2xl font-bold md:text-center text-gray-700">Create Category</h2>
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
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload Image</label>
                        <input
                            type="file"
                            id="image"
                            onChange={handleImageChange}
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        Create Category
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;
