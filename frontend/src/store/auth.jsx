import { createContext, useContext, useEffect, useState } from "react"
import isTokenExpired from "../Hooks/verifyJwtToken";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true)

    //It is used when user register, then user id is required to create a new store
    const [userId, setUserId] = useState("")

    const [userData, setUserData] = useState({})

    const [token, setToken] = useState(localStorage.getItem("token"))

    const storeTokenInLS = (serverToken) => {
        setToken(serverToken)
        return localStorage.setItem("token", serverToken)
    }

    let isLoggedIn = !!token;

    const logoutUser = () => {
        setUserData("")
        setToken("")
        return localStorage.removeItem("token")
    }

    //JWT Authentication

    const userAuthentication = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/current-user`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(response.ok){
                const data = await response.json();
                setUserData(data.data)
                setIsLoading(false)
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            console.log("Error while fetching user data")
        }
    }

    useEffect(() => {
        if(token){
            if(isTokenExpired(token)){
                localStorage.clear()
            }
            userAuthentication()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ userData, setUserData, storeTokenInLS, token, setToken, userId, setUserId, isLoading, isLoggedIn, logoutUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error("useAuth used outside of the Provider")
    }
    return authContextValue;
}