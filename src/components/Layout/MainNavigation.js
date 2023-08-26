import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useRouteLoaderData } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import classes from "./MainNavigation.module.scss";
import axios from "axios";
import { tokenLoader } from "../../utils/auth";
import Button from "react-bootstrap/esm/Button";

const MainNavigation = () => {
    const token = useRouteLoaderData("root");
    const [user, setUser] = useState(token);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const switches = useSelector((state) => state.switches);
    axios.defaults.headers["Authorization"] = "Bearer " + user?.token;

    const logoutHandler = async () => {
        const response = await axios.post("/auth/logout");
        const data = await response.data;
        axios.defaults.headers["Authorization"] = "";
        axios.defaults.headers["csrf-token"] = "";
        localStorage.setItem("message", JSON.stringify(data.message));
        dispatch({ type: "ON_LOGOUT", isAuthenticated: false });
        return navigate("/");
    };

    useEffect(() => {
        setUser(tokenLoader);
    }, [switches]);

    return (
        <header className={`${classes.header} container`}>
            <nav>
                <ul>
                    <li>
                        <NavLink
                            to={"/"}
                            className={({ isActive }) =>
                                isActive ? classes.active : undefined
                            }>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={"/shop"}
                            className={({ isActive }) =>
                                isActive ? classes.active : undefined
                            }>
                            Shop
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div className={classes.logo}> Boutique</div>
            <nav>
                <ul>
                    <li>
                        <NavLink
                            to={"/cart"}
                            className={({ isActive }) =>
                                isActive ? classes.active : undefined
                            }>
                            <i className="bi bi-bag-check-fill me-1"></i>
                            Cart
                        </NavLink>
                    </li>
                    {user ? (
                        <>
                            <li>
                                <Dropdown>
                                    <Dropdown.Toggle
                                        variant="warning"
                                        id="dropdown-basic"
                                        style={{
                                            padding: "0 0.25rem",
                                            fontWeight: "bold",
                                            fontStyle: "italic",
                                        }}>
                                        <i className="bi bi-person-circle me-1"></i>
                                        {user?.name}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="/auth/orders">
                                            History
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Button
                                                type="submit"
                                                onClick={logoutHandler}>
                                                Logout
                                            </Button>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>
                        </>
                    ) : (
                        <li>
                            <NavLink
                                to={"/login"}
                                className={({ isActive }) =>
                                    isActive ? classes.active : undefined
                                }>
                                Login
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default MainNavigation;
