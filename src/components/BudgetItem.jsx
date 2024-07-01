import { useEffect, useState } from "react"
import { Form, Link, useNavigate } from "react-router-dom"

// Library
import { toast } from "react-toastify";

// Helpers
import { calculateSpentByBudget, deleteItem, formatPercentage, formatCurrency, getBudgetsArray, fetchExpensesByBudgetId } from "../helpers"

// Heroicons
import { BanknotesIcon } from "@heroicons/react/24/outline"
import { TrashIcon } from "@heroicons/react/24/solid"

const deleteBudget = async (budgetId, navigate) => {
    console.log(`budgetID here is: `, budgetId)
    try {
        // When we delete the budget we need to delete all the expenses associated with it
        const associatedExpenses = await fetchExpensesByBudgetId(budgetId);
        for (const expense of associatedExpenses) {
            await deleteItem(`expenses/delete/${expense.id}/`);
        }
        // Delete the specific budget
        await deleteItem(`budgets/delete/${budgetId}/`); 
        toast.success("Budget deleted successfully.")
        navigate("/dashboard");
    } catch (error) {
        toast.error('There was a problem deleting the expense.');
        throw new Error("There was a problem deleting your budget.");
    }
}

const BudgetItem = ({ budget, showDelete = false, expensesCounter }) => {
    const { id, name, amount } = budget;
    const [budgetData, setBudgetData] = useState({ name: '', amount: 0 });
    const [spent, setSpent] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBudgetData = async () => {
            const budgets = await getBudgetsArray();
            setBudgetData(budgets.find(b => b.id === id));
        };
        fetchBudgetData();
    }, [id]); // Re-fetch when id changes

    useEffect(() => {
        const fetchSpentAmount = async () => {
            const spentAmount = await calculateSpentByBudget(id);
            setSpent(spentAmount);
        };

        fetchSpentAmount();
    }, [id, expensesCounter]);

    const percentageSpent = spent / amount

    // Determine accent color based on percentage spent
    let accentColor = "206, 71%, 35%"; // Default color in HSL format
    if (percentageSpent >= 0.90) {
        accentColor = "0, 100%, 50%"; // Red
    } else if (percentageSpent >= 0.75) {
        accentColor = "36, 100%, 50%"; // Amber
    }

    return (
        <div className="budget" style={{ "--accent": accentColor }}>
            <div className="progress-text">
                <h3>{budgetData.name}</h3>
                <p>${formatCurrency(budgetData.amount)} Budgeted</p>
            </div>
            <progress max={budgetData.amount} value={spent}>
                {formatPercentage(percentageSpent)}
            </progress>
            <div className="progress-text">
                <small>{formatCurrency(spent)} Spent</small>
                <small>{formatCurrency(budgetData.amount - spent)} Remaining</small>
            </div>
            {
                showDelete ? (
                    <div className="flex-sm">
                        <Form method="post" action="delete" onSubmit={(event) => {
                            if (!confirm(`Are you sure you want to delete ${budgetData.name}?`)) {
                                event.preventDefault()
                            }
                        }}>
                            <button type="submit" onClick={() => deleteBudget(budget.id, navigate)} className="btn btn--warning">
                                <span>Delete Budget</span>
                                <TrashIcon width={20} />
                            </button>
                        </Form>
                    </div>
                ) : (
                    <div className="flex-sm">
                        <Link to={`/budget/${id}`} className="btn">
                            <span>View Details</span>
                            <BanknotesIcon width={20} />
                        </Link>
                    </div>
                )
            }
        </div>
    )
}

export default BudgetItem
