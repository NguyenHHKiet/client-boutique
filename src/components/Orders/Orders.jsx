import React, { useEffect } from "react";
import useAxios from "../../hooks/useAxios";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import OrderTable from "./OrderTable";
import Spinner from "react-bootstrap/Spinner";

const Orders = () => {
    const { response, isLoading, sendRequest, error } = useAxios();

    useEffect(() => {
        sendRequest({ url: "/orders" });
    }, [sendRequest]);

    console.log(response);

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

    if (error) {
        content = (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "50vh" }}>
                Error Internet Access
            </div>
        );
    }
    return (
        <>
            <div
                className="px-5 mb-5 bg-body-secondary w-100 d-flex justify-content-between align-items-center"
                style={{ height: "25vh" }}>
                <h2 className="text-uppercase fst-italic">History</h2>
                <p className="text-uppercase fst-italic text-secondary fw-semibold">
                    History
                </p>
            </div>
            <div>
                {!response && content}
                {response && (
                    <div className="mb-5" style={{ minHeight: "50vh" }}>
                        <Row className="my-4 fst-italic">
                            <Col>
                                {response?.length > 0 ? (
                                    <OrderTable items={response} />
                                ) : (
                                    <div
                                        className="d-flex align-items-center justify-content-center"
                                        style={{ height: "20vh" }}>
                                        Not found Orders in History
                                    </div>
                                )}
                            </Col>
                        </Row>
                    </div>
                )}
            </div>
        </>
    );
};

export default Orders;
