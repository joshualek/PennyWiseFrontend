import { Link } from "react-router-dom";

// Styles
import "../styles/Sidebar.css";

// Heroicons
import { HomeIcon, ChartBarIcon } from '@heroicons/react/24/solid';

const Sidebar = ({ isVisible }) => {
    return (
        <div className={`sidebar ${isVisible ? '' : 'sidebar-hidden'}`}>
            <nav>
                <ul>
                    <li>
                        <Link to="/home" className="menu-link">
                            <HomeIcon width={24} />
                            <span></span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/chart">
                            <ChartBarIcon width={24} />
                            <span></span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
