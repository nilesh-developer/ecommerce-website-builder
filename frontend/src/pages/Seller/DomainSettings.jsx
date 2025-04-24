import React, { Fragment, useEffect, useState } from 'react'
import { useAuth } from '../../store/auth';
import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react'
import { useNavigate } from 'react-router-dom';

function DomainSettings() {
  let [isOpen, setIsOpen] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  const [domain, setDomain] = useState("");
  const [showSectionTwo, setShowSectionTwo] = useState(false);
  const navigate = useNavigate()
  const [store, setStore] = useState({})
  const [storeId, setStoreId] = useState("")
  const [updateStoreStatus, setUpdateStoreStatus] = useState(true)
  const [loading, setLoading] = useState(true)
  const { token } = useAuth();

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
        setStoreId(responseData.data.store._id);
        setStore(responseData.data.store);
        setDomain(responseData.data.customDomain);
        setUpdateStoreStatus(responseData.data.store.status);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getStoreData();
  }, [updateStoreStatus]);

  if (loading) {
    return <div className='flex h-[calc(100vh-100px)] lg:h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
  }

  const changeStoreStatus = async (e) => {
    e.preventDefault()
    setUpdateStoreStatus(!updateStoreStatus)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/update/status/${storeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: !updateStoreStatus
        }),
      });

      if (response.ok) {
        const responseData = await response.json()
        toast.success(responseData.message)
      } else {
        toast.error("Something went wrong");
        console.log(error);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setShowSectionTwo(false); // Reset to Section 1 when popup is closed
    setDomain(""); // Clear the domain input on close
  };

  const isValidDomain = (domain) => {
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (isValidDomain(domain)) {
      setShowSectionTwo(true);
    }
  };

  const handleDomainSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/add-domain/${storeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customDomain: domain
        }),
      });

      if (response.ok) {
        const responseData = await response.json()
        togglePopup()
        toast.success("Domain added successfully")
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error)
    }
  }

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const deleteStore = async (e) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/delete/${storeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const responseData = await response.json()
        toast.success(responseData.message)
        navigate("/login")
      } else {
        toast.error("Something went wrong");
        console.log(error);
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className='flex-grow h-screen'>
        <div className='lg:my-7 lg:mx-10 my-3 mx-3'>
          <h2 className='text-2xl lg:text-3xl text-zinc-900 font-bold tracking-tighter'>Domain Settings</h2>
          <div className='mt-8'>
            <h2 className='font-semibold text-xl tracking-tight text-gray-700'>Your store is live at</h2>
            {store.customDomain ?
              <div className='mt-4 flex'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6" viewBox="0 0 512 511.999"><path d="M476.335 35.664v.001c47.554 47.552 47.552 125.365.002 172.918l-101.729 101.73c-60.027 60.025-162.073 42.413-194.762-32.45 35.888-31.191 53.387-21.102 87.58-6.638 20.128 8.512 43.74 3.955 60.08-12.387l99.375-99.371c21.49-21.493 21.492-56.662 0-78.155-21.489-21.488-56.677-21.472-78.151 0l-71.278 71.28c-23.583-11.337-50.118-14.697-75.453-10.07a121.476 121.476 0 0118.767-24.207l82.651-82.65c47.554-47.551 125.365-47.555 172.918-.001zM35.664 476.334l.001.001c47.554 47.552 125.365 47.552 172.917 0l85.682-85.682a121.496 121.496 0 0019.325-25.157c-27.876 6.951-57.764 4.015-83.932-8.805l-70.192 70.19c-21.472 21.471-56.658 21.492-78.149 0-21.492-21.491-21.493-56.658 0-78.149l99.375-99.376c20.363-20.363 61.002-26.435 91.717 1.688 29.729-3.133 41.275-8.812 59.742-26.493-39.398-69.476-137.607-80.013-194.757-22.863L35.664 303.417c-47.552 47.553-47.552 125.364 0 172.917z" /></svg>
                <a className='ml-2 font-bold underline text-xl' href={`https://${store.customDomain}`}>{store.customDomain}</a>
              </div> : null
            }
            <div className='mt-4 flex'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6" viewBox="0 0 512 511.999"><path d="M476.335 35.664v.001c47.554 47.552 47.552 125.365.002 172.918l-101.729 101.73c-60.027 60.025-162.073 42.413-194.762-32.45 35.888-31.191 53.387-21.102 87.58-6.638 20.128 8.512 43.74 3.955 60.08-12.387l99.375-99.371c21.49-21.493 21.492-56.662 0-78.155-21.489-21.488-56.677-21.472-78.151 0l-71.278 71.28c-23.583-11.337-50.118-14.697-75.453-10.07a121.476 121.476 0 0118.767-24.207l82.651-82.65c47.554-47.551 125.365-47.555 172.918-.001zM35.664 476.334l.001.001c47.554 47.552 125.365 47.552 172.917 0l85.682-85.682a121.496 121.496 0 0019.325-25.157c-27.876 6.951-57.764 4.015-83.932-8.805l-70.192 70.19c-21.472 21.471-56.658 21.492-78.149 0-21.492-21.491-21.493-56.658 0-78.149l99.375-99.376c20.363-20.363 61.002-26.435 91.717 1.688 29.729-3.133 41.275-8.812 59.742-26.493-39.398-69.476-137.607-80.013-194.757-22.863L35.664 303.417c-47.552 47.553-47.552 125.364 0 172.917z" /></svg>
              <a className='ml-2 font-bold underline text-xl' href={`https://${store.subdomain}`}>{store.subdomain}</a>
            </div>

            <button
              className="bg-orange-600 text-white px-4 py-2 rounded mt-10"
              onClick={togglePopup}
            >
              ADD CUSTOM DOMAIN
            </button>

            {/* Popup Modal */}
            {showPopup && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    onClick={togglePopup}
                  >
                    &times;
                  </button>

                  {/* Section 1: Domain Input Form */}
                  {!showSectionTwo && (
                    <>
                      <h2 className="text-lg font-semibold mb-4">Enter your domain</h2>
                      <form onSubmit={handleContinue}>
                        <div className="mb-4">
                          <input
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            className="border border-orange-500 w-full px-3 py-2 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Ex: example.com"
                          />
                          {!isValidDomain(domain) && domain && (
                            <p className="text-orange-500 mt-2">
                              Domain name must be valid
                            </p>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <button
                            type="button"
                            className="bg-gray-300 px-4 py-2 rounded"
                            onClick={togglePopup}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className={`px-4 py-2 rounded ${isValidDomain(domain)
                              ? "bg-orange-500 text-white"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                            disabled={!isValidDomain(domain)}
                          >
                            Continue
                          </button>
                        </div>
                      </form>
                    </>
                  )}

                  {/* Section 2: Instructions */}
                  {showSectionTwo && (
                    <>
                      <h2 className="text-md font-semibold mb-4">Steps to Connect Domain</h2>
                      <div className="mb-6 border-t border-gray-200 pt-4">
                        <h3 className="text-lg font-bold mb-2">Instructions</h3>
                        <p className="text-sm">
                          <span className='bg-orange-200 px-2 rounded-full'>1</span> Login to your domain provider (GoDaddy, Hostinger, NameCheap, etc.)
                          <br /><br />
                          <span className='bg-orange-200 px-2 rounded-full'>2</span> Locate the page for updating your domain's DNS records. The page might be called something like DNS Management, Name Server Management, or Advanced Settings.
                          <br /><br />
                          <span className='bg-orange-200 px-2 rounded-full'>3</span>
                          Create a new record with:<br />
                          type: <b>A record</b><br />
                          host, name, or alias, field: <b>@ or leave blank for exact domain name</b><br />
                          target or points to field: <b>76.76.21.21</b>
                          <br /><br />
                          <span className='bg-orange-200 px-2 rounded-full'>4</span>
                          Add one more record if you are not using subdomain (i.e using apex domain, eg: yourdomain.com)<br />
                          type: <b>A record</b><br />
                          host, name, or alias, field: <b>www</b><br />
                          target or points to field: <b>76.76.21.21</b><br /><br />
                          For specific domain providers refer to <a href="https://knowledge.hubspot.com/domains-and-urls/update-your-dns-records" className="text-orange-600" target="_blank" rel="noopener noreferrer">this guide</a>.
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <button
                          type="button"
                          className="bg-gray-300 px-4 py-2 rounded"
                          onClick={togglePopup}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="bg-orange-500 text-white px-4 py-2 rounded"
                          onClick={handleDomainSubmit}
                        >
                          Finish
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}


            <h2 className='mt-12 lg:text-3xl tracking-tighter font-bold text-zinc-900 text-2xl'>Deactivate & Delete Store</h2>
            <div className='mt-6 w-[160px] grid grid-flow-row gap-3'>
              {store.status === true ?
                <button onClick={changeStoreStatus} className="btn btn-error text-white">Deactivate Store</button>
                :
                <button onClick={changeStoreStatus} className="btn btn-success text-white">Activate Store</button>
              }
              <button type="button" onClick={openModal} className="btn btn-error text-white">Delete Store </button>

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
                              You want to delete your store permenently. This action cannot be reversed
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
                              onClick={deleteStore}
                            >
                              Delete Store
                            </button>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DomainSettings