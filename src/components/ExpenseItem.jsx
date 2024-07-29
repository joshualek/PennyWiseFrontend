import { useState, useEffect } from "react"
import { Link, useFetcher } from "react-router-dom"
import { toast } from "react-toastify"

// helpers
import { calculateSpentByBudget, deleteItem, formatCurrency, getBudgetsArray } from "../helpers"

// Heroicons
import { TrashIcon } from "@heroicons/react/24/solid"

const deleteExpense = async (expenseId) => {
    console.log(`expenseID here is: `, expenseId)
    try {
        await deleteItem(`expenses/delete/${expenseId}/`);
        toast.success('Expense deleted successfully');
    } catch (error) {
        toast.error('There was a problem deleting the expense.');
        console.error(error);
    }
};

const categories = [
    { id: 1, name: 'Food', color: '#FF8C00' }, // Less bright orange
    { id: 2, name: 'Transport', color: '#32CD32' }, // Less bright green
    { id: 3, name: 'Shopping', color: '#4682B4' }, // Less bright blue
    { id: 4, name: 'Others', color: '#DDA0DD' } // Less bright purple
];

const getCategoryById = (id) => categories.find(category => category.id === id);

export const ExpenseItem = ({ expense }) => {
    const fetcher = useFetcher()
    const [budget, setBudget] = useState(null);
    const [spent, setSpent] = useState(0);



    useEffect(() => {
        const fetchBudgetData = async () => {
            const budgets = await getBudgetsArray();
            const matchedBudget = budgets.find(budget => budget.id === expense.budget);
            setBudget(matchedBudget);
        };

        const fetchSpentAmount = async () => {
            const spentAmount = await calculateSpentByBudget(expense.budget);
            setSpent(spentAmount);
        };

        fetchBudgetData();
        fetchSpentAmount();
    }, [expense.budget]);

    if (!budget) {
        return null;
    }

    const { id, amount } = budget;
    const percentageSpent = spent / amount;

    // Determine accent color based on percentage spent
    let accentColor = "206, 71%, 35%"; // Default color in HSL format
    if (percentageSpent >= 0.90) {
        accentColor = "0, 100%, 50%"; // Red
    } else if (percentageSpent >= 0.75) {
        accentColor = "36, 100%, 50%"; // Amber
    }

    // Get category details
    const categoryDetails = getCategoryById(expense.category);

    return (
        <>
            <td>{expense.name}</td>
            <td>{formatCurrency(expense.amount)}</td>
            <td>{new Date(expense.created_at).toLocaleDateString()}</td>
            <td><Link
                to={`/budget/${budget.id}`}
                style={{ "--accent": accentColor }}>{budget.name}
            </Link></td>
            <td>
                {categoryDetails && (
                    <span
                    style={{
                        backgroundColor: categoryDetails.color,
                        borderRadius: '20px', // Adjust border radius
                        padding: '6px 14px', // Adjust padding
                        color: 'white',
                        fontSize: '1em', // Adjust font size
                        display: 'inline-block',
                        textAlign: 'center'
                    }}
                    >
                        {categoryDetails.name}
                    </span>
                )}
            </td>
            <td>
                <fetcher.Form method="post">
                    <input type="hidden" name="_action" value="deleteExpense" />
                    <button type="submit" className="btn btn--warning"
                        name="expenseId" value={expense.id} onClick={() => deleteExpense(expense.id)}
                        aria-label={`Delete ${expense.name} expense`}>
                        <TrashIcon width={20} />
                    </button>
                </fetcher.Form>
            </td>
        </>
    )
}

export default ExpenseItem