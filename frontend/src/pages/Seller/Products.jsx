import React, { Fragment,useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Productmobile } from '../../components/Seller';
import { useAuth } from '../../store/auth';

function Products() {
  let [isOpen, setIsOpen] = useState(false)
  const { token } = useAuth()
  const [store, setStore] = useState({})
  const [storeProducts, setStoreProducts] = useState()
  const [deleteProductId, setDeleteProductId] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  async function getCategoryData() {
    try {
      setIsLoading(true)
      const store = await fetch(`${import.meta.env.VITE_API_URL}/api/user/current-user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const storeData = await store.json()
      setStore(storeData.data.store)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product/get-data/${storeData.data.store._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const responseData = await response.json()
        setStoreProducts(responseData.data)
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

  function closeModal() {
    setIsOpen(false)
    setDeleteProductId("")
  }

  function openModal(id) {
    setIsOpen(true)
    setDeleteProductId(id)
  }

  const deleteAccount = async (e) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product/delete/${deleteProductId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      const responseData = await response.json()
      if (response.ok) {
        toast.success(responseData.message)
        setIsOpen(false)
      } else {
        toast.error("Something went wrong");
        console.log(responseData);
      } 
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <section className='bg-white flex-grow h-dvh min-w-80 lg:h-dvh lg:pb-0 pb-20'>
        <div className='lg:my-10 my-5 lg:mx-4 mx-3'>
          <div className='flex justify-between lg:justify-start lg:gap-5'>
            <h2 className='text-xl lg:text-3xl text-zinc-900 font-extrabold lg:ml-4 tracking-tight'>All Products</h2>
            <Link to="../add-product"><h2 className='text-md font-semibold  bg-orange-600 text-white rounded-xl px-3 py-2 tracking-tighter'>Add Product</h2></Link>
          </div>

          {store.products.length === 0 ?
            <div className='w-full mt-20'>
              <div className='flex justify-center items-center'>
                <img className='h-40 w-40' src="/packaging.png" alt="" />
              </div>
              <h1 className='text-center text-2xl font-semibold tracking-tighter text-gray-700'>No product added yet!</h1>
            </div>
            :
            <>
              {/* Mobile View of Products */}
              <div className='mt-5 space-y-3 lg:hidden'>
                <Productmobile products={storeProducts} openModal={openModal} />
              </div>

              {/* Desktop View of Products */}
              <div className='px-5'>
                <div className="overflow-x-auto mt-7 hidden lg:block">
                  <table className="min-w-full text-xs">
                    <colgroup>
                      <col />
                      <col />
                      <col />
                      <col />
                      <col />
                      <col />
                      <col />
                      <col />
                    </colgroup>
                    <thead className="dark:bg-gray-300">
                      <tr className="text-left">
                        <th className="p-3 text-base tracking-tighter">Image</th>
                        <th className="p-3 text-base tracking-tighter w-56">Name</th>
                        <th className="p-3 text-base tracking-tighter">Price</th>
                        <th className="p-3 text-base tracking-tighter">Sale Price</th>
                        <th className="p-3 text-base tracking-tighter">Stock</th>
                        <th className="p-3 text-base tracking-tighter">Status</th>
                        <th className="p-3 text-base tracking-tighter">Edit</th>
                        <th className="p-3 text-base tracking-tighter">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {storeProducts.map((product, index) => {
                        return <tr key={index} className="border-b border-opacity-20 border-gray-300 bg-gray-50">
                          <td className="p-3">
                            <img className='h-10 w-10' src={product?.images?.featuredImage || "./vite.svg"} alt="product" />
                          </td>
                          <td className="p-3 text-base tracking-tight">
                            <p>{product?.name}</p>
                          </td>
                          <td className="p-3 text-base tracking-tight">
                            <p>&#8377; {product?.originalPrice}</p>
                          </td>
                          <td className="p-3 text-base tracking-tight">
                            <p>&#8377; {product?.salePrice}</p>
                          </td>
                          <td className="p-3 text-base tracking-tight">
                            {product?.stockStatus ?
                              <span className="bg-orange-200 px-2 text-orange-500 font-bold tracking-tighter py-1">
                                <span>In Stock</span>
                              </span>
                              :
                              <span className="bg-red-200 px-2 text-red-500 font-bold tracking-tighter py-1">
                                <span>Out of stock</span>
                              </span>
                            }
                          </td>
                          <td className="p-3 text-base tracking-tight">
                            {product?.status ?
                              <p className='text-green-600 font-bold tracking-tighter'>Visible</p>
                              :
                              <p className='text-red-600 font-bold tracking-tighter'>Invisible</p>
                            }
                          </td>
                          <td className="p-3 text-base tracking-tight">
                            <Link to={"../edit-product/" + product?._id} className="cursor-pointer px-3 py-1 font-semibold rounded-md bg-violet-600 text-gray-50">
                              <span>Edit</span>
                            </Link>
                          </td>
                          <td className="p-3 text-base tracking-tight">
                            <button onClick={() => openModal(product?._id)} className="px-3 py-1 font-semibold rounded-md bg-red-600 text-gray-50">
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>

                      })}

                    </tbody>
                  </table>
                </div>
              </div>
            </>
          }

        </div>
      </section>

      {/* Dialog Box */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900"
                  >
                    Are you sure?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-md tracking-tight text-gray-500">
                      You want to delete this product
                    </p>
                  </div>

                  <div className="mt-4 flex float-end space-x-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={deleteAccount}
                    >
                      Delete product
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Products