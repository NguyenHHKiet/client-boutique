import React from "react";
import CartItem from "./CartItem";
import classes from "./CartTable.module.scss";

const CartTable = ({ items, handleRemove, updatedHandler }) => {
    return (
        <div style={{ overflowX: "auto" }}>
            <table className={classes.showcase}>
                <thead className="text-uppercase text-center">
                    <tr className="bg-body-secondary">
                        <th>image</th>
                        <th>product</th>
                        <th>price</th>
                        <th>quantity</th>
                        <th>total</th>
                        <th>remove</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {items.map((item, index) => (
                        <CartItem
                            key={index}
                            item={item}
                            handleRemove={handleRemove}
                            updatedHandler={updatedHandler}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CartTable;
