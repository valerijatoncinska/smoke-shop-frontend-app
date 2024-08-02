import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import OrderPage from "./components/OrderPage/OrderPage"
import AddProductForm from "./components/AddProductForm/AddProductForm"
import CheckoutPage from "./components/CheckoutPage/CheckoutPage"
import EditProductPage from "./components/EditProductPage/EditProductPage"
import Layout from "./components/Navigation/Layout"
import HomePage from "./components/HomePage/HomePage"
import AdminLayout from "./components/AdminInterface/Layout/AdminLayout"
import AllOrdersPage from "./components/AdminInterface/AdminAllOrders/AllOrdersPage"
import OrderHistoryPage from './components/OrderHistoryPage/OrderHistoryPage';
import CartPage from './components/CartPage/CartPage';
import ProductPage from './components/ProductPage/ProductPage'; 
import UserProfilePage from './components/UserProfilePage/UserProfilePage';
import PaymentPage from './components/PaymentPage/PaymentPage';
import OrderConfirmationPage from './components/OrderConfirmationPage/OrderConfirmationPage';
import CatalogProductPage from "./components/CatalogProductPage/CatalogProductPage"
import AdminCatalogProductPage from "./components/AdminInterface/CatalogProductPage/AdminCatalogProductPage"
import LoginPage from "./components/AuthRootComponent/LoginPage"
import RegisterPage from "./components/AuthRootComponent/RegisterPage"

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header"></header>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/catalog" element={<CatalogProductPage />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/products/new" element={<AddProductForm />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/products/edit/:id" element={<EditProductPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin/view-orders" element={<AllOrdersPage />} />
          <Route path="/admin/catalog" element={<AdminCatalogProductPage />} />
        </Route>
        <Route path="/cart" element={<CartPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
      </Routes>
    </div>
  )
}

export default App
