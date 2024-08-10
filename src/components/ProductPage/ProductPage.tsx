import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductPage.css';

interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number;
  active: boolean;
}

const ProductPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1); // Initial quantity set to 1

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = await response.json();
        setProduct(data.data); // Accessing the 'data' object from the response
        setQuantity(1); // Resetting quantity to 1 when a new product is loaded
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert('You must be logged in to add items to the cart.');
      return;
    }

    if (product) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');

      const existingProductIndex = cart.findIndex((item: any) => item.id === product.id);
      if (existingProductIndex > -1) {
        // If the product already exists in the cart, update the quantity
        cart[existingProductIndex].quantity += quantity;
      } else {
        // If the product is not in the cart, add it
        cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: quantity,
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Product added to cart successfully!');
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.quantity) {
      setQuantity(prevQuantity => prevQuantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>No product data available</div>;
  }

  return (
    <div className="product-page">
      <a href="/catalog" className="back-link">Come back</a>
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
          <div className="product-quantity">
            <button onClick={decreaseQuantity}>-</button>
            <input type="number" value={quantity} readOnly />
            <button onClick={increaseQuantity}>+</button>
          </div>
          <button onClick={handleAddToCart} className="add-to-basket-button">Add to Basket</button>
          <button className="buy-button">Buy</button>
          <div className="product-description">
            <h2>Description</h2>
            <p>This is a placeholder description for the product "{product.title}".</p>
          </div>
          <div className="product-characteristics">
            <h2>Characteristics</h2>
            <p>Stock: {product.quantity}</p>
            <p>Status: {product.active ? 'Available' : 'Unavailable'}</p>
          </div>
        </div>
      </div>
      <footer className="footer-text">Have a good day!</footer>
    </div>
  );
};

export default ProductPage;
