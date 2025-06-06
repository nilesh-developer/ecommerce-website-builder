import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom'
import StoreLayout from './pages/StoreLayout.jsx'
import {
  AboutUs,
  Account,
  AccountContent,
  Cart,
  Checkout,
  CustomerLogin,
  CustomerSignUp,
  Error,
  Homepage,
  Order,
  OrderPage,
  PaymentResponsePage,
  QuickCheckout,
  ReturnPolicy,
  SearchPage,
  ShippingPolicy,
  Shop,
  UpdatePassword
} from './components/index.js'
import Product from './pages/Product.jsx'
import SubdomainExist from './PrivateRoute/SubdomainExist.jsx'
import { CustomerAuthProvider } from './store/customerAuth.jsx'
import CustomerLogout from './pages/CustomerLogout.jsx'
import { CartProvider } from './store/CartContext.jsx'
import CustomerPrivateRoute from './PrivateRoute/CustomerPrivateRoute.jsx'
import getSubdomain from './Hooks/getSubdomain.jsx'
import { Toaster } from 'react-hot-toast';
import Category from './pages/Category.jsx'
import PaymentSuccess from './pages/PaymentSuccess.jsx'
import PaymentFailed from './pages/PaymentFailed.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={
        <SubdomainExist>
          <CartProvider>
            <StoreLayout />
          </CartProvider>
        </SubdomainExist>
      } >
        <Route path='' element={<Homepage />} />
        <Route path='signup' element={<CustomerSignUp />} />
        <Route path='login' element={<CustomerLogin />} />
        <Route path='shop' element={<Shop />} />
        <Route path="search" element={<SearchPage />} />
        <Route path='product/:id' element={<Product />} />
        <Route path='category/:id' element={<Category />} />
        <Route path='return-policy' element={<ReturnPolicy />} />
        <Route path='shipping-policy' element={<ShippingPolicy />} />
        <Route path='about' element={<AboutUs />} />
        <Route path='payment-success' element={<PaymentSuccess />} />
        <Route path='payment-failed' element={<PaymentFailed />} />
        <Route path='payment-response' element={
          <CustomerPrivateRoute>
            <PaymentResponsePage />
          </CustomerPrivateRoute>
        } />
        <Route path='quick-checkout' element={<QuickCheckout />} />
        <Route path='cart' element={<Cart />} />
        <Route path='checkout' element={
          <CustomerPrivateRoute>
            <Checkout />
          </CustomerPrivateRoute>
        } />
        <Route path='order-success' element={<OrderSuccess />} />
        <Route path='account' element={
          <CustomerPrivateRoute>
            <Account />
          </CustomerPrivateRoute>
        }>
          <Route path='' element={<AccountContent />} />
          <Route path='update-password' element={<UpdatePassword />} />
        </Route>
        <Route path='orders' element={
          <CustomerPrivateRoute>
            <Order />
          </CustomerPrivateRoute>
        } />
        <Route path='order/:id' element={
          <CustomerPrivateRoute>
            <OrderPage />
          </CustomerPrivateRoute>
        } />
        <Route path='logout' element={<CustomerLogout />} />
        <Route path='*' element={<Error />} />
      </Route>
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <CustomerAuthProvider>
    <React.StrictMode>
      <RouterProvider router={router} />
      <Toaster />
    </React.StrictMode>
  </CustomerAuthProvider>
)
