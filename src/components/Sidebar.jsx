import { Link } from "react-router-dom";

// Styles
import "../styles/Sidebar.css";

// Heroicons
import { HomeIcon, ChartBarIcon, StarIcon } from '@heroicons/react/24/solid';

const Sidebar = ({ isVisible }) => {
    return (
        <div className={`sidebar ${isVisible ? '' : 'sidebar-hidden'}`}>
            <nav>
                <ul>
                    <li>
                        <Link to="/home" className="menu-link">
                            <HomeIcon width={24} />
                            <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/analytics">
                            <ChartBarIcon width={24} />
                            <span>Analytics</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/goals">
                            <StarIcon width={24} />
                            <span>Goals</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;