import React, { Fragment, useEffect, useState } from "react";
import { useLoaderData, Link, Await } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CartTable from "./CartTable";
import { transformPrice } from "../../utils/transformData";
import { findCartItem } from "../../store/cart";

const CartList = () => {
    const { cart } = useLoaderData();
    const [data, setData] = useState(cart);
    // switch page on the top of the page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    function handleRemove(id) {
        const { existingCartItem } = findCartItem({ cart: data }, { id: id });
        const newList = data.items.filter((item) => item._id !== id);
        const filteredData = {
            items: newList,
            totalAmount:
                data.totalAmount -
                existingCartItem?.productId?.price * existingCartItem?.quantity,
        };
        setData(filteredData);
    }

    function updatedHandler(id, type) {
        const quantity = type === "ADD_QUANTITY" ? +1 : -1;
        const updatedCartItems = data.items.map((item) =>
            item._id === id
                ? { ...item, quantity: item.quantity + quantity }
                : item
        );
        const totalAmount = updatedCartItems.reduce(
            (accum, item) => accum + item.productId.price * item.quantity,
            0
        );
        const filteredData = {
            items: updatedCartItems,
            totalAmount: totalAmount,
        };
        setData(filteredData);
    }

    return (
        <Await
            resolve={cart}
            errorElement={<p>Error loading package location!</p>}>
            <Fragment>
                <div
                    className="px-5 mb-5 bg-body-secondary w-100 d-flex justify-content-between align-items-center"
                    style={{ height: "25vh" }}>
                    <h2 className="text-uppercase fst-italic">Cart</h2>
                    <p className="text-uppercase fst-italic text-secondary fw-semibold">
                        Cart
                    </p>
                </div>
                <div className="mb-5">
                    <h4 className="text-uppercase fst-italic">shopping cart</h4>
                    <Row className="my-4 fst-italic">
                        <Col md={8} sm={12}>
                            {data?.items?.length > 0 ? (
                                <CartTable
                                    items={data.items}
                                    handleRemove={handleRemove}
                                    updatedHandler={updatedHandler}
                                />
                            ) : (
                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ height: "20vh" }}>
                                    Not Product in Cart
                                </div>
                            )}
                        </Col>
                        <Col md={4} sm={12}>
                            <Form className="bg-body-secondary p-4 rounded-1 mt-sm-2 mt-md-0">
                                <h4 className="text-uppercase my-3">
                                    Cart total
                                </h4>
                                <Form.Group
                                    as={Row}
                                    className="text-uppercase h6 d-flex align-items-center">
                                    <Form.Label column sm="4">
                                        subtotal
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            plaintext
                                            readOnly
                                            defaultValue="0"
                                            value={transformPrice(
                                                data?.totalAmount ?? 0
                                            )}
                                            className="text-end fs-6 text-muted"
                                        />
                                    </Col>
                                </Form.Group>
                                <hr className="my-1" />
                                <Form.Group
                                    as={Row}
                                    className="mb-3 text-uppercase h6 d-flex align-items-center">
                                    <Form.Label column sm="4">
                                        total
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            plaintext
                                            readOnly
                                            defaultValue="0"
                                            value={transformPrice(
                                                data?.totalAmount ?? 0
                                            )}
                                            className="text-end fs-5"
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Control
                                        type="email"
                                        className="rounded-0 p-3"
                                        placeholder="Enter your coupon"
                                    />
                                    <Button
                                        variant="dark"
                                        className="bg-black text-white fst-italic rounded-0 w-100 p-3">
                                        <i className="bi bi-gift-fill me-2"></i>
                                        Apply coupon
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col
                            md={8}
                            sm={12}
                            className="bg-body-secondary d-flex align-items-center justify-content-between p-3">
                            <Link
                                to={"/shop"}
                                className="d-flex m-0 p-0 fst-italic gap-1 text-secondary text-decoration-none">
                                <i className="bi bi-arrow-left text-black"></i>
                                Continue shopping
                            </Link>
                            <Link
                                to={"/checkout"}
                                className="d-flex m-0 p-0 fst-italic gap-1 p-2 bg-white text-secondary text-decoration-none"
                                style={{ border: "1px solid black" }}>
                                Processed to checkout
                                <i className="bi bi-arrow-right text-black"></i>
                            </Link>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        </Await>
    );
};

export default CartList;
