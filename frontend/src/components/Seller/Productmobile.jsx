import React from 'react'
import { Link } from 'react-router-dom'

function Productmobile({products, openModal}) {
    return (
        <div>
            {products.map((product, index) => 
            (<div key={index} className='bg-zinc-100 p-7 rounded-lg flex mb-2'>
                <div className='h-full w-auto border-2 border-zinc-200 p-2 rounded-lg'>
                    <img className='h-20 w-full' src={product.images.featuredImage} alt="" />
                </div>
                <div className='ml-5'>
                    <h3 className='text-sm font-semibold tracking-tight'>{product.name}</h3>
                    <p className='text-sm'>Price: <span className='font-semibold px-2 py-1 rounded-lg text-gray-700'>&#8377; {product.salePrice || product.originalPrice}</span></p>
                    <p className='text-sm'>Status: 
                    {product.status ?
                        <span className='text-green-600 font-semibold px-2 py-1 rounded-lg'>Visible</span>
                        :
                        <span className='text-red-600 font-semibold px-2 py-1 rounded-lg'>Invisible</span>
                    }
                    </p>
                    <div className='flex flex-wrap gap-3 mt-2'>
                        <Link to={"../edit-product/"+product._id}>
                            <p className='bg-zinc-800 text-white px-4 py-1 rounded-md w-fit'>Edit</p>
                        </Link>
                        <button onClick={() => openModal(product._id)}>
                            <p className='bg-red-600 text-white px-4 py-1 rounded-md w-fit'>Delete</p>
                        </button>
                    </div>
                </div>
            </div>
            ))}
        </div>
    )
}

export default Productmobile