import React, { Fragment, useEffect } from "react";
import Orders from "../components/Orders/Orders";

const OrderPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Fragment>
            <Orders />
        </Fragment>
    );
};

export default OrderPage;
