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
  const [products, setProduct] = useState<Product | null>(null);
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
        setProduct(data.data); 
        setQuantity(1); 
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

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      alert('You must be logged in to add items to the cart.');
      return;
    }

    try {
      const response = await fetch(`/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          productId: products?.id,
          quantity: quantity, 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }

      alert('Product added to cart successfully!');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const increaseQuantity = () => {
    if (products && quantity < products.quantity) {
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

  if (!products) {
    return <div>No product data available</div>;
  }

  return (
    <div className="product-page">
      <a href="/" className="back-link">Come back</a>
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
          <h1>{products.title}</h1>
          <div className="product-price">Price: {products.price}€</div>
          <div className="product-quantity">
            <button onClick={decreaseQuantity}>-</button>
            <input type="number" value={quantity} readOnly />
            <button onClick={increaseQuantity}>+</button>
          </div>
          <button onClick={handleAddToCart} className="add-to-basket-button">Add to Basket</button>
          <button className="buy-button">Buy</button>
          <div className="product-description">
            <h2>Description</h2>
            <p>This is a placeholder description for the product "{products.title}".</p>
          </div>
          <div className="product-characteristics">
            <h2>Characteristics</h2>
            <p>Stock: {products.quantity}</p>
            <p>Status: {products.active ? 'Available' : 'Unavailable'}</p>
          </div>
        </div>
      </div>
      <footer className="footer-text">Have a good day!</footer>
    </div>
  );
};

export default ProductPage;
