import React, { Fragment, useEffect } from "react";
import OrderDetail from "../components/Orders/Detail/OrderDetail";

const OrderDetailPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Fragment>
            <OrderDetail />
        </Fragment>
    );
};

export default OrderDetailPage;
