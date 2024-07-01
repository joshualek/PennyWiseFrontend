// rrd imports
import { Outlet, useLoaderData } from "react-router-dom";

// assets
import wave from "../assets/wave.svg";

// components
import Nav from "../components/Nav";

//  helper functions
import { fetchData } from "../helpers";

// loader
export function mainLoader() {
    const userName = fetchData("userName");
    return { userName };
}

const Main = () => {
    // useLoaderData is a Hook that will allow us to access whatever is in the mainLoader()
    const { userName } = useLoaderData();

    // Outlet is a component that will render the child route's content
    return (
        <div className="layout">
            <main>
                <Outlet />
            </main>
        </div>
    );
};
export default Main;
