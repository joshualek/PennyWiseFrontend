import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { isAuthenticated, logout as clearAuthTokens } from "../utils/auth";

export async function logoutAction() {
    if (isAuthenticated()) {
        const username = JSON.parse(localStorage.getItem("userName"));
        console.log("Logging out user:", username);
        // Clear auth tokens and username
        clearAuthTokens();
        localStorage.removeItem("userName");

        toast.success("You have successfully logged out");
    }
    // return redirect
    return redirect("/");
}