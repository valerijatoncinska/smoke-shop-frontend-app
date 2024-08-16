import { useDispatch, useSelector } from "react-redux"
import styles from "../../../components/CatalogProductPage/CatalogProductPage.module.css"
import styles1 from "./AdminCatalogProductPage.module.css"
import { AppDispatch, RootState } from "../../../store/store"
import ProductCardPage from "./ProductCardPage"
import { setIsAddedTrue } from "../../../store/redux/openAddProductFormSlice"
import AddProductForm from "../../../components/AddProductForm/AddProductForm"
import React, { useEffect, useState } from "react"
import { fetchProducts, Product } from "../../../store/redux/productSlice"

const AdminCatalogProductPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const dispatch: AppDispatch = useDispatch()
  const { products, status } = useSelector((state: RootState) => state.products)


  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  useEffect(() => {
    dispatch(fetchProducts())
  }, [])

  useEffect(() => {
    setFilteredProducts(products) // Устанавливаем все продукты как изначально отображаемые
  }, [products])

  useEffect(() => {
    window.scrollTo(0, 0)
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSearchProducts = () => {
    const results = products.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredProducts(results)

    setSearchQuery("")
  }

  const handleSortAsc = () => {
    const results = [...filteredProducts].sort((a, b) => a.price - b.price)
    setFilteredProducts(results)
  }

  const handleSortDesc = () => {
    const results = [...filteredProducts].sort((a, b) => b.price - a.price)
    setFilteredProducts(results)
  }

  const handleAddProductClick = () => {
    dispatch(setIsAddedTrue())
  }

  const handleProductAdded = () => {
    dispatch(fetchProducts())
  }

  return (
    <>
      <div className={`z-1 container ${styles1.addProductContainer}`}>
        <AddProductForm onProductAdded={handleProductAdded} />
      </div>



      <div className={`mt-0 ${styles.containerCatalog} w-100`}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInput}>
            <input
              type="text"
              name="name"
              placeholder="Search product by name"
              onChange={handleInputChange}
              value={searchQuery}
            />
            <button onClick={handleSearchProducts}>Search</button>
          </div>
        </div>
        <div className={styles.sortButtons}>
          <button onClick={handleSortAsc}>Sort by Price Ascending</button>
          <button onClick={handleSortDesc}>Sort by Price Descending</button>
        </div>
        <div className={styles1.addButton}>
          <button onClick={handleAddProductClick}>
            Add product to catalog
          </button>
        </div>

        <div className={styles1.catalogContainer}>
          <h3 className={` ${styles.catalogTitle}`}>Product Catalog</h3>
          <div className={styles.separator}></div>

          {status === "loading" && (
            <div className="text-center">
              <div className="spinner-border text-white" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="d-flex flex-wrap">
              {filteredProducts
                .filter(product => product.active)
                .map(product => (
                  <ProductCardPage key={product.id} product={product} />
                ))}
            </div>
          )}

          {status === "error" && <>Error!</>}
        </div>
      </div>

    </>
  )
}

export default AdminCatalogProductPage
