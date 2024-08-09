import { useEffect, useRef } from 'react'
import { useFetcher } from 'react-router-dom'

// library
import { CurrencyDollarIcon } from '@heroicons/react/24/solid'

const AddBudgetForm = () => {
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
                        min="0"
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
