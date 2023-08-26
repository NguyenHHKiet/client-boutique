import React from "react";
import Image from "react-bootstrap/Image";
import { transformPrice } from "../../../utils/transformData";

const OrderDetailItem = ({ item }) => {
    return (
        <tr className="fw-bold">
            <td>{item._id}</td>
            <td>
                <Image
                    src={item.product.img1}
                    width={180}
                    height={180}
                    alt={item.name}
                    rounded
                />
            </td>
            <td>{item.product.name}</td>
            <td>{transformPrice(item.product.price)}</td>
            <td>{item.quantity}</td>
        </tr>
    );
};

export default OrderDetailItem;
