import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/auth";
import "../styles/Login.css";
import Nav from "../components/Nav";

const Login = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const result = await login(loginData.username, loginData.password);
        if (result.success) {
            localStorage.setItem("userName", JSON.stringify(loginData.username))
            console.log("Stored Username", localStorage.getItem("userName"))
            navigate("/home");
        } else {
            setError("Login failed. Please check your credentials.");
        }
    };

    return (
        <>
            <Nav className="navLogin"/>
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleLoginSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={loginData.username}
                            onChange={handleLoginChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            required 
                        />                  
                    </div>
                    <button type="submit" className="btn btn--dark">
                        <span>Login</span>
                    </button>
                </form>
                {error && <p className="error">{error}</p>}
                <p className="additional-spacing small-text">
                    Don't have an account?{" "}
                    <Link to="/register" className="btn btn--light">
                        Register
                    </Link>
                </p>
            </div>
        </>
    );
};

export default Login;