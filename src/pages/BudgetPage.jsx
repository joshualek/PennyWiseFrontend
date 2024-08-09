import React, { useState, useEffect } from "react"
import { Link, useLoaderData } from "react-router-dom"

// Library
import { toast } from "react-toastify"

// Components
import AddExpenseForm from "../components/AddExpenseForm"
import BudgetItem from "../components/BudgetItem"
import Sidebar from "../components/Sidebar"
import Table from "../components/Table"
import Nav from "../components/Nav"

// Helpers
import { calculateSpentByBudget, createExpense, fetchData, fetchDataDjango, fetchExpensesByBudgetId } from "../helpers"

// Heroicons
import { Bars3Icon } from '@heroicons/react/24/solid'

// Loader function to tell react router dom how to load the data (in this case Dashboard)
export async function budgetLoader({ params }) {
    const userName = await fetchData("userName");
    // Fetch the budget using the budget's id
    const budget = await fetchDataDjango(`budgets/${params.id}/`);
    // Fetch expenses related to the specified budget's id
    const expenses = await fetchExpensesByBudgetId(params.id);

    if (!budget) {
        throw new Error("Budget not found");
    }

    return { userName, budget, expenses };
}

// Action
export async function budgetAction({ request }) {
    const data = await request.formData()
    const { _action, ...values } = Object.fromEntries(data)

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

const BudgetPage = () => {
    const { userName, budget, expenses } = useLoaderData()

    console.log("Rendering BudgetPage with data:", { userName, budget, expenses });

    // Sidebar
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };
    const [expensesCounter, setExpensesCounter] = useState(0);
    const updateExpenses = () => {
        setExpensesCounter(prev => prev + 1); // Increment the trigger to indicate a change
    };

    // Determine accent color based on percentage spent
    const { id, amount } = budget
    const [spent, setSpent] = useState(0);

    useEffect(() => {
        const fetchSpentAmount = async () => {
            const spentAmount = await calculateSpentByBudget(id);
            setSpent(spentAmount);
        };

        fetchSpentAmount();
    }, [id]);
    
    const percentageSpent = spent / amount

    let accentColor = "206, 71%, 35%"; // Default color in HSL format
    if (percentageSpent >= 0.90) {
        accentColor = "0, 100%, 50%"; // Red
    } else if (percentageSpent >= 0.75) {
        accentColor = "36, 100%, 50%"; // Amber
    }

    return (
        <>
            <div className="dashboard-container">
                <Sidebar isVisible={sidebarVisible} />
                <div className={`dashboard ${sidebarVisible ? '' : 'dashboard-expanded'}`}>
                    <Nav userName={userName} />
                    <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
                        <Bars3Icon />
                    </button>
                    <div className="grid-lg" style={{ "--accent": accentColor }}>
                        <h1 className="h2">
                            <span className="accent">{budget.name}</span> Overview
                        </h1>
                        <div className="flex-lg">
                            <BudgetItem budget={budget} showDelete={true} expensesCounter={expensesCounter} />
                            <AddExpenseForm budgets={[budget]} />
                        </div>
                        {
                            expenses && expenses.length > 0 ? (
                                <div className="grid-md">
                                    <h2>
                                        <span className="accent">{budget.name}</span> Expenses
                                    </h2>
                                    <Table expenses={expenses} />
                                </div>
                            ) : <p>No expenses found</p>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default BudgetPage