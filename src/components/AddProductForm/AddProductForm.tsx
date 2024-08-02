import React, { useState } from "react"
import AddProductItem from "./AddProductItem"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "store/store"
import { setIsAddedFalse } from "../../store/redux/addNewProductSlice"

const AddProductForm: React.FC = () => {
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const dispatch = useDispatch()
  const { isAdded } = useSelector(
    (state: RootState) => state.addNewProductSlice,
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Логика добавления продукта
    console.log({ name, price })

    dispatch(setIsAddedFalse()) // связь с AdminInterfaceCatalogProductPage
  }

  if (!isAdded) { // связь с AdminInterfaceCatalogProductPage
    return null
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add Product Form</h1>
      <AddProductItem
        name={name}
        setName={setName}
        price={price}
        setPrice={setPrice}
      />
      <button type="submit">Add Product</button>
    </form>
  )
}

export default AddProductForm
