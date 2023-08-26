import axios from "axios";
import { json, redirect } from "react-router-dom";

export async function actionRegister({ params, request }) {
    try {
        const formRequest = await request.formData();
        const formData = new FormData();
        formData.append("name", formRequest.get("name"));
        formData.append("email", formRequest.get("email"));
        formData.append("password", formRequest.get("password"));
        formData.append("phone", formRequest.get("phone"));

        const response = await axios.post("/auth/signup", formData, {});
        const data = await response.data;
        localStorage.setItem("message", JSON.stringify(data.message));
        if (response.status !== 201) {
            throw json(
                { message: "Could not fetch list of products." },
                { status: 500 }
            );
        }
        if (response.status === 201) {
            localStorage.setItem("message", JSON.stringify(data.message));
            return redirect("/login");
        }

        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function actionLogin({ params, request }) {
    try {
        const formRequest = await request.formData();
        const formData = new FormData();
        formData.append("email", formRequest.get("email"));
        formData.append("password", formRequest.get("password"));

        const response = await axios.post("/auth/login", formData);
        const data = await response.data;
        if (response.status !== 200) {
            throw json(
                { message: "Could not fetch list of products." },
                { status: 500 }
            );
        }
        if (response.status === 200) {
            // Authorization: Bearer <token>
            axios.defaults.headers["Authorization"] = "Bearer " + data.token;
            // create a expiration
            const expiration = new Date();
            expiration.setHours(expiration.getHours() + 2);
            localStorage.setItem("expiration", expiration.toISOString());
            // updated local
            localStorage.setItem("message", JSON.stringify(data.message));
            localStorage.setItem("currentUser", JSON.stringify(data));
            return redirect("/");
        }

        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function actionOrder({ request }) {
    const formRequest = await request.formData();
    const formData = new FormData();
    formData.append("name", formRequest.get("name"));
    formData.append("phone", formRequest.get("phone"));
    formData.append("address", formRequest.get("address"));

    try {
        const response = await axios.post("/create-order", formData);
        const data = await response.data;

        console.log(response);
        if (response.status === 422) {
            return response;
        }
        if (response.status === 201) {
            // updated local
            localStorage.setItem("message", JSON.stringify(data.message));
            return redirect("/shop");
        }

        return false;
    } catch (error) {
        console.log(error);
        if (error) return error;
        return false;
    }
}
