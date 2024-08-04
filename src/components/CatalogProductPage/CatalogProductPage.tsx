import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import styles from "./CatalogProductPage.module.css"
import { RootState } from "../../store/store"
import ProductCardPage from "./ProductCardPage"
import { useAppDispatch } from "../../app/hook"
import { fetchProducts, sortByPriceAsc, sortByPriceDesc } from "../../store/redux/productSlice"

const CatalogProductPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const status = useSelector((state: RootState) => state.user.status)
  const { products } = useSelector((state: RootState) => state.product)

  // const handleSearch = () => {

  // };

  const handleSortAsc = () => {
    dispatch(sortByPriceAsc())
  }

  const handleSortDesc = () => {
    dispatch(sortByPriceDesc())
  }

  useEffect(() => {dispatch(fetchProducts())}, [])

  return (
    <div className={styles.containerCatalog}>
      <div className={styles.searchContainer}>
        <div className={styles.searchInput}>
          <input type="text" name="name" placeholder="Search product by name" />
          <button>Search</button>
        </div>
      </div>
      <div className={styles.sortButtons}>
        <button onClick={handleSortAsc}>Sort by Price Ascending</button>
        <button onClick={handleSortDesc}>Sort by Price Descending</button>
      </div>
      <h3 className={styles.catalogTitle}>Product Catalog</h3>
      <div className={styles.separator}></div>

      {status === "loading" && (
        <div className="text-center">
          <div className="spinner-border text-white" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {status === "success" &&
        products.map(product => <ProductCardPage key={product.id} product={product} />)}

      {status === "error" && <>Error!</>}
      
    </div>
  )
}

export default CatalogProductPage
