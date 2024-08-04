import React from "react";
import { Product } from "store/redux/productSlice";

interface ProductCardPageProps {
  product: Product;
}

const ProductCardPage: React.FC<ProductCardPageProps> = ({ product }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div style={{ flexGrow: 1 }}>
            <h5 className="card-title">{product.title}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{product.title}</h6>
            <p className="card-text">{product.price} $</p>
            <button className="btn btn-primary">View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardPage;