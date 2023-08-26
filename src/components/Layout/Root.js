import React, { Fragment, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import MainNavigation from "./MainNavigation";
import Footer from "./Footer";
import ChatBox from "../ChatBox/ChatBox";
import { useSelector } from "react-redux";
import { tokenCSRF } from "../../API/data";

const Root = () => {
    const [message, setMessage] = useState(null);
    const switches = useSelector((state) => state.switches);

    useEffect(() => {
        const text = localStorage.getItem("message");
        setMessage(text);
        setTimeout(() => {
            localStorage.removeItem("message");
            setMessage(null);
        }, 3000);
        tokenCSRF();
    }, [switches]);

    return (
        <Fragment>
            {message && (
                <p
                    style={{
                        position: "fixed",
                        backgroundColor: "aquamarine",
                        textAlign: "center",
                        width: "100%",
                        color: "whitesmoke",
                        fontWeight: "bold",
                        padding: "0.25rem 0",
                    }}>
                    {message}
                </p>
            )}
            <MainNavigation />
            <main className="container">
                <Outlet />
            </main>
            <ChatBox />
            <Footer />
        </Fragment>
    );
};

export default Root;
