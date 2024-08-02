import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductPage.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  characteristics: string;
  thumbnailUrls: string[];
}

interface User {
  phoneNumber: string;
  email: string;
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`https://smoke-shop-68y5q.ondigitalocean.app/api/products/${id}`).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }),
      fetch(`https://smoke-shop-68y5q.ondigitalocean.app/api/user`).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
    ])
    .then(([productData, userData]) => {
      setProduct(productData);
      setMainImage(productData.imageUrl);
      setUser(userData);
      setLoading(false);
    })
    .catch(error => {
      setError(error.message);
      setLoading(false);
    });
  }, [id]);

  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleThumbnailClick = (imageUrl: string) => {
    setMainImage(imageUrl);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-page">
      <div className="navigation">
        <span>number: {user?.phoneNumber}</span>
        <span>email: {user?.email}</span>
      </div>
      <h1 className="title">Tobacco</h1>
      <div className="nav-links">
        <a href="/home">Home</a>
        <a href="/catalog">Catalog</a>
        <input type="text" placeholder="Product search" />
        <button>Search</button>
      </div>
      <div className="product-details">
        <div className="product-images">
          <img src={mainImage || product.imageUrl} alt={product.name} className="main-image" />
          <div className="thumbnail-images">
            {product.thumbnailUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Thumbnail ${index + 1}`}
                className="thumbnail-image"
                onClick={() => handleThumbnailClick(url)}
              />
            ))}
          </div>
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>Price: {product.price}€</p>
          <div className="quantity-control">
            <button onClick={decreaseQuantity}>-</button>
            <span>{quantity}</span>
            <button onClick={increaseQuantity}>+</button>
          </div>
          <button className="add-to-basket">Add to Basket</button>
          <button className="buy-now">Buy</button>
          <div className="description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          <div className="characteristics">
            <h3>Characteristics</h3>
            <p>{product.characteristics}</p>
          </div>
        </div>
      </div>
      <footer>
        <p>Have a good day!</p>
      </footer>
    </div>
  );
};

export default ProductPage;
