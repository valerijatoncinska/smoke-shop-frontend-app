import React from 'react';

interface AddProductItemProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  price: number;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
}

const AddProductItem: React.FC<AddProductItemProps> = ({ name, setName, price, setPrice }) => (
  <div>
    <label>
      Product Name:
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
    </label>
    <label>
      Price:
      <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
    </label>
  </div>
);

export default AddProductItem;
