import React from 'react'
import { Navigate } from 'react-router-dom'
import { useCustomerAuth } from '../store/customerAuth'

function CustomerPrivateRoute({children}) {
    const {customerToken} = useCustomerAuth()
  return customerToken ? children : <Navigate to="/login" />
}

export default CustomerPrivateRoute