import React, { useEffect } from "react";
import useAxios from "../../../hooks/useAxios";
import Spinner from "react-bootstrap/esm/Spinner";
import Table from "react-bootstrap/Table";
import { transformPrice } from "../../../utils/transformData";
import { useParams } from "react-router-dom";
import classes from "../../Cart/CartTable.module.scss";
import OrderDetailItem from "./OrderDetailItem";

const OrderDetail = () => {
    const { orderId } = useParams();
    const { response, isLoading, sendRequest } = useAxios();

    useEffect(() => {
        sendRequest({ url: "/orders/" + orderId });
    }, [sendRequest, orderId]);

    let content;
    if (isLoading) {
        content = (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "50vh" }}>
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <div style={{ minHeight: "70vh" }}>
            {!response && content}
            {response && (
                <>
                    <div className="py-3 w-100" style={{ minHeight: "25vh" }}>
                        <h2 className="text-uppercase fst-italic mb-3">
                            information order
                        </h2>
                        <Table
                            style={{ maxWidth: "20rem" }}
                            className="fst-italic text-secondary">
                            <tr>
                                <td>ID User: </td>
                                <td>{response.user.userId}</td>
                            </tr>
                            <tr>
                                <td>Full Name: </td>
                                <td>{response.user.name}</td>
                            </tr>
                            <tr>
                                <td>Phone: </td>
                                <td>{response.user.phone}</td>
                            </tr>
                            <tr>
                                <td>Address: </td>
                                <td>{response.user.address}</td>
                            </tr>
                            <tr>
                                <td>Total:</td>
                                <td>{transformPrice(response.totalAmount)}</td>
                            </tr>
                        </Table>
                    </div>
                    <div
                        style={{ overflowX: "auto" }}
                        className="mb-4 fst-italic">
                        <table className={classes.showcase}>
                            <thead className="text-uppercase text-center">
                                <tr className="bg-body-secondary">
                                    <th>id product</th>
                                    <th>image</th>
                                    <th>name</th>
                                    <th>price</th>
                                    <th>count</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {response.products.map((item, index) => (
                                    <OrderDetailItem key={index} item={item} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderDetail;
