import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { Product } from '../../store/redux/productSlice';
import { addProduct } from '../../store/redux/productSlice';

const EditProductPage: React.FC = () => {
    const [title, setTitle] = useState<string>('Product A');
    const [price, setPrice] = useState<number>(30);
    const dispatch: AppDispatch = useDispatch();
    const products: Product[] = useSelector((state: RootState) => state.product.products);

    const handleUpdate = () => {
        // Логика обновления продукта
        console.log({ title, price });
        // Пример использования dispatch для добавления продукта
        dispatch(addProduct({ id: products.length + 1, title, price }));
    };

    return (
        <div>
            <h1>Edit Product Page</h1>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label>Price:</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />
            </div>
            <button onClick={handleUpdate}>Update Product</button>
        </div>
    );
};

export default EditProductPage;