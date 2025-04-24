import React, { useEffect, useState } from 'react'
import { useAuth } from '../../store/auth';
import toast from 'react-hot-toast';

function Payment() {
  const { token } = useAuth()
  const [store, setStore] = useState({})
  const [loading, setLoading] = useState(true);
  const [addPayment, setAddPayment] = useState({
    name: "",
    upiId: ""
  })
  const [status, setStatus] = useState(true)

  const getStoreData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/current-user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setStore(responseData.data.store);
        setStatus(responseData.data.store.upiStatus)
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getStoreData()
  }, [])

  if (loading) {
    return <div className='flex h-[calc(100vh-100px)] lg:h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
  }

  const handleInput = (e) => {
    const { name, value } = e.target;

    setAddPayment({
      ...addPayment,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/upi/add/${store._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...addPayment
        })

      })
      const responseData = await response.json()
      if (response.ok) {
        setAddPayment({
          name: "",
          upiId: ""
        })
        toast.success(responseData.message)
        getStoreData()
      } else {
        toast.error(responseData.message)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleStatus = async (e) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/upi/change-status/${store._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: !status
        })
      })

      const responseData = await response.json()
      if (response.ok) {
        toast.success(responseData.message)
        getStoreData()
      } else {
        toast.error(responseData.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteUpiId = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/upi/delete/${store._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      })

      const responseData = await response.json()
      if (response.ok) {
        toast.success(responseData.message)
        getStoreData()
      } else {
        toast.error(responseData.message)
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <section className='bg-gray-100 flex-grow h-dvh min-w-80 lg:h-dvh lg:pb-0 pb-20'>
      <div className='lg:my-7 lg:mx-7 my-5 mx-3'>
        <h2 className='text-xl lg:text-3xl text-zinc-900 font-extrabold tracking-tight'>Set UPI ID</h2>
      </div>
      <div className='px-4 lg:px-7'>
        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Receiver Name"
            name='name'
            onChange={handleInput}
            className="bg-white input input-bordered input-primary w-full max-w-xs"
          /><br />
          <input
            type="text"
            placeholder="UPI ID"
            name='upiId'
            onChange={handleInput}
            className="bg-white input input-bordered input-primary w-full max-w-xs mt-3"
          /><br />
          <button
            className="btn btn-primary text-white mt-3"
          >Save
          </button>

        </form>
      </div>
      {store.upiId ?
        <div className="overflow-x-auto mt-7 mx-4 lg:mx-7">
          <table className="min-w-full text-xs">
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
            </colgroup>
            <thead className="dark:bg-gray-300">
              <tr className="text-left">
                <th className="p-3 text-base tracking-tighter">UPI ID</th>
                <th className="p-3 text-base tracking-tighter">Receiver Name</th>
                <th className="p-3 text-base tracking-tighter">Status</th>
                <th className="p-3 text-base tracking-tighter">Modify</th>
                <th className="p-3 text-base tracking-tighter">Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-opacity-20 border-gray-300 bg-gray-50">
                <td className="p-3 text-base tracking-tight">
                  <p>{store.upiId}</p>
                </td>
                <td className="p-3 text-base tracking-tight">
                  <p>{store.upiReceiverName}</p>
                </td>
                <td className="p-3 text-base tracking-tight">
                  {store.upiStatus ?
                    <p className='text-green-800 font-bold'>Active</p>
                    :
                    <p className='text-red-800 font-bold'>Inactive</p>
                  }
                </td>
                <td className="p-3 text-base tracking-tight">
                  {store.upiStatus ?
                    <button type='button' onClick={handleStatus} className="px-3 py-1 font-semibold rounded-md bg-red-600 text-gray-50">
                      Deactivate
                    </button>
                    : <button type='button' onClick={handleStatus} className="px-3 py-1 font-semibold rounded-md bg-blue-600 text-gray-50">
                      Activate
                    </button>
                  }
                </td>
                <td className="p-3 text-base tracking-tight">
                  <button type='button' onClick={deleteUpiId} className="px-3 py-1 font-semibold rounded-md bg-red-600 text-gray-50">
                    Delete
                  </button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
        : ""
      }
    </section>
  )
}

export default Payment