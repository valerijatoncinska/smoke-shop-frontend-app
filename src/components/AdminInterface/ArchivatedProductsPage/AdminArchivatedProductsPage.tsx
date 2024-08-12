import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import styles from "../../../components/CatalogProductPage/CatalogProductPage.module.css"
import styles1 from "./AdminArchivatedProductsPage.module.css"
import {
  sortByPriceAsc,
  sortByPriceDesc,
} from "../../../store/redux/tobaccoSlice"
import { AppDispatch, RootState } from "../../../store/store"
import ProductCardPage from "../CatalogProductPage/ProductCardPage"
import { setIsAddedTrue } from "../../../store/redux/openAddProductFormSlice"
import AddProductForm from "../../../components/AddProductForm/AddProductForm"
import { fetchProducts, Product } from "../../../store/redux/productSlice"

const AdminArchivatedProductsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const products = useSelector((state: RootState) => state.products.products)
  // const products: Product[] = [
  //   { id: 1, title: "Apple", price: 300, active: true },
  //   { id: 1, title: "Banana", price: 300, active: false },
  //   { id: 1, title: "Apple", price: 300, active: true },
  //   { id: 1, title: "Apple", price: 300, active: true },
  //   { id: 1, title: "Apple", price: 300, active: true },
  //   { id: 1, title: "Apple", price: 300, active: false },
  // ]
  const status = useSelector((state: RootState) => state.products.status)

  useEffect(() => {dispatch(fetchProducts())}, [])

  return (
    <>
      <div className={`mt-0 ${styles.containerCatalog} w-100`}>
        <div className={`${styles1.catalogContainer} text-center`}>
          <h3 className={` ${styles1.catalogTitle}`}>Archived Products</h3>
          <div className={styles.separator}></div>
          {status === "loading" && (
            <div className="text-center">
              <div className="spinner-border text-white" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <div className="d-flex flex-wrap">
            {products
              .filter(product => !product.active)
              .map(product => (
                <ProductCardPage key={product.id} product={product} />
              ))}
          </div>
          {status === "error" && <>Error!</>}
        </div>
      </div>
    </>
  )
}

export default AdminArchivatedProductsPage
