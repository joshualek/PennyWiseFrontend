import { useFetcher } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/solid';

const AddGoalsForm = () => {
    const fetcher = useFetcher();
    const isSubmitting = fetcher.state === "submitting";
    const formRef = useRef();
    const focusRef = useRef();

    useEffect(() => {
        if (!isSubmitting) {
            formRef.current.reset();
            focusRef.current.focus();
        }
    }, [isSubmitting]);

    return (
        <div className="form-wrapper">
            <h2 className="h3">Add a New Goal</h2>
            <fetcher.Form method="post" className="grid-sm" ref={formRef}>
                <div className="grid-xs">
                    <label htmlFor="goalName">Goal Name</label>
                    <input type="text" name="name" id="goalName" placeholder="e.g. New Car" required ref={focusRef} />
                </div>
                <div className="grid-xs">
                    <label htmlFor="targetAmount">Target Amount</label>
                    <input type="number" name="target_amount" id="targetAmount" placeholder="e.g. 10000" step="0.01" required />
                </div>
                <input type="hidden" name="_action" value="createGoal" />
                <button type="submit" className="btn btn--dark" disabled={isSubmitting}>
                    {isSubmitting ? <span>Submitting...</span> : (
                        <>
                            <span>Add Goal</span>
                            <CurrencyDollarIcon width={20} />
                        </>
                    )}
                </button>
            </fetcher.Form>
        </div>
    );
};

export default AddGoalsForm;
