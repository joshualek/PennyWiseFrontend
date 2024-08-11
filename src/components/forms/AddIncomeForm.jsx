import { useEffect, useRef } from 'react'
import { useFetcher } from 'react-router-dom'

// library
import { CurrencyDollarIcon } from '@heroicons/react/24/solid'


const AddIncomeForm = () => {
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
            <h2 className="h3">Add Income</h2>
            <fetcher.Form method="post" className="grid-sm" ref={formRef}>
                <div className="grid-xs">
                    <label htmlFor="newIncome">Income</label>
                    <input type="text" 
                        id="newIncome" 
                        name="newIncome" 
                        required />
                </div>
                <div className="grid-xs">
                    <label htmlFor="newIncomeAmount">Amount</label>
                    <input type="number" 
                        name="newIncomeAmount" 
                        id="newIncomeAmount" 
                        placeholder="eg. $500" 
                        step="0.01"
                        inputMode="decimal"
                        min="0"
                        required
                        ref={focusRef} />
                </div>
                <input type="hidden" name="_action" value="createIncome" />
                <button type="submit" className="btn btn--dark" disabled={isSubmitting}>
                    {
                        isSubmitting ? <span>Submitting...</span>
                        : (
                            <>
                                <span>Add Income</span>
                                <CurrencyDollarIcon width={20} />
                            </>
                        )
                    }
                </button>

            </fetcher.Form>
        </div>
    )
}

export default AddIncomeForm
