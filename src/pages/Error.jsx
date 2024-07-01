import { useRouteError, Link, useNavigate } from "react-router-dom"

// Library
import { HomeIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid"

const Error = () => {
    const error = useRouteError()
    const navigate = useNavigate() // we can use this HOOK cause react-router-dom keeps a history

    return (
        <div className="error">
            <h1>404 Not Found</h1>
            <p>{error.message || error.statusText }</p>
            <div className="flex-md">
                <button className="btn btn--dark" onClick={() => navigate(-1)}>
                    <ArrowUturnLeftIcon width={20} />
                    <span>Go Back</span>
                </button>
                <Link to="/dashboard" className="btn btn--dark">
                    <HomeIcon width={20} />
                    <span>Go Home</span>
                </Link>
            </div>
        </div>
    )
}
export default Error