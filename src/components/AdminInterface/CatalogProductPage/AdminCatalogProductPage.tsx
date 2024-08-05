import { useDispatch, useSelector } from "react-redux"
import styles from "../../../components/CatalogProductPage/CatalogProductPage.module.css"
import styles1 from "./AdminCatalogProductPage.module.css"
import {
  fetchProducts,
  Product,
  sortByPriceAsc,
  sortByPriceDesc,
} from "../../../store/redux/productSlice"
import { AppDispatch, RootState } from "../../../store/store"
import ProductCardPage from "./ProductCardPage"
import { setIsAddedTrue } from "../../../store/redux/openAddProductFormSlice"
import AddProductForm from "../../../components/AddProductForm/AddProductForm"
import React, { useEffect, useState } from "react"

const AdminCatalogProductPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const dispatch: AppDispatch = useDispatch()
  const { products } = useSelector((state: RootState) => state.product)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  // const products: Product[] = [{id: 1, title: "Apple", price: 300, isActive: true}, {id: 1, title: "Banana", price: 400, isActive: false}, {id: 1, title: "Apple", price: 500, isActive: true}, {id: 1, title: "Apple", price: 600, isActive: true}, {id: 1, title: "Apple", price: 300, isActive: true}]
  const status = useSelector((state: RootState) => state.user.status)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [])
  useEffect(() => {
    setFilteredProducts(products) // Устанавливаем все продукты как изначально отображаемые
  }, [products])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSearch = () => {
    const results = products.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredProducts(results)

    setSearchQuery("")
  }

  const handleSortAsc = () => {
    dispatch(sortByPriceAsc())
  }

  const handleSortDesc = () => {
    dispatch(sortByPriceDesc())
  }

  const handleAddProductClick = () => {
    dispatch(setIsAddedTrue())
  }

  return (
    <>
      <div className={`z-1 container ${styles1.addProductContainer}`}>
        <AddProductForm />
      </div>

      <div className={`mt-0 ${styles.containerCatalog}`}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInput}>
            <input
              type="text"
              name="name"
              placeholder="Search product by name"
              onChange={handleInputChange}
              value={searchQuery}
            />
            <button onClick={handleSearch}>Search</button>
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

          {/* tobacco
              .filter(item => item.isActive)
              .map(item => <ProductCardPage key={item.id} tobacco={item} />)} */}

          {/* {status === "success" && */}

          <div className="d-flex flex-wrap">
            {filteredProducts.map(product => (
              <ProductCardPage key={product.id} product={product} />
            ))}
          </div>
          {/* } */}

          {status === "error" && <>Error!</>}
        </div>
      </div>
    </>
  )
}

export default AdminCatalogProductPage
