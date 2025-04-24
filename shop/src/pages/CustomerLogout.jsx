import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useCustomerAuth } from '../store/customerAuth'

function CustomerLogout() {

    const { logoutCustomer } = useCustomerAuth()

    useEffect(() => {
        logoutCustomer()
    }, [logoutCustomer])

    return (
        <Navigate to="/login" />
    )
}

export default CustomerLogout