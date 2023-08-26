import React, { useState } from "react";
import { transformPrice } from "../../utils/transformData";
import useAxios from "../../hooks/useAxios";

const CartItem = ({ item, handleRemove, updatedHandler }) => {
    const { sendRequest: updatedCart } = useAxios();
    const [enteredAmount, setEnteredAmount] = useState(item.quantity);

    const price = transformPrice(item.productId.price);
    const total = transformPrice(item.productId.price * enteredAmount);

    // delete item from
    const deleteItemCartHandler = () => {
        const formData = new FormData();
        formData.append("productId", item.productId._id);
        formData.append("price", item.productId.price);
        updatedCart({
            method: "post",
            url: "/delete-cart-item",
            body: formData,
        });
        handleRemove(item._id);
    };

    // updated amount of cart items
    const minusHandler = () => {
        if (enteredAmount > 1) {
            setEnteredAmount(enteredAmount - 1);
            const formData = new FormData();
            formData.append("productId", item.productId._id);
            formData.append("quantity", Number(-1));
            updatedCart({ url: "/cart", method: "post", body: formData });
            updatedHandler(item._id, "MINUS_QUANTITY");
        } else {
            deleteItemCartHandler();
            handleRemove(item._id);
        }
    };
    const addHandler = () => {
        setEnteredAmount(enteredAmount + 1);
        const formData = new FormData();
        formData.append("productId", item.productId._id);
        formData.append("quantity", Number(1));
        updatedCart({ url: "/cart", method: "post", body: formData });
        updatedHandler(item._id, "ADD_QUANTITY");
    };

    return (
        <tr key={item.productId._id}>
            <td style={{ maxWidth: "7rem" }}>
                <img src={item.productId.img1} alt="img" className="w-100" />
            </td>
            <td style={{ minWidth: "10rem" }}>
                <h6>{item.productId.name}</h6>
            </td>
            <td>{price}</td>
            <td>
                <div>
                    <i
                        className="bi bi-caret-left-fill"
                        onClick={minusHandler}></i>
                    <input
                        id="id_form-0-quantity"
                        min={0}
                        pattern="[0-9]+"
                        name="form-0-quantity"
                        readOnly
                        value={enteredAmount}
                        type="number"
                    />
                    <i
                        className="bi bi-caret-right-fill"
                        onClick={addHandler}></i>
                </div>
            </td>
            <td>{total}</td>
            <td>
                <i className="bi bi-trash" onClick={deleteItemCartHandler}></i>
            </td>
        </tr>
    );
};
export default CartItem;
