import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

// Create a protected route that only allows access to authenticated users, else get them to login
function ProtectedRoute({children})  {
    const [isAuthorized, setIsAuthorized] = useState(null);

    // As soon as we load our protected route, we want to check 
    // if the user is authorised using auth(), else refreshToken()
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try { // send request to backend with refresh token to get a new access token
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200) { // successful response
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    // 1. check if access token exist
    // 2. if it does, check if it's expired
    // 3. if it is, refresh the token, which refreshes in the background
    // 4. else get them to login again
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN); // 1.
        if (!token) { // 4.
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token); // 2.
        const tokenExpiration = decoded.exp; // get the expiration time of the token
        const now = Date.now() / 1000; // get the current time in seconds
        if (tokenExpiration < now) { // 3.
            await refreshToken(); 
        } else {
            setIsAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;