import React, { useState, useEffect, useRef } from "react"
import { Link, Form, useFetcher, useLoaderData, useNavigate, } from "react-router-dom"

// Library
import { toast } from "react-toastify"
import { CurrencyDollarIcon } from '@heroicons/react/24/solid'
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { tokens } from "../theme";

// Components
import Sidebar from "../components/Sidebar"
import Nav from "../components/Nav"
import AddBudgetForm from "../components/AddBudgetForm"
import AddExpenseForm from "../components/AddExpenseForm"
import AddIncomeForm from "../components/AddIncomeForm"
import BarChart from "../components/BarChart"
import BudgetItem from "../components/BudgetItem"
import IncomeItem from "../components/IncomeItem"
import Table from "../components/Table"
import IncomeTable from "../components/IncomeTable"
import StatBox from "../components/StatBox";

// Pages
import Intro from "../pages/Intro"
import Login from "../pages/Login"

// api
import api from "../api"

// auth.js
import { getAccessToken } from "../utils/auth"

// Helper functions
import { createBudget, createExpense, createIncome, fetchData, fetchDataDjango } from "../helpers"

// Heroicons
import { Bars3Icon } from '@heroicons/react/24/solid'

export async function homeLoader() {
    const userName = await fetchData("userName");
    const budgets = await fetchDataDjango("budgets/");
    const expenses = await fetchDataDjango("expenses/");
    const income = await fetchDataDjango("income/")
    return { userName, budgets, expenses, income };
}

export async function homeAction({ request }) {
    const data = await request.formData() // gets the data from the form
    const { _action, ...values } = Object.fromEntries(data) // removes the _action key from the data

    if (_action === "newUser") {
        try {
            localStorage.setItem("userName", JSON.stringify(values.userName)) // saves the data in local storage
            return toast.success(`Welcome, ${values.userName}`) // returns a toast message
        } catch (e) {
            throw new Error("There was a problem creating your account.")
        }
    }

    if (_action === "createBudget") {
        try {
            await createBudget({
                name: values.newBudget,
                amount: values.newBudgetAmount,
            })
            return toast.success(`Budget created successfully`)
        } catch (e) {
            throw new Error("There was a problem creating your budget.")
        }
    }

    if (_action === "createExpense") {
        try {
            await createExpense({
                name: values.newExpense,
                amount: values.newExpenseAmount,
                budget: values.newExpenseBudget,
            })
            return toast.success(`Expense ${values.newExpense} created successfully`)
        } catch (e) {
            throw new Error("There was a problem creating your expense.")
        }
    }

    if (_action === "deleteExpense") {
        return null;
    }

    if (_action === "createIncome") {
        try {
            await createIncome({
                name: values.newIncome,
                amount: values.newIncomeAmount,
            })
            return toast.success(`Income created successfully`)
        } catch (e) {
            throw new Error("There was a problem creating your Income.")
        }
    }

    if (_action === "deleteIncome") {
        return null;
    }
}

const Home = () => {
    const { userName, budgets, expenses, income } = useLoaderData()
    console.log("Rendering HomePage with data:", { userName, budgets, expenses, income });

    // sidebar
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // data for summary stats in StatBox
    const totalExpenses = expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
    const totalIncome = income.reduce((acc, income) => acc + Number(income.amount), 0);
    const totalBudget = budgets.reduce((acc, budget) => acc + Number(budget.amount), 0);
    const percentageSpent = ((totalExpenses / totalBudget) * 100).toFixed(2);
    console.log("Total Budget: ", totalBudget);
    console.log("Total Expenses: ", totalExpenses);
    console.log("Percentage Spent: ", percentageSpent);

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
                        <div className="grid-sm">
                            {budgets && budgets.length > 0 ? (
                                <div className="grid-lg">
                                    <h3>Dashboard Overview</h3>
                                    <Box
                                        //gridColumn="span 3"
                                        display="flex"
                                        flexWrap="wrap"
                                        alignItems="center"
                                        justifyContent="space-between"
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
                                    {/* <div className="chart">
                                        <BarChart />
                                    </div> */}
                                    <div style={{
                                        display:"flex",
                                        justifyContent:"center",
                                        alignItems:"center",
                                        }}>
                                        
                                    <Link to="/dashboard" className="btn btn--primary">Expand Dashboard</Link>
                                    </div>

                                </div>
                                
                            ) : (
                                <div className="grid-sm">
                                    <p>Personal budgeting is the secret to financial freedom.</p>
                                    <p>Create a budget to get started</p>
                                    <AddBudgetForm />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : <Intro />}
        </>
    );
}

export default Home