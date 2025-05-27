import { useEffect, useState } from "react"
import isTokenExpired from "./verifyJwtToken"

function useStoreData() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState({})

    const token = localStorage.getItem("token")

    const userAuthentication = async () => {
        try {
            setLoading(true)
            if (isTokenExpired(token)) {
                localStorage.clear()
            }
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/current-user`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.ok) {
                const responseData = await response.json();
                setUser(responseData.data)
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.log("Error while fetching user data", error)
        }
    }
    useEffect(() => {
        userAuthentication()
    }, [])

    return { user, loading, userAuthentication }
}

export default useStoreData
