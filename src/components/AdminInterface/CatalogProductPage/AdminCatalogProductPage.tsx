import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import styles from "../../../components/CatalogProductPage/CatalogProductPage.module.css"
import styles1 from "./AdminCatalogProductPage.module.css"
import {
  sortByPriceAsc,
  sortByPriceDesc,
} from "../../../store/redux/tobaccoSlice"
import { RootState } from "../../../store/store"
import ProductCardPage from "./ProductCardPage"
import { setIsAddedTrue } from "../../../store/redux/addNewProductSlice"
import AddProductForm from "../../../components/AddProductForm/AddProductForm"

const AdminCatalogProductPage: React.FC = () => {
  const dispatch = useDispatch()
  const tobacco = useSelector((state: RootState) => state.tobacco.items)
  const status = useSelector((state: RootState) => state.tobacco.status)
  // const handleSearch = () => {

  // };

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
            />
            <button>Search</button>
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
          {status === "success" &&
            tobacco.map(item => (
              <ProductCardPage key={item.id} tobacco={item} />
            ))}
          {status === "error" && <>Error!</>}
        </div>
      </div>
    </>
  )
}

export default AdminCatalogProductPage
