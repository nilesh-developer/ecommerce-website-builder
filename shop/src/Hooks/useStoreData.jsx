import { useEffect, useState } from "react"

function useStoreData() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState({})

    const token = localStorage.getItem("token")

    useEffect(() => {
        ; (async () => {
            try {
                setLoading(true)
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
        })()
    }, [])

    return {user, loading}
}

export default useStoreData
