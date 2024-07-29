import React, { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Bars3Icon } from '@heroicons/react/24/solid';
import { Box } from "@mui/material";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Components
import Sidebar from "../components/Sidebar";
import Nav from "../components/Nav";
import StatBox from "../components/StatBox";

// Pages
import Intro from "../pages/Intro";

// Helper functions
import { fetchData, fetchDataDjango } from "../helpers";

export async function homeLoader() {
    const userName = await fetchData("userName");
    const budgets = await fetchDataDjango("budgets/");
    const expenses = await fetchDataDjango("expenses/");
    const income = await fetchDataDjango("income/");
    const categories = await fetchDataDjango("category/");
    return { userName, budgets, expenses, income, categories };
}

const Home = () => {
    const { userName, budgets, expenses, income, categories } = useLoaderData();

    // sidebar
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
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
                        <h1>Welcome back, <span className="accent">{userName}</span></h1>
                        <p>Personal budgeting is the secret to financial freedom.</p>
                        <div className="grid-sm">
                            {budgets && budgets.length > 0 ? (
                                <div className="grid-lg">
                                    <div className="flex-sm">
                                        <h3>Dashboard Overview</h3>
                                        <Link to="/dashboard">
                                            <DashboardIcon width={24} />
                                        </Link>
                                    </div>
                                    <Box
                                        display="flex"
                                        flexWrap="wrap"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        className="statbox-area"
                                    >
                                        <StatBox
                                            title="Total Expenses"
                                            subtitle={`$${totalExpenses}`}
                                            link="/expenses"
                                            icon={
                                                <CreditCardIcon
                                                    sx={{ color: "#7DB2DD", fontSize: "40px" }}
                                                />
                                            }
                                        />
                                        <StatBox
                                            title="Total Income"
                                            subtitle={`$${totalIncome}`}
                                            link="/income"
                                            icon={
                                                <MonetizationOnIcon
                                                    sx={{ color: "#7DB2DD", fontSize: "40px" }}
                                                />
                                            }
                                        />
                                        <StatBox
                                            title="Total Budget"
                                            subtitle={`$${totalBudget}`}
                                            link="/dashboard"
                                            icon={
                                                <RequestQuoteIcon
                                                    sx={{ color: "#7DB2DD", fontSize: "40px" }}
                                                />
                                            }
                                        />
                                        <StatBox
                                            title="% of Budget Spent"
                                            subtitle={`${percentageSpent}%`}
                                            progress={`${percentageSpent/100}`}
                                            link="/dashboard"
                                        />
                                    </Box>
                                    <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}> {/* Flex container for charts */}
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ marginBottom: '20px' }}>Income vs Expenses</h3>
                                            <ResponsiveContainer width="100%" height={400}>
                                                <PieChart>
                                                    <Pie
                                                        data={incomeExpensesData}
                                                        dataKey="value"
                                                        nameKey="name"
                                                        outerRadius={150}
                                                    >
                                                        {incomeExpensesData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={index === 0 ? "#7DB2DD" : "#FF5733"} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(value, name) => [`$${value}`, name]} />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <p>Income: ${totalIncome}</p> {/* Display income */}
                                            <p>Expenses: ${totalExpenses}</p> {/* Display expenses */}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ marginBottom: '20px' }}>Spending by Category</h3>
                                            <ResponsiveContainer width="100%" height={400}>
                                                <BarChart data={categorySpendingData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Bar dataKey="value" fill="#7DB2DD" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
                                        <Link to="/analytics">
                                            <button className="btn btn--primary">Go to Analytics</button>
                                        </Link>
                                        <Link to="/dashboard">
                                            <button className="btn btn--secondary">Expand Dashboard</button>
                                        </Link>
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