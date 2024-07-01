import React, { useState, useEffect, useRef } from "react"
import { Link, Form, useFetcher, useLoaderData, useNavigate, } from "react-router-dom"

// Library
import { toast } from "react-toastify"
import { CurrencyDollarIcon } from '@heroicons/react/24/solid'

// Components
import Sidebar from "../components/Sidebar"
import Nav from "../components/Nav"
import AddBudgetForm from "../components/AddBudgetForm"
import AddExpenseForm from "../components/AddExpenseForm"
import BudgetItem from "../components/BudgetItem"
import Table from "../components/Table"

// Pages
import Intro from "../pages/Intro"
import Login from "../pages/Login"

// api
import api from "../api"

// auth.js
import { getAccessToken } from "../utils/auth"

// Helper functions
import { createBudget, createExpense, fetchData, fetchDataDjango } from "../helpers"

// Heroicons
import { Bars3Icon } from '@heroicons/react/24/solid'

export async function dashboardLoader() {
    const userName = await fetchData("userName");
    const budgets = await fetchDataDjango("budgets/");
    const expenses = await fetchDataDjango("expenses/");
    return { userName, budgets, expenses };
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
            })
            return toast.success(`Expense ${values.newExpense} created successfully`)
        } catch (e) {
            throw new Error("There was a problem creating your expense.")
        }
    }
    
    if (_action === "deleteExpense") {
        return null;
    }
}

const Dashboard = () => {
    const { userName, budgets, expenses } = useLoaderData()
    // useEffect(() => {
    //     getBudgets();
    // }, []);

    // const getBudgets = () => {
    //     api
    //         .get("/api/budgets/")
    //         .then((res) => res.data)
    //         .then((data) => {
    //             //setBudget(data);
    //             console.log(data);
    //         })
    //         .catch((err) => alert(err));
    // };

    // const deleteBudget = (id) => {
    //     api
    //         .delete(`/api/budgets/delete/${id}/`)
    //         .then((res) => {
    //             if (res.status === 204) alert("Budget deleted!");
    //             else alert("Failed to delete budget.");
    //             getBudgets(); // after deleting (or not) a note, we want to refresh the notes displayed
    //         })
    //         .catch((error) => alert(error));
    // };

    console.log("Rendering Dashboard with data:", { userName, budgets, expenses });

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
                        <Bars3Icon />
                    </button>
                    <div className={`dashboard ${sidebarVisible ? '' : 'dashboard-expanded'}`}>
                        <Nav userName={userName} />
                        <h1>Welcome, <span className="accent">{userName}</span></h1>
                        <div className="grid-sm">
                            {budgets && budgets.length > 0 ? (
                                <div className="grid-lg">
                                    <div className="forms-container">
                                        <AddBudgetForm />
                                        <AddExpenseForm budgets={budgets} />
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
                                            <Table
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