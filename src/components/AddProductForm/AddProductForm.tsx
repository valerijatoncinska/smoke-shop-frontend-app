import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/store" // Свойство объявлено, но его значение не было прочитано.
import { setIsAddedFalse } from "../../store/redux/openAddProductFormSlice"
import axios from "axios"
import "./AddProductForm.module.css"

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

        alert("Failed to add a product!")
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
      <div className="mb-3">
        <label className="form-label">
          Product Name:
          <input
          className="form-control"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </label>
        <label className="form-label">
          Price:
          <input
          className="form-control"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </label>
        <label className="form-label">
          Quantity:
          <input
          className="form-control"
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />
        </label>
      </div>
      <div className="my-3">
        <button className="btn btn-secondary" type="button" onClick={handleCancelButton}>
          Cancel
        </button>
        <button className="btn btn-success mx-4" type="submit">Add Product</button>
      </div>
    </form>
  )
}

export default AddProductForm
