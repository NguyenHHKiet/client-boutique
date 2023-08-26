import axios from "axios";
import { redirect } from "react-router-dom";

export function getTokenDuration() {
    const storedExpirationDate = localStorage.getItem("expiration");
    const expirationDate = new Date(storedExpirationDate);
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();
    return duration;
}

export function getAuthToken() {
    const token = JSON.parse(localStorage.getItem("currentUser"));

    if (!token) return null;

    const tokenDuration = getTokenDuration();

    if (tokenDuration < 0) {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("expiration");
        axios.defaults.headers.post["Authorization"] = null;
        return "EXPIRED";
    }

    return token;
}

// check into switch page if you are logged in
export function checkAuthLoader() {
    const token = getAuthToken();

    if (!token) {
        return redirect("/login");
    }

    return token;
}

export function tokenLoader() {
    const token = getAuthToken();
    return token;
}
