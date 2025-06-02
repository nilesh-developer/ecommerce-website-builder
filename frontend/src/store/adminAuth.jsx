import { createContext, useContext, useEffect, useState } from "react"
import isTokenExpired from "../Hooks/verifyJwtToken";

export const AuthAdminContext = createContext();

export const AuthAdminProvider = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true)

    //It is used when user register, then user id is required to create a new store
    const [adminId, setAdminId] = useState("")

    const [adminData, setAdminData] = useState({})

    const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken"))

    const storeAdminTokenInLS = (serverToken) => {
        setAdminToken(serverToken)
        return localStorage.setItem("adminToken", serverToken)
    }

    let isLoggedIn = !!adminToken;

    const logoutAdmin = () => {
        setAdminData("")
        setAdminToken("")
        return localStorage.removeItem("adminToken")
    }

    //JWT Authentication

    const adminAuthentication = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/current-user`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            })

            if(response.ok){
                const data = await response.json();
                setAdminData(data.data)
                setIsLoading(false)
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            console.log("Error while fetching user data")
        }
    }

    useEffect(() => {
        if(adminToken){
            if(isTokenExpired(adminToken)){
                localStorage.clear()
            }
            adminAuthentication()
        }
    }, [])

    return (
        <AuthAdminContext.Provider value={{ adminData, setAdminData, storeAdminTokenInLS, adminToken, setAdminToken, adminId, setAdminId, isLoading, isLoggedIn, logoutAdmin }}>
            {children}
        </AuthAdminContext.Provider>
    )
}

export const useAdminAuth = () => {
    const authContextValue = useContext(AuthAdminContext);
    if (!authContextValue) {
        throw new Error("useAuth used outside of the Provider")
    }
    return authContextValue;
}