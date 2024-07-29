import React, { useState } from "react"
import { Link, useLoaderData } from "react-router-dom"

// library
import { toast } from "react-toastify"

// Components
import Sidebar from "../components/Sidebar"
import Table from "../components/Table"
import Nav from "../components/Nav"

// Helpers
import { fetchData, fetchDataDjango } from "../helpers"

// Heroicons
import { Bars3Icon } from '@heroicons/react/24/solid'

// Loader function to tell react router dom how to load the data (in this case Dashboard)
export async function expensesLoader() {
    const userName = await fetchData("userName")
    const expenses = await fetchDataDjango("expenses/")
    const categories = await fetchDataDjango("category/"); 

    console.log('Categories:', categories);  // Debug: log categories to verify

    return { userName, expenses, categories };

}

// Action
export async function expensesAction({request}) {
    const data = await request.formData()
    const { _action, ...values } = Object.fromEntries(data)
    if (_action === "deleteExpense") {
        return null;
    }

}

const ExpensesPage = () => {
    const { userName, expenses, categories } = useLoaderData()
    console.log("Rendering ExpensesPage with data:", { userName, expenses, categories });

    // Sidebar
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [filterCategory, setFilterCategory] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };


    return (
        <div className="dashboard-container">
            <Sidebar isVisible={sidebarVisible} />
            <div className={`dashboard ${sidebarVisible ? '' : 'dashboard-expanded'}`}>
                <Nav userName={userName}/>
                <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
                    <Bars3Icon />
                </button>
                <div className="grid-lg">
                    <h1>All Expenses<small>({expenses.length} total)</small></h1>
                    {
                        expenses && expenses.length > 0 ? (
                            <div className="grid-md">
                                <Table expenses={expenses} categories={categories} />
                            </div>
                        ) : <p>No expenses found</p>
                        }
                </div>
                <div className="flex-sm">
                    <Link to="/home" className="btn btn--primary">Back to Home</Link>
                    <Link to="/dashboard" className="btn btn--primary">Back to Dashboard</Link>
                </div>
            </div>
        </div>
    )
}

export default ExpensesPage