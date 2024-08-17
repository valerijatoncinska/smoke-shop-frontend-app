import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Cookies from "js-cookie"
import { AppDispatch, RootState } from "../../store/store"
import {
  addItemToCart,
  fetchCartItems,
  updateCartItem,
} from "../../store/redux/cartSlice"
import "./ProductPage.css"

interface Product {
  id: string
  title: string
  price: number
  quantity: number
  active: boolean
}

const ProductPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState<number>(1) // Initial quantity set to 1

  const [showAddedMessage, setShowAddedMessage] = useState<boolean>(false) // Состояние для отображения сообщения

  const { id } = useParams<{ id: string }>()
  const dispatch: AppDispatch = useDispatch()
  const cartItems = useSelector((state: RootState) => state.cart.items)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch product")
        }

        const data = await response.json()
        setProduct(data.data)
        setQuantity(1)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = (productId: number) => {
    dispatch(addItemToCart(productId))
    setShowAddedMessage(true)

    setTimeout(() => {
      setShowAddedMessage(false) // Скрыть сообщение через 3 секунды
    }, 3000)
  }

  const increaseQuantity = () => {
    if (product && quantity < product.quantity) {
      setQuantity(prevQuantity => prevQuantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!product) {
    return <div>No product data available</div>
  }

  return (
    <div className="product-page">
      {showAddedMessage && (
        <div className="added-message-container">
          <div className="added-message">Product added to cart!</div>
        </div>
      )}
      <Link to="/catalog" className="back-link">
        Come back
      </Link>{" "}
      {/* Use Link for navigation */}
      <div className="product-container">
        <div className="product-image-section">
          <div className="main-image-placeholder" />
          <div className="thumbnail-images-placeholder">
            <div className="thumbnail-placeholder" />
            <div className="thumbnail-placeholder" />
            <div className="thumbnail-placeholder" />
            <div className="thumbnail-placeholder" />
          </div>
        </div>
        <div className="product-details-section">
          <h1>{product.title}</h1>
          <div className="product-price">Price: {product.price}€</div>
          {/*           <div className="product-quantity">
            <button onClick={decreaseQuantity}>-</button>
            <input type="number" value={quantity} readOnly />
            <button onClick={increaseQuantity}>+</button>
          </div> */}
          <button
            onClick={() => handleAddToCart(+product.id)}
            className="add-to-basket-button"
          >
            Add to Cart
          </button>
          <div className="product-description">
            <h2>Description</h2>
            <p>
              This is a placeholder description for the product "{product.title}
              ".
            </p>
          </div>
          <div className="product-characteristics">
            <h2>Characteristics</h2>
            <p>Stock: {product.quantity}</p>
            <p>Status: {product.active ? "Available" : "Unavailable"}</p>
          </div>
        </div>
      </div>
      <footer className="footer-text">Have a good day!</footer>
    </div>
  )
}

export default ProductPage
