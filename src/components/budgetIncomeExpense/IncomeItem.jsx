import { useFetcher } from "react-router-dom"
import { toast } from "react-toastify"


// helpers
import { formatCurrency, deleteItem } from "../helpers";

// Heroicons
import { TrashIcon } from "@heroicons/react/24/solid";

const deleteIncome = async (incomeId) => {
    console.log(`incomeID here is: `, incomeId);
    try {
        await deleteItem(`income/delete/${incomeId}/`);
        toast.success('Income deleted successfully');
    } catch (error) {
        toast.error('There was a problem deleting the income.');
        console.error(error);
    }
};

// IncomeItem component
export const IncomeItem = ({ income }) => {
    const fetcher = useFetcher();

    return (
        <>
            <td>{income.name}</td>
            <td>{formatCurrency(income.amount)}</td>
            <td>{new Date(income.created_at).toLocaleDateString()}</td>
            <td>
                <fetcher.Form method="post">
                    <input type="hidden" name="_action" value="deleteIncome" />
                    <button
                        type="submit"
                        className="btn btn--warning"
                        name="incomeId"
                        value={income.id}
                        onClick={() => deleteIncome(income.id)}
                        aria-label={`Delete ${income.name} income`}>
                        <TrashIcon width={20} />
                    </button>
                </fetcher.Form>
            </td>
        </>
    );
};

export default IncomeItem;