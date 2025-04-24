import React from 'react'
import { useAuth } from '../store/auth'
import { Navigate } from 'react-router-dom'

function PrivateRoute({children}) {
    const {token} = useAuth()
  return token ? children : <Navigate to="/login" />
}

export default PrivateRoute