import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import styles from "./CatalogProductPage.module.css"
import { sortByPriceAsc, sortByPriceDesc } from "../../store/redux/tobaccoSlice"
import { AppDispatch, RootState } from "../../store/store"
import ProductCardPage from "./ProductCardPage"
// import productSlice, { fetchProducts } from "../../store/redux/productSlice"
import { useAppDispatch } from "../../app/hook"

const CatalogProductPage: React.FC = () => {
  // const dispatch: AppDispatch = useDispatch()
  const dispatch = useAppDispatch()
  const tobacco = useSelector((state: RootState) => state.tobacco.items)
  const status = useSelector((state: RootState) => state.tobacco.status)
  const { products } = useSelector((state: RootState) => state.product)

  // const handleSearch = () => {

  // };

  const handleSortAsc = () => {
    dispatch(sortByPriceAsc())
  }

  const handleSortDesc = () => {
    dispatch(sortByPriceDesc())
  }

  // useEffect(() => {dispatch(fetchProducts())}, [])

  return (
    <div className={styles.containerCatalog}>
      {/* <ul>
        {products.map(product => (
          <li key={product.id}> {product.title}</li>
        ))}
      </ul> */}
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
        tobacco.map(item => <ProductCardPage key={item.id} tobacco={item} />)}
      {status === "error" && <>Error!</>}
    </div>
  )
}

export default CatalogProductPage
