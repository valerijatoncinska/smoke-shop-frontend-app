import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductPage.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

const ProductPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { productId } = useParams<{ productId: string }>();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://smoke-shop-68y5q.ondigitalocean.app/api/products/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

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
  }, [productId, token]);

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
          <label>
            Name:
            <input type="text" value={product.name} readOnly />
          </label>
          <label>
            Description:
            <input type="text" value={product.description} readOnly />
          </label>
          <label>
            Price:
            <input type="number" value={product.price} readOnly />
          </label>
          <label>
            Category:
            <input type="text" value={product.category} readOnly />
          </label>
          <label>
            Stock:
            <input type="number" value={product.stock} readOnly />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
