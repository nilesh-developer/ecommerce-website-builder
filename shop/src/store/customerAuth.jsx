import { createContext, useContext, useEffect, useState } from "react";
import isTokenExpired from "../Hooks/verifyJwtToken";

export const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({children}) => {
    const [loading, setLoading] = useState(true)
    const [storeId, setStoreId] = useState("")
    const [customerData, setCustomerData] = useState({})
    const [customerToken, setCustomerToken] = useState(localStorage.getItem("customerToken"))

    const customerTokenInLS = (serverToken) => {
        setCustomerToken(serverToken)
        return localStorage.setItem("customerToken", serverToken)
    }

    const logoutCustomer = () => {
        setCustomerData("")
        setCustomerToken("")
        return localStorage.removeItem("customerToken")
    }

    const customerAuthentication = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customer/current-customer`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${customerToken}`
                }
            })

            if(response.ok){
                const data = await response.json();
                setCustomerData(data.data)
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.log("Error while fetching customer data")
        }
    }

    useEffect(() => {
        if(customerToken){
            if(isTokenExpired(customerToken)){
                localStorage.clear()
            }
            customerAuthentication()
        }
    }, [])

    return (
        <CustomerAuthContext.Provider value={{ loading, setLoading, storeId, setStoreId, customerData, setCustomerData, customerToken, setCustomerToken, customerTokenInLS, logoutCustomer }}>
            {children}
        </CustomerAuthContext.Provider>
    )
}

export const useCustomerAuth = () =>{
    return useContext(CustomerAuthContext);
}