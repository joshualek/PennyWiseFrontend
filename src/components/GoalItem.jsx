import React, { useState, useEffect } from "react";
import { useFetcher } from "react-router-dom";
import { CurrencyDollarIcon, TrashIcon } from "@heroicons/react/24/solid";
import { formatCurrency, fetchData, getGoalsArray } from "../helpers";
import styles from "../styles/GoalItemStyles.js";

const GoalItem = ({ goal, updateGoals }) => {
    const fetcher = useFetcher();
    const [amount, setAmount] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (fetcher.state === "idle") {
            updateGoals();
            setIsAdding(false);
            setIsRedeeming(false);
            setIsDeleting(false);
        }
    }, [fetcher.state, updateGoals]);

    const handleAddSavings = (event) => {
        event.preventDefault();
        if (amount === "") return;

        setIsAdding(true);
        fetcher.submit(
            { goalId: goal.id, amount, _action: "addSavings" },
            { method: "post" }
        );
        setAmount("");
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        fetcher.submit(
            { goalId: goal.id, _action: "deleteGoal" },
            { method: "post" }
        );
    };

    const handleRedeem = async () => {
        setIsRedeeming(true);
        fetcher.submit(
            { goalId: goal.id, _action: "redeemGoal" },
            { method: "post" }
        );
    };

    useEffect(() => {
        if (fetcher.data) {
            console.log("Fetcher Data: ", fetcher.data);
        }
        if (fetcher.error) {
            console.error("Fetcher Error: ", fetcher.error);
        }
    }, [fetcher.data, fetcher.error]);

    const percentage = (goal.current_amount / goal.target_amount) * 100;
    let progressBarColor;

    if (percentage >= 75) {
        progressBarColor = "green";
    } else if (percentage >= 50) {
        progressBarColor = "orange";
    } else {
        progressBarColor = "red";
    }

    return (
        <div className="goal-item" style={styles.goalItem}>
            <div className="progress-text" style={styles.progressText}>
                <h3 style={styles.goalName}>{goal.name}</h3>
                <p style={styles.goalTarget}>Goal: ${formatCurrency(goal.target_amount)}</p>
            </div>
            <div className="progress-bar" style={styles.progressBarContainer}>
                <div
                    className="progress"
                    style={{
                        ...styles.progressBar,
                        width: `${percentage}%`,
                        backgroundColor: progressBarColor,
                    }}
                >
                    {Math.round(percentage)}%
                </div>
            </div>
            <div className="progress-details" style={styles.progressDetails}>
                <div style={styles.amountSaved}>
                    <strong>Saved:</strong> {formatCurrency(goal.current_amount)}
                </div>
                <div style={styles.amountRemaining}>
                    <strong>Remaining:</strong> {formatCurrency(goal.target_amount - goal.current_amount)}
                </div>
            </div>
            <form onSubmit={handleAddSavings} className="grid-xs" style={styles.form}>
                <label htmlFor={`amount-${goal.id}`} style={styles.label}>Add Savings</label>
                <input
                    type="number"
                    id={`amount-${goal.id}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 100"
                    step="0.01"
                    required
                    style={styles.input}
                />
                <button type="submit" className="btn btn--dark" disabled={isAdding} style={styles.button}>
                    {isAdding ? "Adding..." : (
                        <>
                            <span>Add Savings</span>
                            <CurrencyDollarIcon width={20} />
                        </>
                    )}
                </button>
            </form>
            {goal.current_amount >= goal.target_amount && (
                <button onClick={handleRedeem} className="btn btn--success" disabled={isRedeeming} style={styles.redeemButton}>
                    {isRedeeming ? "Redeeming..." : "Redeem Goal"}
                </button>
            )}
            <button onClick={handleDelete} className="btn btn--danger" disabled={isDeleting} style={styles.deleteButton}>
                {isDeleting ? "Deleting..." : (
                    <>
                        <TrashIcon width={20} />
                        <span>Delete Goal</span>
                    </>
                )}
            </button>
        </div>
    );
};


export default GoalItem;
