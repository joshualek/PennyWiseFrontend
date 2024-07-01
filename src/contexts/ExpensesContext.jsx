import React, { createContext, useContext, useState, useEffect } from 'react';
import { createExp, deleteItem, getBudgetsArray } from '../helpers'; // Assuming this function fetches all expenses

const ExpensesContext = createContext();

export const useExpenses = () => useContext(ExpensesContext);

export const ExpensesProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            const fetchedExpenses = await getBudgetsArray(); // Adjust this to your actual API call
            setExpenses(fetchedExpenses);
        };

        fetchExpenses();
    }, []);

    const refreshExpenses = async () => {
        const fetchedExpenses = await getBudgetsArray(); // Adjust this to your actual API call
        setExpenses(fetchedExpenses);
    };

    const createExpense = async (newExpense) => {
        await createExp(newExpense); 
        await refreshExpenses();
    };

    const deleteExpense = async (expenseId) => {
        await deleteItem(expenseId); 
        await refreshExpenses(); // Refresh the expenses list after deletion
    };

    return (
        <ExpensesContext.Provider value={{ expenses, refreshExpenses }}>
            {children}
        </ExpensesContext.Provider>
    );
};