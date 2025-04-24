import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { ProductCard } from '../components';

function Category() {
    const { id } = useParams();
    const [category, setCategory] = useState({})
    const [products, setProducts] = useState([])
    const [color1, setColor1] = useState("")
    const [color2, setColor2] = useState("")
    const [loading, setLoading] = useState(false)

    const subdomain = window.location.hostname;

    const getCategoryProducts = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/category/data/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const responseData = await response.json()
                setCategory(responseData.data)
                setProducts(responseData.data.products)
            }

            const storeResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/store/subdomain/${subdomain}`)
            const storeResponseData = await storeResponse.json()
            if (storeResponse.ok) {
                setColor1(storeResponseData.data.themeColorOne)
                setColor2(storeResponseData.data.themeColorTwo)
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        getCategoryProducts()
    }, [])

    if (loading) {
        return <div className='flex h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <div className="mx-auto px-4 py-5 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-4 mb-10">
            <h2 className="text-xl lg:text-3xl font-bold tracking-tight text-gray-900">{category?.name}</h2>
            {products ?
                <ProductCard products={products} color1={color1} color2={color2} />
                :
                <div className='h-full w-full flex justify-center items-center'>
                    <p className='font-bold text-xl lg:text-2xl'>No products</p>
                </div>
            }
        </div>
    )
}

export default Category