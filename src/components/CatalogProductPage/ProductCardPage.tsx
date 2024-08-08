import React from "react";
import { Product } from "store/redux/productSlice";
import styles from './ProductCardPage.module.css';
import { useNavigate } from "react-router-dom";

interface ProductCardPageProps {
  product: Product;
}

const ProductCardPage: React.FC<ProductCardPageProps> = ({ product }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
      navigate(`/products/${product.id}`);
    }

  return (
    <div className={styles.card}>
      <div className={styles.cardBody}>
        <h5 className={styles.cardTitle}>{product.title}</h5>
        <p className={styles.cardText}>{product.price} $</p>
      </div>
      <div className={styles.cardButton}>
        <button 
        className={styles.cardButtonText}
        onClick={handleViewDetails}
        >View Details</button>
      </div>
    </div>
  );
};

export default ProductCardPage;