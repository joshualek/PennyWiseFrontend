import { useState, useEffect, useRef } from 'react'
import { useFetcher } from 'react-router-dom'

// library
import { CurrencyDollarIcon } from '@heroicons/react/24/solid'

const AddBudgetForm = () => {
    // const [budget, setBudget] = useState([]);
    // const [amount, setAmount] = useState("");
    // const [title, setTitle] = useState("");

    // const getBudgets = () => {
    //     api
    //         .get("/api/budgets/")
    //         .then((res) => res.data)
    //         .then((data) => {
    //             setBudget(data);
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

    // const createBudget = (e) => {
    //     e.preventDefault();
    //     api
    //         .post("/api/budgets/", { content, title })
    //         .then((res) => {
    //             if (res.status === 201) alert("Budget created!");
    //             else alert("Failed to make budget.");
    //             getBudgets();
    //         })
    //         .catch((err) => alert(err));
    // };

    const fetcher = useFetcher()
    const isSubmitting = fetcher.state === "submitting"
    const formRef = useRef()
    const focusRef = useRef()


    useEffect(() => {
        if (!isSubmitting) { // clears the form when fetcher.state is not submitting
            formRef.current.reset()
            focusRef.current.focus() // focus on the first input field aka Budget Name
        }
    },[isSubmitting])

    return (
        <div className="form-wrapper">
            <h2 className="h3">Create Budget</h2>
            <fetcher.Form method="post" className="grid-sm" ref={formRef}>
                <div className="grid-xs">
                    <label htmlFor="newBudget">Budget Name</label>
                    <input type="text" 
                        id="newBudget" 
                        name="newBudget" 
                        placeholder="eg. food" 
                        required />
                </div>
                <div className="grid-xs">
                    <label htmlFor="newBudgetAmount">Amount</label>
                    <input type="number" 
                        name="newBudgetAmount" 
                        id="newBudgetAmount" 
                        placeholder="eg. $500" 
                        step="0.01"
                        inputMode="decimal"
                        required
                        ref={focusRef} />
                </div>
                <input type="hidden" name="_action" value="createBudget" />
                <button type="submit" className="btn btn--dark" disabled={isSubmitting}>
                    {
                        isSubmitting ? <span>Submitting...</span>
                        : (
                            <>
                                <span>Create Budget</span>
                                <CurrencyDollarIcon width={20} />
                            </>
                        )
                    }
                </button>

            </fetcher.Form>
        </div>
    )
}

export default AddBudgetForm