import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/store" // Свойство объявлено, но его значение не было прочитано.
import { setIsAddedFalse } from "../../store/redux/openAddProductFormSlice"
import axios from "axios"

interface AddProductFormProps {
  onProductAdded: () => void
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onProductAdded }) => {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const dispatch = useDispatch()
  const { isAdded } = useSelector((state: RootState) => state.addNewProduct)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ title, price, quantity })
    const data = {
      title: title,
      price: +price,
      quantity: +quantity,
      active: true,
    }
    axios
      .post(`/api/products`, data)
      .then(response => {
        console.log("Response", response.data)
        onProductAdded()
      })
      .catch(error => {
        console.log("Error", error)
      })

    setTitle("")
    setPrice("")
    setQuantity("")

    dispatch(setIsAddedFalse()) // связь с AdminInterfaceCatalogProductPage
  }

  const handleCancelButton = () => {
    setTitle("")
    setPrice("")
    setQuantity("")

    dispatch(setIsAddedFalse())
  }

  if (!isAdded) {
    // связь с AdminInterfaceCatalogProductPage
    return null
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add Product Form</h1>
      <div>
        <label>
          Product Name:
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </label>
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />
        </label>
      </div>
      <button type="button" onClick={handleCancelButton}>
        Cancel
      </button>
      <button type="submit">Add Product</button>
    </form>
  )
}

export default AddProductForm
