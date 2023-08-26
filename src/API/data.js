import { defer, json, redirect } from "react-router-dom";
import axios from "axios";
import { getAuthToken } from "../utils/auth";

export async function loader() {
    try {
        const response = await axios.get("/products");

        if (response.status !== 200) {
            throw json(
                { message: "Could not fetch list of products." },
                { status: 500 }
            );
        }

        const resData = await response.data;
        return defer({ data: resData });
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function loadDetail({ params }) {
    // {request: Request, params: {…}, context: undefined}
    try {
        const id = params.productId;
        const resData = await axios.get("/products/" + id);
        // const item = resData.filter((item) => item._id === id);
        const item = await resData.data;
        return defer({ data: item });
    } catch (error) {
        console.log(error);
        return false;
    }
}

// check token validity existing token
// take data while rendering page
export async function tokenCSRF() {
    try {
        const response = await axios.get("/auth/getCSRFToken");
        const data = await response.data;
        axios.defaults.headers["csrf-token"] = data.csrfToken;
        return defer(data);
    } catch (error) {
        console.log(error);
        return error;
    }
}

// take data while rendering page
export async function cartLoader() {
    const isChecked = getAuthToken();
    try {
        if (isChecked) {
            const resData = await axios.get("/cart");
            // const item = resData.filter((item) => item._id === id);
            const items = await resData.data;
            return defer({ cart: items });
        }
        return redirect("/login");
    } catch (error) {
        console.log(error);
        return false;
    }
}
