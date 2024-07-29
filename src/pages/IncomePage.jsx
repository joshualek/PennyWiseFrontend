import React, { useState } from "react"
import { Link, useLoaderData } from "react-router-dom"

// library
import { toast } from "react-toastify"

// Components
import Sidebar from "../components/Sidebar"
import IncomeTable from "../components/IncomeTable"
import Nav from "../components/Nav"

// Helpers
import { fetchData, fetchDataDjango } from "../helpers"

// Heroicons
import { Bars3Icon } from '@heroicons/react/24/solid'

// Loader function to tell react router dom how to load the data (in this case Dashboard)
export async function incomeLoader() {
    const userName = await fetchData("userName")
    const income = await fetchDataDjango("income/")
    return { userName, income }
}

// Action
export async function incomeAction({ request }) {
    const data = await request.formData()
    const { _action, ...values } = Object.fromEntries(data)
    if (_action === "deleteIncome") {
        return null;
    }

}

const IncomePage = () => {
    const { userName, income } = useLoaderData()
    console.log("Rendering IncomePage with data:", { userName, income });

    // Sidebar
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <div className="dashboard-container">
            <Sidebar isVisible={sidebarVisible} />
            <div className={`dashboard ${sidebarVisible ? '' : 'dashboard-expanded'}`}>
                <Nav userName={userName} />
                <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
                    <Bars3Icon />
                </button>
                <div className="grid-lg">
                    <h1>All Income<small>({income.length} total)</small></h1>
                    {
                        income && income.length > 0 ? (
                            <div className="grid-md">
                                <IncomeTable income={income} />
                            </div>
                        ) : <p>No recent income</p>
                    }
                    <div className="flex-sm">
                        <Link to="/home" className="btn btn--primary">Back to Home</Link>
                        <Link to="/dashboard" className="btn btn--primary">Back to Dashboard</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default IncomePage