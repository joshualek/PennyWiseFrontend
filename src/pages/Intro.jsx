import { Link } from "react-router-dom";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import Nav from "../components/Nav";
import illustration from "../assets/illustration.jpg";

const Intro = () => {
    return (
        <div className="intro">
            <div>
                <Nav />
                <h1>Take Control of <span className="accent">Your Finances</span></h1>
                <p>With PennyWi$e, discover the secret to the start of financial freedom.</p>
                <p>
                    <Link to="/login" className="btn btn--dark">
                        <UserPlusIcon width={20} />
                        Login
                    </Link>
                </p>
                <p>
                    Don't have an account?{" "}
                    <Link to="/register" className="btn btn--light">
                        <UserPlusIcon width={20} />
                        Register
                    </Link>
                </p>
            </div>
            <img src={illustration} alt="Person with money" width={600} />
        </div>
    );
};

export default Intro;
