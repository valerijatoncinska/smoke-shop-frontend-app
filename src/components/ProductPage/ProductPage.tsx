import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductPage.css';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

const ProductPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = await response.json();
        setProduct(data);
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
          productId: product?.id,
          quantity: 1,
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
      <h1>Product Details</h1>
      <div className="product-sections">
        <div className="product-section">
          <h2>Details</h2>
          <div className="product-detail">
            <strong>Name:</strong> <span>{product.title}</span>
          </div>
          <div className="product-detail">
            <strong>Description:</strong> <span>{product.description}</span>
          </div>
          <div className="product-detail">
            <strong>Price:</strong> <span>${product.price.toFixed(2)}</span>
          </div>
          <div className="product-detail">
            <strong>Category:</strong> <span>{product.category}</span>
          </div>
          <div className="product-detail">
            <strong>Stock:</strong> <span>{product.stock}</span>
          </div>
        </div>
        <div className="product-actions">
          {isLoggedIn ? (
            <button onClick={handleAddToCart} className="add-to-cart-button">
              Add to Cart
            </button>
          ) : (
            <p>You must be logged in to add items to the cart.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
