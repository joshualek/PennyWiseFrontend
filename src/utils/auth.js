// Function to check if the user is authenticated
export const isAuthenticated = () => {
    return !!localStorage.getItem("access");
};

// Function to log out the user by removing tokens from localStorage
export const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
};

// Function to get the access token
export const getAccessToken = () => {
    return localStorage.getItem("access");
};

// Function to handle login
export const login = async (username, password) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            // Store tokens in localStorage
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            return { success: true, data };
        } else {
            return { success: false, error: data };
        }
    } catch (error) {
        return { success: false, error };
    }
};

// Function to handle registration
export const register = async (username, password) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/user/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data };
        }
    } catch (error) {
        return { success: false, error };
    }
};
