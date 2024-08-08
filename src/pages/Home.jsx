import React, { useState, useEffect } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";

// Libraries
import { Bars3Icon } from '@heroicons/react/24/solid';
import { Box, CardActionArea } from "@mui/material";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ResponsiveContainer } from 'recharts';


// Components
import Sidebar from "../components/Sidebar";
import Nav from "../components/Nav";
import StatBox from "../components/StatBox";
import StudentDiscountCard from "../components/StudentDiscountCard"
import Barchart from "../components/charts/Barchart";
import Piechart from "../components/charts/Piechart";
import GoalItemMini from "../components/GoalItemMini";

// Pages
import Intro from "../pages/Intro";
import { studentDiscountLoader } from './StudentDiscount';


// Helper functions
import { fetchData, fetchDataDjango } from "../helpers";

export async function homeLoader() {
    const userName = await fetchData("userName");
    const budgets = await fetchDataDjango("budgets/");
    const expenses = await fetchDataDjango("expenses/");
    const income = await fetchDataDjango("income/");
    const categories = await fetchDataDjango("category/");
    const goals = await fetchDataDjango("goals/");
    return { userName, budgets, expenses, income, categories, goals };
}

// Override to prevent a grey background from appearing when hovering on the card
const theme = createTheme({
    components: {
        MuiCardActionArea: {
            styleOverrides: {
                focusHighlight: {
                    backgroundColor: 'transparent !important',
                },
            },
        },
        MuiTouchRipple: {
            styleOverrides: {
                root: {
                    overflow: 'visible',
                },
            },
        },
    },
});

const Home = () => {
    const { userName, budgets, expenses, income, categories, goals } = useLoaderData();
    const [goalsList, setGoalsList] = useState(goals);


    // sidebar
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    // Card Navigation
    const navigate = useNavigate();
    const handleAnalyticsClick = () => {
        navigate("/analytics");
    };

    // data for summary stats in StatBox
    const totalExpenses = expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
    const totalIncome = income.reduce((acc, income) => acc + Number(income.amount), 0);
    const totalBudget = budgets.reduce((acc, budget) => acc + Number(budget.amount), 0);
    const percentageSpent = ((totalExpenses / totalBudget) * 100).toFixed(2);

    // data for charts
    const incomeExpensesData = [
        { name: 'Income', value: totalIncome },
        { name: 'Expenses', value: totalExpenses }
    ];

    // Data for spending by category
    const categorySpendingData = categories.map(category => ({
        name: category.name,
        value: expenses
            .filter(expense => expense.category === category.id)
            .reduce((sum, expense) => sum + Number(expense.amount), 0)
    }));

    // Student Discount
    const [discounts, setDiscounts] = useState([]);
    useEffect(() => {
        async function fetchData() {
            const { studentDiscount } = await studentDiscountLoader();
            setDiscounts(studentDiscount.slice(0, 6)); // Get the most recent 6 discounts
        }
        fetchData();
    }, []);

    return (
        <>
            {userName ? (
                <div className="dashboard-container">
                    <Sidebar isVisible={sidebarVisible} />
                    <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
                        <Bars3Icon />
                    </button>
                    <div className={`dashboard ${sidebarVisible ? '' : 'dashboard-expanded'}`}>
                        <Nav userName={userName} />
                        <div>
                            <h1>Welcome back, <span className="accent">{userName}</span></h1>
                            <p><i>Personal budgeting is the secret to financial freedom.</i></p>
                        </div>
                        <div className="grid-sm">
                            {budgets && budgets.length > 0 ? (
                                <div className="grid-lg">
                                    <h2>Dashboard Overview</h2>
                                    <Box
                                        display="flex"
                                        flexWrap="wrap"
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        <StatBox
                                            title="Total Income"
                                            subtitle={`$${totalIncome}`}
                                            link="/income"
                                            icon={
                                                <MonetizationOnIcon
                                                    sx={{ color: "#7DBDDD", fontSize: "40px" }}
                                                />
                                            }
                                        />
                                        <StatBox
                                            title="Total Expenses"
                                            subtitle={`$${totalExpenses}`}
                                            link="/expenses"
                                            icon={
                                                <CreditCardIcon
                                                    sx={{ color: "#7DBDDD", fontSize: "40px" }}
                                                />
                                            }
                                        />
                                        <StatBox
                                            title="Total Budget"
                                            subtitle={`$${totalBudget}`}
                                            link="/dashboard"
                                            icon={
                                                <RequestQuoteIcon
                                                    sx={{ color: "#7DBDDD", fontSize: "40px" }}
                                                />
                                            }
                                        />
                                        <StatBox
                                            title="% of Budget Spent"
                                            subtitle={`${percentageSpent}%`}
                                            progress={`${percentageSpent / 100}`}
                                            link="/dashboard"
                                        />
                                    </Box>

                                    <div style={{ display: 'flex', gap: '20px' }}> {/* Flex container for charts */}
                                        <div className="content-box content-box-boxed">
                                            <ThemeProvider theme={theme}>
                                                <CardActionArea onClick={handleAnalyticsClick} style={{ overflow: 'hidden' }}> {/* Remove absolute positioning */}
                                                    <div style={{ width: '100%', padding: '20px' }}> {/* Add padding here */}
                                                        <h3 style={{ marginBottom: '20px' }}>Income vs Expenses</h3>
                                                        <ResponsiveContainer width="100%" height={500}>
                                                            <Piechart data={incomeExpensesData} />
                                                        </ResponsiveContainer>
                                                    </div>
                                                </CardActionArea>
                                            </ThemeProvider>
                                        </div>
                                        <div className="content-box content-box-boxed">
                                            <ThemeProvider theme={theme}>
                                                <CardActionArea onClick={handleAnalyticsClick} style={{ overflow: 'hidden' }}> {/* Remove absolute positioning */}
                                                    <div style={{ width: '100%', padding: '20px' }}>
                                                        <h3 style={{ marginBottom: '20px' }}>Spending by Category</h3>
                                                        <ResponsiveContainer width="100%" height={500}>
                                                            <Barchart data={categorySpendingData} />
                                                        </ResponsiveContainer>
                                                    </div>
                                                </CardActionArea>
                                            </ThemeProvider>
                                        </div>
                                        <div className="content-box-boxed">
                                            <div style={{ width: '100%', padding: '20px' }}>
                                                <h3 style={{ marginBottom: '20px' }}>Goals</h3>
                                                {goalsList && goalsList.length > 0 ? (
                                                    goalsList.slice(0, 4).map((goal) => (
                                                        <GoalItemMini key={goal.id} goal={goal} className="content-box" />
                                                    ))
                                                ) : (
                                                    <p>No goals available</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <h2>Student Discounts Overview</h2>
                                    <div className="flex-md">
                                        {discounts.map((discount, index) => (
                                            <StudentDiscountCard
                                                key={index}
                                                date={discount.date}
                                                channel_id={discount.channel_id}
                                                message={discount.message}
                                                channel_link={discount.channel_link}
                                                discount_link={discount.discount_link}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid-sm">
                                    <p>It looks like you have no existing budgets.</p>
                                    <p>Click the icon below to get started.</p>
                                    <Link to="/dashboard">
                                        <DashboardIcon width={24} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : <Intro />}
        </>
    );
}

export default Home; 