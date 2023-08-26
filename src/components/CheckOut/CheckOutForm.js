import React, { useState, useEffect, useRef } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { transformPrice } from "../../utils/transformData";
import useAxios from "../../hooks/useAxios";
import Spinner from "react-bootstrap/esm/Spinner";
import {
    Await,
    useActionData,
    useLoaderData,
    useNavigation,
    useSubmit,
} from "react-router-dom";
import { useDispatch } from "react-redux";

const CheckOutForm = () => {
    const token = useLoaderData();
    const error = useActionData();
    const dispatch = useDispatch();
    const [validated, setValidated] = useState(false);
    const { sendRequest, response: data, isLoading } = useAxios();
    const enteredName = useRef();
    const enteredAddress = useRef();
    const enteredPhone = useRef();

    let submit = useSubmit();
    const navigation = useNavigation();
    const isSubmitted = navigation.state === "submitting";
    let totalAmount;

    useEffect(() => {
        sendRequest({ url: "/cart" });
    }, [sendRequest]);

    const Item = ({ item }) => {
        const price = transformPrice(item.productId.price);
        return (
            <>
                <div>
                    <h6>{item.productId.name}</h6>
                    <p>
                        {price} X {item.quantity}
                    </p>
                </div>
                <hr className="mb-1" />
            </>
        );
    };

    if (data) {
        totalAmount = transformPrice(data?.totalAmount);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity()) {
            const objData = {
                name: enteredName.current.value,
                phone: enteredPhone.current.value,
                address: enteredAddress.current.value,
            };
            submit(objData, { method: "post" });
            setTimeout(() => {
                dispatch({ type: "SWITCHES" });
            }, 5000);
        }
        setValidated(true);
    };

    if (error?.response?.data) {
        console.log(error.response.data);
        console.log(validated);
    }

    const styleValid = {
        backgroundColor: "#fe5c5c",
        color: "whitesmoke",
        display: "grid",
        placeItems: "center",
        fontWeight: "bold",
        padding: "0.25rem",
    };

    return (
        <Await
            resolve={data}
            errorElement={<p>Error loading package location!</p>}>
            <div className="mb-5">
                <h4 className="text-uppercase fst-italic">billing details</h4>
                <Row className="my-4 fst-italic">
                    <Col md={8} sm={12}>
                        {error?.response?.data && (
                            <div style={styleValid}>
                                {error?.response?.data?.message}
                            </div>
                        )}
                        <Form
                            noValidate
                            validated={validated}
                            onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group>
                                    <Form.Label className="text-uppercase">
                                        Full name:
                                    </Form.Label>
                                    <Form.Control
                                        className="rounded-0 p-2"
                                        required
                                        type="text"
                                        placeholder="Enter Your Full Name Here!"
                                        name="name"
                                        isInvalid={error?.response?.data?.data?.find(
                                            (item) => item.path === "name"
                                        )}
                                        ref={enteredName}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a username.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mt-2">
                                    <Form.Label className="text-uppercase">
                                        Email:
                                    </Form.Label>
                                    <Form.Control
                                        required
                                        name="email"
                                        type="email"
                                        placeholder="Enter Your Email Here!"
                                        className="rounded-0 p-2"
                                        readOnly
                                        value={token.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a email.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mt-2">
                                    <Form.Label className="text-uppercase">
                                        Phone Number:
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phone"
                                        placeholder="Enter Your Phone Number Here!"
                                        required
                                        isInvalid={error?.response?.data?.data?.find(
                                            (item) => item.path === "phone"
                                        )}
                                        className="rounded-0 p-2"
                                        ref={enteredPhone}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a phone(10 to 11).
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mt-2">
                                    <Form.Label className="text-uppercase">
                                        Address:
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        address="address"
                                        placeholder="Enter Your Address Here!"
                                        required
                                        isInvalid={error?.response?.data?.data?.find(
                                            (item) => item.path === "address"
                                        )}
                                        className="rounded-0 p-2"
                                        ref={enteredAddress}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a address.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Button
                                type="submit"
                                className="rounded-0 bg-black px-4 py-2">
                                {isSubmitted ? "Submitting.." : "Place order"}
                            </Button>
                        </Form>
                    </Col>
                    <Col md={4} sm={12}>
                        <Form className="bg-body-secondary p-4 rounded-1 mt-sm-2 mt-md-0">
                            <h4 className="text-uppercase my-3">your order</h4>
                            {isLoading ? (
                                <div className="d-flex justify-content-center align-items-center">
                                    <Spinner animation="border" />
                                </div>
                            ) : (
                                <>
                                    {data?.items.map((item) => (
                                        <Item key={item._id} item={item} />
                                    ))}
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
                                                value={totalAmount}
                                                className="text-end fs-5"
                                            />
                                        </Col>
                                    </Form.Group>
                                </>
                            )}
                        </Form>
                    </Col>
                </Row>
            </div>
        </Await>
    );
};

export default CheckOutForm;
