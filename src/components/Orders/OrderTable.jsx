import React from "react";
import classes from "../Cart/CartTable.module.scss";
import OrderItem from "./OrderItem";

const OrderTable = ({ items = [] }) => {
    return (
        <div style={{ overflowX: "auto" }}>
            <table className={classes.showcase}>
                <thead className="text-uppercase text-center">
                    <tr className="bg-body-secondary">
                        <th>id order</th>
                        <th>id user</th>
                        <th>name</th>
                        <th>phone</th>
                        <th>address</th>
                        <th>total</th>
                        <th>delivery</th>
                        <th>status</th>
                        <th>detail</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {items.map((item, index) => (
                        <OrderItem key={index} item={item} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;
