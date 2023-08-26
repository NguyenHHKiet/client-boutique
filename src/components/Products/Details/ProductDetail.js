import React, { Fragment, useContext, useEffect, useState } from "react";
import { Await, useLoaderData, useNavigate, useParams } from "react-router-dom";
import RelatedContext from "../../../context/related-product";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from "react-toastify";
import ProductItem from "../../ListOfProducts/ProductItem";
import { transformObject, transformPrice } from "../../../utils/transformData";

import classes from "./ProductDetail.module.scss";
import { getAuthToken } from "../../../utils/auth";
import useAxios from "../../../hooks/useAxios";

const Description = ({ orderList, related }) => (
    <div className={classes.description}>
        <button className="bg-black text-white py-2 px-4 mt-2 fst-italic text-uppercase">
            description
        </button>
        <div>
            <h1 className="text-uppercase fs-5 py-4">product description</h1>
            <h6 className="text-uppercase fs-6 opacity-75">đặc điểm nổi bật</h6>
            <ul className="opacity-75">
                {orderList.map((item, index) =>
                    item.trim() ? (
                        <li
                            key={index}
                            className="py-1"
                            style={{ listStyle: "disc" }}>
                            {item}
                        </li>
                    ) : (
                        <Fragment key={index}></Fragment>
                    )
                )}
            </ul>
            <h1 className="text-uppercase fs-5 py-4">Related Product</h1>
            <Row>
                {related.map((product) => (
                    <ProductItem
                        key={product._id}
                        product={product}
                        isLink={true}
                    />
                ))}
            </Row>
        </div>
    </div>
);

const ProductDetail = () => {
    const { data } = useLoaderData();
    const { productId } = useParams();
    const navigate = useNavigate();
    const { sendRequest: addToCart } = useAxios();

    const [clickImage, setClickImage] = useState();
    const [enteredAmount, setEnteredAmount] = useState(1);

    const relatedCxt = useContext(RelatedContext);

    let content;
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [productId]);

    // Not Founded Product Id.
    if (!data)
        return (
            <h1
                style={{ height: "70vh" }}
                className="d-flex align-items-center justify-content-center">
                Not Founded Product Id.
            </h1>
        );

    // transform type if data available
    const detail = transformObject(data).info;
    const isChecked = getAuthToken();
    // save to local storage
    const addToCartHandler = () => {
        if (isChecked) {
            const formData = new FormData();
            formData.append("productId", productId);
            formData.append("quantity", Number(enteredAmount));
            addToCart({ url: "/cart", method: "post", body: formData }).then(
                () => toast("Add to Cart Success!!")
            );
        } else {
            return navigate("/login");
        }
    };

    // button counter
    const minusHandler = (e) => {
        e.preventDefault();
        if (enteredAmount > 1) {
            setEnteredAmount(enteredAmount - 1);
        } else {
            return;
        }
    };
    const addHandler = (e) => {
        e.preventDefault();
        setEnteredAmount(enteredAmount + 1);
    };

    const checkCountProduct = () => {
        return +data.count === 0 || data.count < enteredAmount;
    };

    const styleDisabled = () => {
        if (checkCountProduct()) {
            return { background: "red" };
        } else {
            return { background: "black" };
        }
    };

    if (detail) {
        const orderList = detail.long_desc.split("•");
        const price = transformPrice(detail.price);
        // rendering the order
        content = (
            <Fragment>
                <ToastContainer autoClose={2000} />
                <div className={`${classes.showcase} gap-4 py-4`}>
                    <div
                        className={`d-flex flex-wrap flex-row flex-md-column gap-2`}>
                        {detail.img.map((item, index) => (
                            <div key={index} className={classes.wrapper}>
                                <img
                                    src={item}
                                    onClick={() => setClickImage(item)}
                                    alt="img"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="">
                        <img src={clickImage ?? detail.img} alt="img" />
                    </div>
                    <div className="pb-4 fst-italic position-relative d-flex flex-column justify-content-between">
                        <div>
                            <h1 className="fs-2">{detail.name}</h1>
                            <p className="py-3 fs-4">{price}</p>
                            <p>{detail.short_desc}</p>
                        </div>
                        <form>
                            <p className="text-uppercase text-black">
                                category:
                                <span className="ps-2 text-lowercase text-secondary">
                                    {detail.category}
                                </span>
                            </p>
                            {+data.count === 0 && (
                                <p
                                    className="text-white w-100 text-center py-1"
                                    style={{ background: "red" }}>
                                    Số lượng sản phẩm trong kho đã hết.
                                </p>
                            )}
                            <InputGroup
                                className={classes.quantity}
                                hasValidation>
                                <Form.Control
                                    placeholder="QUANTITY"
                                    aria-label="QUANTITY"
                                    className="rounded-0 fst-italic opacity-75"
                                    type="number"
                                    min={0}
                                    onChange={(e) => {
                                        setEnteredAmount(e.target.value);
                                    }}
                                />
                                <div className={classes.buttonQuantity}>
                                    <button
                                        className="btn minus1"
                                        onClick={minusHandler}>
                                        -
                                    </button>
                                    <input
                                        id="id_form-0-quantity"
                                        min={0}
                                        name="form-0-quantity"
                                        readOnly
                                        value={enteredAmount}
                                        type="number"
                                        style={{ width: "2rem" }}
                                        onChange={(e) => {
                                            setEnteredAmount(e.target.value);
                                        }}
                                    />
                                    <button
                                        className="btn add1"
                                        onClick={addHandler}>
                                        +
                                    </button>
                                </div>
                                <Button
                                    disabled={checkCountProduct()}
                                    onClick={addToCartHandler}
                                    variant="dark"
                                    style={{
                                        height: "min-content",
                                        ...styleDisabled(),
                                    }}
                                    className="text-white fst-italic rounded-0 border-0">
                                    Add to Cart
                                </Button>
                            </InputGroup>
                        </form>
                    </div>
                </div>
                <Description orderList={orderList} related={relatedCxt.items} />
            </Fragment>
        );
    }

    return (
        <Fragment>
            <Await
                resolve={data}
                errorElement={<p>Error loading package location!</p>}>
                {content}
            </Await>
        </Fragment>
    );
};

export default ProductDetail;
