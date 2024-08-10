import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import styles from "./CatalogProductPage.module.css"
import ProductCardPage from "./ProductCardPage"
import { useAppDispatch } from "../../app/hook"
import {
  fetchProducts,
  filterProductsByName,
  resetFilter,
  sortByPriceAsc,
  sortByPriceDesc,
} from "../../store/redux/productSlice"
import { useNavigate } from "react-router-dom"
import { RootState } from "../../store/store"

const CatalogProductPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { status, filteredProducts } = useSelector(
    (state: RootState) => state.products
  )
  const [searchQuery, setSearchQuery] = useState<string>("")
  const navigate = useNavigate()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query === "") {
      dispatch(resetFilter()) // Сброс фильтра при пустом запросе
    } else {
      dispatch(filterProductsByName(query))
    }
  }

  const handleSortAsc = () => {
    dispatch(sortByPriceAsc())
  }

  const handleSortDesc = () => {
    dispatch(sortByPriceDesc())
  }

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleGoHome = () => {
    navigate("/")
  }

  return (
    <div className={styles.containerCatalog}>
      <div className={styles.searchContainer}>
        <div className={styles.searchInput}>
          <input
            type="text"
            name="name"
            placeholder="Search product by name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button onClick={() => dispatch(filterProductsByName(searchQuery))}>
            Search
          </button>
        </div>
        <button
          type="button"
          className={styles.goHomeButton}
          onClick={handleGoHome}
        >
          Go to Home
        </button>
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

      {status === "success" && (
        <div className={styles.cardContainer}>
          {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCardPage key={product.id} product={product} />
            ))
          ) : (
            <p style={{ color: "white", fontSize: "1.5rem", textAlign: 'center' }}>
              No products available
            </p>
          )}
        </div>
      )}

      {status === "error" && <p style={{ color: 'white', fontSize: '1.5rem' }}>Error!</p>}
    </div>
  )
}

export default CatalogProductPage
