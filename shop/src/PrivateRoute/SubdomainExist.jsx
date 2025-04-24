import React, { useEffect, useState } from 'react';
import LazyLoadingPage from '../components/LazyLoadingPage'

function SubdomainExist({ children }) {
    const [loading, setLoading] = useState(true)
    const [store, setStore] = useState("")

    const subdomain = window.location.hostname;
    
    useEffect(() => {
        try {
            setLoading(true)
                ; (async () => {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/data`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ subdomain })
                    })
                    const responseData = await response.json();
                    if (responseData.data.store.status === true) {
                        setStore(responseData.data.store)
                    }


                })()

            setLoading(false)

        } catch (error) {
            console.log("Error", error)
            setLoading(false)
        }
    }, [])

    if (loading) {
        return <LazyLoadingPage />
    }


    return store && loading === false ? children : 
    <>
    <div className='flex h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    </>

}

export default SubdomainExist