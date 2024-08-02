import React from "react";
import { ITobacco } from "store/redux/tobaccoSlice";

interface ITobaccoProps {
  tobacco: ITobacco;
}

const ProductCardPage: React.FC<ITobaccoProps> = ({ tobacco }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div style={{ flexGrow: 1 }}>
            <h5 className="card-title">{tobacco.name}</h5>
            {tobacco.image && (
              <img
                src={tobacco.image}
                alt={tobacco.name}
                className="product-image"
              />
            )}
            <h6 className="card-subtitle mb-2 text-muted">{tobacco.name}</h6>
            <p className="card-text">{tobacco.price} $</p>
            <button className="btn btn-primary">View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardPage;