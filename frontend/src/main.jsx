import React from 'react'
import ReactDOM from 'react-dom/client'
import {inject} from "@vercel/analytics"
import App from './App.jsx'
import './index.css'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom'
import Layout from './pages/Home/Layout.jsx'
import {
  Login,
  SignUp,
  Home,
  Logout,
  AboutUs,
  Pricing,
  TermsAndConditions,
  ContactForm,
  StorePolicy,
  PrivacyPolicy,
  RefundPolicy,
  CookiePolicy,
  ShippingPolicy,
  Checkout
} from "./components/Home/index.js"
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './store/auth.jsx'
import SellerLayout from './pages/Seller/SellerLayout.jsx'
import {
  AddCategory,
  AddCoupon,
  AddPaymentDetails,
  AddProduct,
  Analytics,
  Category,
  Coupon,
  Customer,
  CustomizeBanner,
  CustomizeFooter,
  CustomizeStore,
  Dashboard,
  DialogBox,
  DomainSettings,
  EditCategory,
  Orders,
  Payment,
  Products,
  SellerOrderPage,
  SellerPayoutPage,
  Settings,
  SinglePayoutPage,
  Store,
  StoreAboutPage,
  Subscriptions,
  UserProfile
} from './components/Seller/index.js'
import Error from './pages/Home/Error.jsx'
import Createstore from './components/Home/Createstore.jsx'
import PrivateRoute from './PrivateRoute/index.jsx'
import EditProduct from './pages/Seller/EditProducts.jsx'
import EditCoupon from './pages/Seller/EditCoupon.jsx'
import PaymentMethod from './pages/Seller/PaymentMethod.jsx'
import ControlRoute from './helper/ControlRoute.jsx'
import BusinessDetails from './components/Home/BusinessDetails.jsx'
import PremiumRoute from './PrivateRoute/PremiumRoute.jsx'
import CheckStoreCreated from './PrivateRoute/CheckStoreCreated.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import { AuthAdminProvider } from './store/adminAuth.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AllOrders from './pages/admin/AllOrders.jsx'
import AllSellers from './pages/admin/AllSellers.jsx'
import AllCustomers from './pages/admin/AllCustomers.jsx'
import AllPayouts from './pages/admin/AllPayouts.jsx'
import AdminOrderPage from './pages/admin/AdminOrderPage.jsx'
import AdminLogout from './pages/admin/AdminLogout.jsx'
import StorePage from './pages/admin/StorePage.jsx'
import CustomerPage from './pages/admin/CustomerPage.jsx'
import PayoutPage from './pages/admin/PayoutPage.jsx'
import AdminChangePassword from './pages/admin/AdminChangePassword.jsx'
import StoreBuilderLanding from './components/Home/StoreBuilderLanding.jsx'
import AdminPayoutPage from './pages/admin/AdminPayoutPage.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<ControlRoute><Layout /></ControlRoute>} >
        {/* <Route path='' element={<Home />} /> */}
        <Route path='' element={<StoreBuilderLanding />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='login' element={<Login />} />
        {/* <Route path='pricing' element={<Pricing />} /> */}
        <Route path='checkout' element={<Checkout />} />
        <Route path='terms-and-conditions' element={<TermsAndConditions />} />
        <Route path='privacy-policy' element={<PrivacyPolicy />} />
        <Route path='refund-policy' element={<RefundPolicy />} />
        <Route path='cookie-policy' element={<CookiePolicy />} />
        <Route path='shipping-policy' element={<ShippingPolicy />} />
        <Route path='privacy-policy' element={<PrivacyPolicy />} />
        <Route path='contact-us' element={<ContactForm />} />
        <Route path='about-us' element={<AboutUs />} />
        <Route path='create-store' element={<Createstore />} />
        <Route path='business-details/:storename' element={<BusinessDetails />} />
        <Route path='logout' element={<Logout />} />
      </Route>
      <Route path='seller' element={
        <CheckStoreCreated>
          <PrivateRoute>
            <PremiumRoute>
              <SellerLayout />
            </PremiumRoute>
          </PrivateRoute>
        </CheckStoreCreated>
      } >
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='products' element={<Products />} />
        <Route path='orders' element={<Orders />} />
        <Route path='coupon' element={<Coupon />} />
        <Route path='analytics' element={<Analytics />} />
        <Route path='categories' element={<Category />} />
        <Route path='customers' element={<Customer />} />
        <Route path='payments' element={<PaymentMethod />} />
        <Route path='edit-store' element={<Store />} />
        <Route path='settings' element={<Settings />} />
        <Route path='customize-store' element={<CustomizeStore />} />
        <Route path='customize-banner' element={<CustomizeBanner />} />
        <Route path='store-policies' element={<StorePolicy />} />
        <Route path='about-page' element={<StoreAboutPage />} />
        <Route path='customize-footer' element={<CustomizeFooter />} />
        <Route path='domain-settings' element={<DomainSettings />} />
        <Route path='edit-profile' element={<UserProfile />} />
        <Route path='dialogbox' element={<DialogBox />} />
        <Route path='subscriptions' element={<Subscriptions />} />
        <Route path='add-product' element={<AddProduct />} />
        <Route path='add-category' element={<AddCategory />} />
        <Route path='edit-category/:id' element={<EditCategory />} />
        <Route path='edit-product/:id' element={<EditProduct />} />
        <Route path='add-coupon' element={<AddCoupon />} />
        <Route path='edit-coupon/:id' element={<EditCoupon />} />
        <Route path='add-payment-details' element={<AddPaymentDetails />} />
        <Route path='payouts' element={<SellerPayoutPage />} />
        <Route path='payouts/:id' element={<SinglePayoutPage />} />
        <Route path='orders/:id' element={<SellerOrderPage />} />
      </Route>
      <Route path='admin' element={<AdminLayout />}>
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='orders' element={<AllOrders />} />
        <Route path='sellers' element={<AllSellers />} />
        <Route path='customers' element={<AllCustomers />} />
        {/* <Route path='payouts' element={<AllPayouts />} /> */}
        <Route path='payouts' element={<AdminPayoutPage />} />
        <Route path='orders/:id' element={<AdminOrderPage />} />
        <Route path='store/:id' element={<StorePage />} />
        <Route path='customers/:id' element={<CustomerPage />} />
        <Route path='payouts/:id' element={<PayoutPage />} />
        <Route path='change-password' element={<AdminChangePassword />} />
        <Route path='logout' element={<AdminLogout />} />
      </Route>
      <Route path='admin-login' element={<AdminLogin />} />
      <Route path='*' element={<Error />} />
    </>
  )
)

inject()

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <AuthAdminProvider>
      <React.StrictMode>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
      </React.StrictMode>
    </AuthAdminProvider>
  </AuthProvider>
)
