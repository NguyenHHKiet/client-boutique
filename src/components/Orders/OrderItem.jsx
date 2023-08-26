import React from "react";
import { Link } from "react-router-dom";
import { transformPrice } from "../../utils/transformData";

const OrderItem = ({ item }) => {
    return (
        <tr>
            <td>{item._id}</td>
            <td>{item.user.userId}</td>
            <td>{item.user.name}</td>
            <td>{item.user.phone}</td>
            <td>{item.user.address}</td>
            <td>{transformPrice(item.totalAmount)}</td>
            <td>{item.delivery}</td>
            <td>{item.status}</td>
            <td>
                <Link
                    to={item._id}
                    className="d-flex align-items-center m-0 p-0 fst-italic gap-1 bg-white text-secondary text-decoration-none"
                    style={{ border: "1px solid black" }}>
                    <span className="px-1">View</span>
                    <i className="bi bi-arrow-right text-black"></i>
                </Link>
            </td>
        </tr>
    );
};

export default OrderItem;
