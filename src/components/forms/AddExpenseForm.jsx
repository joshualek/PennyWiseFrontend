import { useState, useEffect, useRef } from 'react'
import { useFetcher } from 'react-router-dom'

// library
import { PlusCircleIcon } from '@heroicons/react/24/solid'

const AddExpenseForm = ({ budgets }) => {
    const fetcher = useFetcher()
    const [categories] = useState([
        {id: 1, name: 'Food' },
        {id: 2, name: 'Transport' },
        {id: 3, name: 'Shopping' },
        {id: 4, name: 'Others' },
    ]);
    const isSubmitting = fetcher.state === "submitting"
    const formRef = useRef()
    const focusRef = useRef()

    useEffect(() => {
        if (!isSubmitting) {
            formRef.current.reset()
            focusRef.current.focus()
        }
    }, [isSubmitting])

    return (
        <div className="form-wrapper">
            <h2 className="h3">
                Add New <span className="accent"> 
                    {budgets.length === 1 && `${budgets.map((budg) => budg.name)}`}
                </span> Expense
            </h2>

            <fetcher.Form method="post" className="grid-sm" ref={formRef}>
                <div className="expense-inputs">
                    <div className="grid-xs">
                        <label htmlFor="newExpense">Expense Name</label>
                        <input type="text" 
                            name="newExpense" 
                            id="newExpense" 
                            placeholder="eg. Coffee" 
                            ref={focusRef}
                            required />
                    </div>
                </div>
                <div className="grid-xs">
                    <label htmlFor="newExpenseAmount">Amount</label>
                    <input type="number" 
                        name="newExpenseAmount" 
                        id="newExpenseAmount" 
                        placeholder="eg. $5" 
                        step="0.01"
                        inputMode="decimal"
                        min="0"
                        required />
                </div>
                <div className="grid-xs" hidden={budgets.length === 1}>
                    <label htmlFor="newExpenseBudget">Budget Category</label>
                    <select name="newExpenseBudget" id="newExpenseBudget" required> 
                        {
                            budgets
                                .sort((a, b) => a.createdAt - b.createdAt)
                                .map((budget) => {
                                    return (
                                        <option key={budget.id} value={budget.id}>
                                            {budget.name}
                                        </option>
                                    )
                                })
                        }
                    </select>
                </div>
                <div className="grid-xs">
                    <label htmlFor="newExpenseCategory">Category</label>
                    <select name="newExpenseCategory" id="newExpenseCategory" required>
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <input type="hidden" name="_action" value="createExpense" />
                <button type="submit" className="btn btn--dark" disabled={isSubmitting}>
                    {
                        isSubmitting ? <span>Submitting...</span>
                        : (
                            <>
                                <span>Add Expense</span>
                                <PlusCircleIcon width={20} />
                            </>
                        )
                    }
                </button>
            </fetcher.Form>
        </div>
    )
}

export default AddExpenseForm
