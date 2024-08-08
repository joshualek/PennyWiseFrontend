
import React, { useState } from "react"
import { Link, useLoaderData } from "react-router-dom"

// Library
import { toast } from "react-toastify"
import MenuIcon from '@mui/icons-material/Menu';

// Components
import Sidebar from "../components/Sidebar"
import Nav from "../components/Nav"
import AddBudgetForm from "../components/AddBudgetForm"
import AddExpenseForm from "../components/AddExpenseForm"
import AddIncomeForm from "../components/AddIncomeForm"
import BudgetItem from "../components/BudgetItem"
import IncomeItem from "../components/IncomeItem"
import Table from "../components/Table"
import IncomeTable from "../components/IncomeTable"
import ExportButton from "../components/ExportButton";

// Pages
import Intro from "../pages/Intro"

// Helper functions
import { createBudget, createExpense, createIncome, fetchData, fetchDataDjango } from "../helpers"

export async function dashboardLoader() {
    const userName = await fetchData("userName");
    const budgets = await fetchDataDjango("budgets/");
    const expenses = await fetchDataDjango("expenses/");
    const income = await fetchDataDjango("income/")
    const categories = await fetchDataDjango("category/")
    return { userName, budgets, expenses, income, categories };
}

export async function dashboardAction({ request }) {
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
                category: values.newExpenseCategory,
            })
            return toast.success(`Expense ${values.newExpense} created successfully`)
        } catch (e) {
            console.error("Error creating expense:", e);
            if (e.response) {
                // If there is a response object, log its details
                console.error("Response status:", e.response.status);
                console.error("Response data:", e.response.data);
            }
            throw new Error("There was a problem creating your expense.");
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

const Dashboard = () => {
    const { userName, budgets, expenses, income, categories } = useLoaderData()
    console.log("Rendering Dashboard with data:", { userName, budgets, expenses, income });

    // sidebar
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <>
            {userName ? (
                <div className="dashboard-container">
                    <Sidebar isVisible={sidebarVisible} />
                    <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
                        <MenuIcon />
                    </button>
                    <div className={`dashboard ${sidebarVisible ? '' : 'dashboard-expanded'}`}>
                        <Nav userName={userName} />
                        <div className="grid-sm">
                            {budgets && budgets.length > 0 ? (
                                <div className="grid-lg">
                                    <div className="forms-container">
                                        <AddBudgetForm />
                                        <AddExpenseForm budgets={budgets} />
                                        <AddIncomeForm />
                                    </div>
                                    <h2>Existing Budgets</h2>
                                    <div className="budgets">
                                        {budgets.map((budget) => (
                                            <BudgetItem key={budget.id} budget={budget} />
                                        ))}
                                    </div>
                                    {expenses && expenses.length > 0 && (
                                        <div className="grid-md">
                                            <h2>Recent Expenses</h2>
                                            <Table categories={categories}
                                                expenses={expenses
                                                    .sort((a, b) => b.createdAt - a.createdAt)
                                                    .slice(0, 8)}
                                            />
                                            {expenses.length > 0 && (
                                                <Link to="/expenses" className="btn btn--dark">
                                                    View all expenses
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                    {income && income.length > 0 && (
                                        <div className="grid-md">

                                            <h2>Recent Income</h2>
                                            <IncomeTable
                                                income={income
                                                    .sort((a, b) => b.createdAt - a.createdAt)
                                                    .slice(0, 8)}
                                            />
                                            {income.length > 0 && (
                                                <Link to="/income" className="btn btn--dark">
                                                    View all income
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                    <ExportButton />
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

export default Dashboard
