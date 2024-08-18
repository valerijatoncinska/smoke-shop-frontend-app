import { FC, useEffect, useState } from "react"
import "./ProductDetails.css"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "store/store"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { fetchProducts } from "../../../store/redux/productSlice"

const ProductDetails: FC = () => {
  const dispatch: AppDispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchProducts())
  }, [])
  const adminProductsFetch = useSelector(
    (state: RootState) => state.products.products,
  )
  // const adminProducts: Product[] = [
  //   {
  //     id: 1,
  //     title: "Parlament",
  //     price: 300,
  //     active: true,
  //     description:
  //       "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
  //     characteristics:
  //       "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
  //     quantity: 300,
  //   },
  //   {
  //     id: 2,
  //     title: "Marlboro Blue",
  //     price: 400,
  //     active: true,
  //     description:
  //       "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
  //     characteristics:
  //       "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
  //     quantity: 300,
  //   },
  //   {
  //     id: 3,
  //     title: "Marlboro Red",
  //     price: 500,
  //     active: true,
  //     description:
  //       "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
  //     characteristics:
  //       "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
  //     quantity: 300,
  //   },
  //   {
  //     id: 4,
  //     title: "L&M Blue",
  //     price: 600,
  //     active: true,
  //     description:
  //       "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
  //     characteristics:
  //       "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
  //     quantity: 300,
  //   },
  //   {
  //     id: 5,
  //     title: "Parlament Aqua",
  //     price: 300,
  //     active: true,
  //     description:
  //       "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
  //     characteristics:
  //       "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
  //     quantity: 300,
  //   },
  // ]

  const { id } = useParams() as { id: string }
  const navigate = useNavigate()
  const adminProducts = adminProductsFetch.filter(product => product.id === +id)
  const [initialProduct, setInitialProduct] = useState(adminProducts[0])
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [productTitle, setProductTitle] = useState<string>(
    adminProducts[0].title,
  )
  const [productPrice, setProductPrice] = useState<number>(
    adminProducts[0].price,
  )
  const [productQuantity, setProductQuantity] = useState<number | undefined>(
    adminProducts[0].quantity,
  )
  const [productDescription, setProductDescription] = useState<
    string | undefined
  >(adminProducts[0].description)
  const [productCharacteristics, setProductCharacteristics] = useState<
    string | undefined
  >(adminProducts[0].characteristics)
  const [productActive, setProductActive] = useState<boolean | undefined>(
    adminProducts[0].active,
  )



  const handleArchiveProduct = () => {
    const data = {
      // id: +id,
      title: productTitle,
      price: productPrice,
      quantity: productQuantity,
      active: false,
      description: productDescription,
      characteristics: productCharacteristics,
    }
  
    axios
      .put(`/api/products/${id}`, data)
      .then(response => {
        console.log("Response", response.data)
        navigate("/admin/catalog")
        setProductActive(false)
      })
      .catch(error => {
      })
  }

  const handleSaveProduct = () => {
    const data = {
      // id: +id,
      title: productTitle,
      price: productPrice,
      quantity: productQuantity,
      active: productActive,
      description: productDescription,
      characteristics: productCharacteristics,
    }

    console.log(data);
    

    axios
      .put(`/api/products/${id}`, data)
      .then(response => {
        console.log("Response", response.data)
        setInitialProduct({
          ...initialProduct,
          title: productTitle,
          price: productPrice,
          quantity: productQuantity,
          description: productDescription,
          characteristics: productCharacteristics
        })
      })
      .catch(error => {
        console.log("Error", error)
      })

    setIsEdit(false)
  }

  const handleCancelButton = () => {
    setProductTitle(initialProduct.title)
    setProductPrice(initialProduct.price)
    setProductQuantity(initialProduct.quantity)
    setProductDescription(initialProduct.description)
    setProductCharacteristics(initialProduct.characteristics)

    setIsEdit(false)
  }

  const handleAddProductToCatalog = () => {
    const data = {
      title: productTitle,
      price: productPrice,
      quantity: productQuantity,
      active: true,
      description: productDescription,
      characteristics: productCharacteristics,
    }

    axios
      .put(`/api/products/${id}`, data)
      .then(response => {
        console.log("Response", response.data)
        navigate("/admin/archivated-products")
        setProductActive(true)
      })
      .catch(error => {
        console.log("Error", error)
      })
  }

  const handleDeleteProduct = () => {
    axios
      .delete(`/api/products/${id}`)
      .then(response => {
        console.log("Response", response.data)
        !productActive
          ? navigate("/admin/archivated-products")
          : navigate("/admin/catalog")
      })
      .catch(error => {
        console.log("Error", error)
      })
  }

  return (
    <div>
      {isEdit ? (
        <div className="tableContainer">
          <div className="d-flex">
            <div className="leftColumn">
              <div className="squareOne">{adminProducts[0].image}</div>
              <div className="squareTwo"></div>
            </div>
            <div className="rightColumn ms-5">
              <div className="squareThree">
                <input
                  className="titleInput"
                  value={productTitle}
                  onChange={e => setProductTitle(e.target.value)}
                />
                <div className="ps-5 py-3 d-flex">
                  <h6 className="me-5 mt-2">Price of product:</h6>
                  <input
                    className="priceInput"
                    type="number"
                    value={productPrice}
                    min="0"
                    onChange={e => setProductPrice(parseFloat(e.target.value))}
                  />
                  <span className="input-group-text">€</span>
                </div>
                <div className="ps-5 pt-1 d-flex">
                  <h6 className="me-5">Quantity of product:</h6>
                  <input
                    className="quantityInput"
                    value={productQuantity}
                    onChange={e => setProductQuantity(+e.target.value)}
                  />
                </div>
              </div>
              <div className="squareFour p-3 ps-5">
                <h5>Description</h5>
                <textarea
                  className="descriptionInput"
                  value={productDescription}
                  onChange={e => setProductDescription(e.target.value)}
                />
              </div>
              <div className="squareFive p-3 ps-5">
                <h5>Characteristics</h5>
                <textarea
                  className="characteristicsInput"
                  value={productCharacteristics}
                  onChange={e => setProductCharacteristics(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="serviceButtons">
            <button
              className="cardButtonArchive me-5 p-3 px-5"
              onClick={handleCancelButton}
            >
              Cancel
            </button>
            <button
              className="cardButtonEdit ms-5 p-3 px-5"
              onClick={handleSaveProduct}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="tableContainer">
          <div className="d-flex">
            <div className="leftColumn">
              <div className="squareOne">{adminProducts[0].image}</div>
              <div className="squareTwo"></div>
            </div>
            <div className="rightColumn ms-5">
              <div className="squareThree">
                <h2 className="py-3 ps-5">{productTitle}</h2>
                <div className="ps-5 py-3 d-flex">
                  <h6 className="me-5">Price of product:</h6>
                  <h6 className="ms-5"> {productPrice} €</h6>
                </div>
                <div className="ps-5 pt-1 d-flex">
                  <h6 className="me-5">Quantity of product:</h6>
                  <h6 className="quantity">{productQuantity}</h6>
                </div>
              </div>
              <div className="squareFour p-3 ps-5">
                <h5>Description</h5>
                <h6>{productDescription}</h6>
              </div>
              <div className="squareFive p-3 ps-5">
                <h5>Characteristics</h5>
                <h6>{productCharacteristics}</h6>
              </div>
            </div>
          </div>
          {productActive ? (
            <div className="serviceButtons">
              <button
                className="cardButtonArchive me-5 p-3 px-5"
                onClick={handleArchiveProduct}
              >
                Add Product to archive
              </button>
              <button
                className="cardButtonDelete"
                onClick={handleDeleteProduct}
              >
                Delete Product
              </button>
              <button
                className="cardButtonEdit ms-5 p-3 px-5"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="serviceButtons">
              <button
                className="addButton me-5 p-3 px-5"
                onClick={handleAddProductToCatalog}
              >
                Add Product to catalog
              </button>
              <button
                className="cardButtonDelete"
                onClick={handleDeleteProduct}
              >
                Delete Product
              </button>
              <button
                className="cardButtonEdit ms-5 p-3 px-5"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  )
}

export default ProductDetails
