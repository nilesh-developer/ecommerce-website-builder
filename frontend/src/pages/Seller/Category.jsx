import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../store/auth'


function Category() {
  const { token } = useAuth()
  const [store, setStore] = useState({})
  const [categories, setCategories] = useState()
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/category/get-data/${storeData.data.store._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const responseData = await response.json()
        setCategories(responseData.data)
      }

      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    getCategoryData()
  }, [])

  if (isLoading) {
    return <div className='flex h-[calc(100vh-100px)] lg:h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
  }


  return (
    <>
      <section className='bg-white h-screen w-full lg:h-dvh lg:pb-0 pb-20'>
        <div className='lg:my-7 my-5 mx-3 lg:mx-5'>
          <div className="container p-2 mx-auto sm:p-4 text-gray-800">
            <div className='flex justify-between lg:justify-start lg:gap-5'>
              <h2 className='text-xl lg:text-3xl text-zinc-900 font-extrabold tracking-tight'>Category</h2>
              <Link to="../add-category"><h2 className='text-md font-semibold bg-orange-600 text-white rounded-xl px-3 py-2 tracking-tighter'>Add Category</h2></Link>
            </div>

            {categories.length === 0 ?

              <div className='w-full mt-20'>
                <div className='flex justify-center items-center'>
                  <img className='h-40 w-40' src="/category.png" alt="" />
                </div>
                <h1 className='text-center text-2xl font-semibold tracking-tighter text-gray-700'>Not added categories yet!</h1>
              </div>
              :
              <div className="lg:overflow-auto overflow-scroll mt-7">
                <table className="min-w-full text-xs">
                  <colgroup>
                    <col />
                    <col />
                    <col />
                    <col />
                    <col />
                  </colgroup>
                  <thead className="bg-gray-100">
                    <tr className="text-left">
                      <th className="p-3 text-base tracking-tighter">Image</th>
                      <th className="p-3 text-base tracking-tighter">Name</th>
                      <th className="p-3 text-base tracking-tighter">Slug</th>
                      <th className="p-3 text-base tracking-tighter">No. of Products</th>
                      <th className="p-3 text-base tracking-tighter">Edit Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) =>
                      <tr key={index} className="border-b border-opacity-20 border-gray-300 bg-white">
                        <td className="p-3 text-base tracking-tight">
                          <img className='h-10 w-10' src={category.image} alt="" />
                        </td>
                        <td className="p-3 text-base tracking-tight">
                          <p>{category.name}</p>
                        </td>
                        <td className="p-3 text-base tracking-tight">
                          <p>{category.slug}</p>
                        </td>
                        <td className="p-3 text-base tracking-tight">
                          <p>{category.products.length}</p>
                        </td>
                        <td className="p-3 text-base tracking-tight">
                          <Link to={"../edit-category/"+category._id}>
                            <button className="px-4 py-1 font-semibold rounded-md bg-orange-600 text-gray-50">
                              Edit
                            </button>
                          </Link>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            }

          </div>
        </div>
      </section>

    </>
  )
}

export default Category