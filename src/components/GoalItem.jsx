import React, { useState } from "react";
import { useFetcher } from "react-router-dom";
import { CurrencyDollarIcon, TrashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import { formatCurrency } from "../helpers";

const GoalItem = ({ goal, updateGoals }) => {
    const fetcher = useFetcher();
    const isSubmitting = fetcher.state === "submitting";
    const [amount, setAmount] = useState("");

    const handleAddSavings = (event) => {
        event.preventDefault();
        if (amount === "") return;

        fetcher.submit(
            { goalId: goal.id, amount, _action: "addSavings" },
            { method: "post" }
        );
        setAmount("");
        updateGoals();
    };

    const handleRedeem = () => {
        fetcher.submit(
            { goalId: goal.id, _action: "redeemGoal" },
            { method: "post" }
        );
        updateGoals();
    };

    const handleDelete = () => {
        fetcher.submit(
            { goalId: goal.id, _action: "deleteGoal" },
            { method: "post" }
        );
        updateGoals();
    };

    return (
        <div className="goal-item">
            <div className="progress-text">
                <h3>{goal.name}</h3>
                <p>{formatCurrency(goal.target_amount)} Goal</p>
            </div>
            <progress max={goal.target_amount} value={goal.current_amount}>
                {Math.round((goal.current_amount / goal.target_amount) * 100)}%
            </progress>
            <div className="progress-text">
                <small>{formatCurrency(goal.current_amount)} Saved</small>
                <small>{formatCurrency(goal.target_amount - goal.current_amount)} Remaining</small>
            </div>
            <form onSubmit={handleAddSavings} className="grid-xs">
                <label htmlFor={`amount-${goal.id}`}>Add Savings</label>
                <input
                    type="number"
                    id={`amount-${goal.id}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 100"
                    step="0.01"
                    required
                />
                <button type="submit" className="btn btn--dark" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : (
                        <>
                            <span>Add Savings</span>
                            <CurrencyDollarIcon width={20} />
                        </>
                    )}
                </button>
            </form>
            {goal.current_amount >= goal.target_amount && (
                <button onClick={handleRedeem} className="btn btn--success">
                    Redeem Goal
                </button>
            )}
            <button onClick={handleDelete} className="btn btn--danger">
                <TrashIcon width={20} />
                <span>Delete Goal</span>
            </button>
        </div>
    );
};

export default GoalItem;
