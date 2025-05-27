import { Link, useNavigate } from 'react-router-dom'
import React, { Fragment,useEffect, useState } from 'react'
import { useAuth } from '../../store/auth';
import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react'

function Settings() {
  let [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const {token, loading} = useAuth()

  if(loading){
    return <h1>Loading...</h1>
  }

  const deleteAccount = async (e) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      const responseData = await response.json()
      if (response.ok) {
        toast.success(responseData.message)
        navigate("/login")
      } else {
        toast.error("Something went wrong");
        console.log(responseData);
      } 
    } catch (error) {
      console.log(error)
    }
  }

  // Function to handle sharing
  const handleShare = async () => {
    const shareData = {
      title: 'My Awesome Content',
      text: 'Check out this amazing link!',
      url: window.location.origin,  // Replace with your desired link
    };

    // Check if the Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Content shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert('Your browser does not support the Web Share API.');
    }
  }

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <section className='bg-white flex-grow h-full min-h-dvh lg:h-dvh lg:pb-8 pb-20'>
      <div className='lg:my-10 my-5 mx-3 lg:mx-5'>
        <h2 className='text-3xl text-zinc-900 font-extrabold tracking-tight'>Settings</h2>
      </div>
      <div className='mx-5'>
        <div className='grid grid-rows-3 lg:grid-rows-none lg:grid-cols-3 gap-6'>
          <div className='bg-gray-50 w-auto h-fit p-5 rounded-md'>
            <div className='flex flex-wrap justify-center mt-5 mb-4'>
              <img className='h-20 w-20' src="/person.svg" alt="" />
            </div>
            <h2 className='text-center text-xl tracking-tight font-semibold'>Change your personal information</h2>
            <div className='flex flex-wrap justify-center mt-5'>
              <Link to="../edit-profile">
                <button className="bg-orange-600 text-sm font-semibold px-4 py-3 rounded-lg text-gray-50">EDIT PROFILE</button>
              </Link>
            </div>
          </div>

          <div className='bg-gray-50 w-auto h-fit p-5 rounded-md'>
            <div className='flex flex-wrap justify-center mt-5 mb-4'>
              <img className='h-20 w-20' src="/payment.svg" alt="" />
            </div>
            <h2 className='text-center text-xl tracking-tight font-semibold'>Make change in payment method</h2>
            <div className='flex flex-wrap justify-center mt-5'>
              <Link to="../add-payment-details">
                <button className="bg-orange-600 text-sm font-semibold px-4 py-3 rounded-lg text-gray-50">UPDATE PAYMENT</button>
              </Link>
            </div>
          </div>

          <div className='bg-gray-50 w-auto h-fit p-5 rounded-md'>
            <div className='flex flex-wrap justify-center mt-5 mb-4'>
              <img className='h-20 w-20' src="/share.svg" alt="" />
            </div>
            <h2 className='text-center text-xl tracking-tight font-semibold'>Change your personal information</h2>
            <div className='flex flex-wrap justify-center mt-5'>
                <button onClick={handleShare} className="bg-orange-600 text-sm font-semibold px-4 py-3 rounded-lg text-gray-50">SHARE</button>
              {/* <Link to="/">
              </Link> */}
            </div>
          </div>
        </div>

      </div>

      <div className='flex justify-center items-center mt-16'>
        <button type='button' onClick={openModal} className="btn btn-error text-gray-50">Delete my account</button>
      </div>
      <div className='flex justify-center items-center mt-2'>
        <h3 className='text-gray-600'>Action cannot be reversed</h3>
      </div>

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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-50 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900"
                  >
                    Are you sure?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-md tracking-tight text-gray-500">
                      You want to delete your account permenently. This action cannot be reversed
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
                      Delete my account
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

    </section>
  )
}

export default Settings