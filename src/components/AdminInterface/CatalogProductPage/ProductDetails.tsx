import React, { FC, useState } from "react"
import "./ProductDetails.css"
import { useSelector } from "react-redux"
import { RootState } from "store/store"
import { useParams } from "react-router-dom"
import { IProduct } from "store/redux/adminProductSlice"

const ProductDetails: FC = () => {
  // const {adminProducts} = useSelector((state: RootState) => state.adminProducts);
  const adminProducts: IProduct[] = [
    {
      id: 1,
      title: "Parlament",
      price: 300,
      active: true,
      description:
        "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
      characteristics:
        "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
      quantity: 300,
    },
    {
      id: 2,
      title: "Marlboro Blue",
      price: 400,
      active: true,
      description:
        "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
      characteristics:
        "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
      quantity: 300,
    },
    {
      id: 3,
      title: "Marlboro Red",
      price: 500,
      active: true,
      description:
        "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
      characteristics:
        "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
      quantity: 300,
    },
    {
      id: 4,
      title: "L&M Blue",
      price: 600,
      active: true,
      description:
        "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
      characteristics:
        "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
      quantity: 300,
    },
    {
      id: 5,
      title: "Parlament Aqua",
      price: 300,
      active: true,
      description:
        "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
      characteristics:
        "TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT",
      quantity: 300,
    },
  ]
  const { id } = useParams() as { id: string }
  const [isEdit, setIsEdit] = useState<boolean>(true)
  const [productTitle, setProductTitle] = useState<string>(
    adminProducts[+id - 1].title,
  )
  const [productPrice, setProductPrice] = useState<number>(
    adminProducts[+id - 1].price,
  )
  const [productQuantity, setProductQuantity] = useState<number | undefined>(
    adminProducts[+id - 1].quantity,
  )
  const [productDescription, setProductDescription] = useState<
    string | undefined
  >(adminProducts[+id - 1].description)
  const [productCharacteristics, setProductCharacteristics] = useState<
    string | undefined
  >(adminProducts[+id - 1].characteristics)

  const handleArchiveProduct = () => {}

  const handleEditProduct = () => {}

  const handleSaveProduct = () => {}

  return (
    <div>
      {isEdit ? (
        <div className="tableContainer">
          <div className="d-flex">
            <div className="leftColumn">
              <div className="squareOne">{adminProducts[+id - 1].image}</div>
              <div className="squareTwo"></div>
            </div>
            <div className="rightColumn ms-5">
              <div className="squareThree">
                <input
                  className="py-3 ps-5"
                  value={productTitle}
                  onChange={e => setProductTitle(e.target.value)}
                />
                <div className="ps-5 py-3 d-flex">
                  <h6 className="me-5">Price of product:</h6>
                  <input
                    className="ms-5"
                    value={productPrice}
                    onChange={e => setProductPrice(+e.target.value)}
                  />
                  €
                </div>
                <div className="ps-5 pt-1 d-flex">
                  <h6 className="me-5">Quantity of product:</h6>
                  <input
                    className="quantity"
                    value={productQuantity}
                    onChange={e => setProductQuantity(+e.target.value)}
                  />
                </div>
              </div>
              <div className="squareFour p-3 ps-5">
                <h5>Description</h5>
                <input
                className="descriptionInput"
                  value={productDescription}
                  onChange={e => setProductDescription(e.target.value)}
                />
              </div>
              <div className="squareFive p-3 ps-5">
                <h5>Characteristics</h5>
                <input
                className="characteristicsInput"
                  value={productCharacteristics}
                  onChange={e => setProductCharacteristics(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="serviceButtons">
            <button className="cardButtonArchive me-5 p-3 px-5">Cancel</button>
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
              <div className="squareOne">{adminProducts[+id - 1].image}</div>
              <div className="squareTwo"></div>
            </div>
            <div className="rightColumn ms-5">
              <div className="squareThree">
                <h2 className="py-3 ps-5">{adminProducts[+id - 1].title}</h2>
                <div className="ps-5 py-3 d-flex">
                  <h6 className="me-5">Price of product:</h6>
                  <h6 className="ms-5"> {adminProducts[+id - 1].price} €</h6>
                </div>
                <div className="ps-5 pt-1 d-flex">
                  <h6 className="me-5">Quantity of product:</h6>
                  <h6 className="quantity">
                    {adminProducts[+id - 1].quantity}
                  </h6>
                </div>
              </div>
              <div className="squareFour p-3 ps-5">
                <h5>Description</h5>
                <h6>{adminProducts[+id - 1].description}</h6>
              </div>
              <div className="squareFive p-3 ps-5">
                <h5>Characteristics</h5>
                <h6>{adminProducts[+id - 1].characteristics}</h6>
              </div>
            </div>
          </div>
          <div className="serviceButtons">
            <button
              className="cardButtonArchive me-5 p-3 px-5"
              onClick={handleArchiveProduct}
            >
              Add Product to archive
            </button>
            <button className="cardButtonDelete">Delete Product</button>
            <button
              className="cardButtonEdit ms-5 p-3 px-5"
              onClick={handleEditProduct}
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetails
