import React, { useState, useEffect } from "react";
import { useFetcher } from "react-router-dom";
import { CurrencyDollarIcon, TrashIcon } from "@heroicons/react/24/solid";
import { formatCurrency } from "../helpers";

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

const styles = {
    goalItem: {
        border: '1px solid #ccc',
        borderRadius: '25px',
        padding: '16px',
        margin: '8px 0',
        backgroundColor: `var(--bkg)`,
        width: `calc(100% / 4.5)`,
    },
    progressText: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
    },
    goalName: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
    },
    goalTarget: {
        fontSize: '0.875rem',
        color: '#1a6299',
    },
    progressBarContainer: {
        width: '100%',
        backgroundColor: '#eee',
        borderRadius: '20px',
        overflow: 'hidden',
        height: '24px',
        margin: '10px 0 10px 0',
        position: 'relative',
    },
    progressBar: {
        height: '100%',
        color: '#fff',
        textAlign: 'center',
        lineHeight: '24px',
        fontSize: '0.875rem',
        borderRadius: '20px',
        transition: 'width 0.3s ease-in-out',
    },
    progressDetails: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    amountSaved: {
        fontSize: '1rem',
        fontWeight: 'bold',
    },
    amountRemaining: {
        fontSize: '1rem',
        fontWeight: 'bold',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '16px',
    },
    label: {
        marginBottom: '4px',
        fontSize: '0.875rem',
    },
    input: {
        marginBottom: '8px',
        padding: '8px',
        fontSize: '1rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '8px',
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: '20px',
        border: 'none',
        cursor: 'pointer',
    },
    redeemButton: {
        backgroundColor: '#28a745',
        color: '#fff',
        padding: '8px',
        borderRadius: '20px',
        border: 'none',
        cursor: 'pointer',
        marginBottom: '8px',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        color: '#fff',
        padding: '8px',
        borderRadius: '20px',
        border: 'none',
        cursor: 'pointer',
    },
};

export default GoalItem;
