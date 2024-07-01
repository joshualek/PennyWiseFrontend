import { Navigate, useNavigate } from "react-router-dom";
import { redirect } from "react-router-dom";

// Library
import { toast } from "react-toastify";

// Helpers
import { deleteItem, fetchDataDjango, } from "../helpers";

export async function deleteBudget({ params }) {
    try {
        // When we delete the budget we need to delete all the expenses associated with it
        const associatedExpenses = await fetchExpensesByBudgetId(params.id);
        associatedExpenses.forEach((expense) => {
            deleteItem(expense.id);
        });

        // Delete the specific budget
        deleteItem(params.id); 

        toast.success("Budget deleted successfully.");
        
    } catch (e) {
        throw new Error("There was a problem deleting your budget.");
    }
    return redirect("/dashboard");
}
