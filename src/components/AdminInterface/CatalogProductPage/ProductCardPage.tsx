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
  const { products } = useSelector((state: RootState) => state.products)
  const dispatch = useAppDispatch()
  const productToAdd = products.filter(item => item.id === product.id)

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
      {/*     <div className={styles.card}>
      <div className={styles.cardBody}>
        <h5 className={styles.cardTitle}>{product.title}</h5>
        <p className={styles.cardText}>{product.price} $</p>
      </div>
      <div className={styles.cardButton}>
        <button className={styles.cardButtonText}>View Details</button>
      </div>
      <button
              className="addButton"
              onClick={() => dispatch(addProduct(productToAdd[0]))}
            >
              Add to catalog
            </button>
    </div> */}
      {!product.active ? (
        <div className="archivedCard mx-5">
          <img src="..." className="card-img-top" alt="..." />
          <div className="cardBody">
            <h5 className="cardTitle">{product.title}</h5>
            <p className="cardText">{product.price} €</p>
          </div>
          <div className="cardButton">
            <NavLink to={`/admin/product/${product.id}`}>
              <button className="cardButtonText">View Details</button>
            </NavLink>
            <button
              className="addButton"
              onClick={() => dispatch(addProduct(productToAdd[0]))}
            >
              Add to catalog
            </button>
          </div>
        </div>
      ) : (
        <div className="card mx-5">
          <img src="..." className="card-img-top" alt="..." />
          <div className="cardBody">
            <h5 className="cardTitle">{product.title}</h5>
            <p className="cardText">{product.price} €</p>
          </div>
          <div className="cardButton">
            <NavLink to={`/admin/product/${product.id}`}>
              <button className="cardButtonText">View Details</button>
            </NavLink>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductCardPage
