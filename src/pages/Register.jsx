import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../utils/auth";
import "../styles/Register.css"; 
import Nav from "../components/nav/Nav";

const Register = () => {
    const navigate = useNavigate();
    const [registerData, setRegisterData] = useState({ username: "", password: "" });

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({ ...registerData, [name]: value });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const result = await register(registerData.username, registerData.password);
        if (result.success) {
            alert("Registration successful! You can now log in.");
            navigate("/");
        } else {
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <>
            <Nav />
            <div className="register-container">
                <h1>Register</h1>
                <form onSubmit={handleRegisterSubmit} className="register-form">
                    <div className="form-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={registerData.username}
                            onChange={handleRegisterChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="btn btn--dark">
                        <span>Register</span>
                    </button>
                </form>
                <p className="additional-spacing small-text">
                    Already have an account? <Link to="/login" className="btn btn--light">Login</Link>
                </p>
            </div>
        </>
    );
};

export default Register;
