import React from "react"
import { NavLink } from "react-router-dom"
import { addProduct, Product } from "../../../store/redux/productSlice"
import "./ProductCardPage.css"
import { useAppDispatch } from "../../../app/hook"
import { useSelector } from "react-redux"
import { RootState } from "store/store"

interface ProductCardPageProps {
  product: Product
}

const ProductCardPage: React.FC<ProductCardPageProps> = ({ product }) => {

  const { products } = useSelector((state: RootState) => state.product)
  const dispatch = useAppDispatch();
  const productToAdd = products.filter(item => item.id === product.id);

  return (
    // <div className="card mb-3">
    //   <div className="card-body">
    //     <div className="d-flex align-items-center">
    //       <div style={{ flexGrow: 1 }}>
    //         <h5 className="card-title">{product.title}</h5> // product image
    //         <h6 className="card-subtitle mb-2 text-muted">{product.title}</h6>
    //         <p className="card-text">{product.price} $</p>
    //         <NavLink to={`/admin/product/${product.id}`}>
    //           <button className="btn btn-primary">View Details</button>
    //         </NavLink>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <>
      {!product.isActive ? (
        <div className="productCard">
          <img src="..." className="card-img-top" alt="..." />
          <div className="card-body text-center">
            <h2 className="card-title">{product.title}</h2>
            <h3 className="card-title my-2">{product.price}</h3>
            <NavLink to={`/admin/product/${product.id}`}>
              <button className="btn btn-primary">View Details</button>
            </NavLink>
            <button className="addButton" onClick={() => dispatch(addProduct(productToAdd[0]))}>Add to catalog</button>
          </div>
        </div>
      ) : (
        <div className="productCard">
          <img src="..." className="card-img-top" alt="..." />
          <div className="card-body text-center">
            <h2 className="card-title">{product.title}</h2>
            <h3 className="card-title my-2">{product.price}</h3>
            <NavLink to={`/admin/product/${product.id}`}>
              <button className="btn btn-primary p-3">View Details</button>
            </NavLink>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductCardPage
