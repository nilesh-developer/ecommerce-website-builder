import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../store/adminAuth'

function AdminLogout() {

    const { logoutAdmin } = useAdminAuth()

    useEffect(() => {
        logoutAdmin()
    }, [logoutAdmin])

    return (
        <Navigate to="/admin-login" />
    )
}

export default AdminLogout