import { Form, NavLink } from "react-router-dom"

// Assets
import logomark from "../../assets/logomark.svg"

// Heroicons
import { LockClosedIcon } from "@heroicons/react/24/outline"

const Nav = ({ userName }) => {
    return (
        <nav>
            <NavLink to="/home" aria-label="Go to PennyWi$e Home">
                <img src={logomark} alt="logo" height={30} />
                <span className="accent">PennyWi$e</span>
            </NavLink> 
            {
                userName && (
                    <Form 
                        method="post" 
                        action="/logout"
                        onSubmit={(event) => {
                            if (!confirm("Are you sure you want to logout?")) {
                                event.preventDefault()
                            }
                        }}
                    >
                        <button type="submit" className="btn btn--warning">
                            <span>Logout</span>
                            <LockClosedIcon width={20} />
                        </button>
                    </Form> // post method to send data, action to send it to the logout route
                )
            }
        </nav>
    )
}

export default Nav