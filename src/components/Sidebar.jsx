import { Link } from "react-router-dom";

// Styles
import "../styles/Sidebar.css";

// Libraries
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import DiscountIcon from '@mui/icons-material/Discount';

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
                        <Link to="/dashboard">
                            <SpaceDashboardIcon width={24} />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/analytics">
                            <TrendingUpIcon width={24} />
                            <span>Analytics</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/student-discounts">
                            <DiscountIcon width={24} />
                            <span>Discounts</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
